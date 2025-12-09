import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { logout } from "../services/auth";
import { updateLocation } from "../services/me";
import {
  addNewRoute,
  deleteRoute,
  getAllRoutes,
  getSelectedRoute,
  setSelectedRoute,
  updateRoute,
  type DriverRoute,
} from "../services/routes"; // 👈 UPDATED IMPORTS
import AddRoutePopup from "./AddRoutePopup";
import EditRoutePopup from "./EditRoutePopup"; // 👈 NEW IMPORT
import Navbar from "./Navbar";
import ViewAccountPopup from "./ViewAccountPopup";
import ViewRoutesPopup from "./ViewRoutesPopup";

// 👇 type that AddRoutePopup will pass into onSave
export type NewRoutePayload = {
  routeName: string;
  destinationLat: number;
  destinationLong: number;
  customComments?: string;
};

export default function HomeScreen() {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [showAddRoute, setShowAddRoute] = useState(false);
  const [routes, setRoutes] = useState<DriverRoute[]>([]); // 👈 CHANGED: Now stores full DriverRoute objects
  const [showViewRoutes, setShowViewRoutes] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showEditRoute, setShowEditRoute] = useState(false); // 👈 NEW STATE
  const [routeToEdit, setRouteToEdit] = useState<DriverRoute | null>(null); // 👈 NEW STATE
  const [selectedRoute, setSelectedRouteState] = useState<string | null>(null); // 👈 NEW: Currently selected/broadcasting route

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const fullRoutes = await getAllRoutes(); // 👈 CHANGED: Now returns DriverRoute[]
        setRoutes(fullRoutes);

        // 👇 NEW: Load selected route from storage
        const saved = await getSelectedRoute();
        setSelectedRouteState(saved);
      } catch (err) {
        console.error("Failed to load routes:", err);
      }
    };

    loadRoutes();
  }, []);

  useEffect(() => {
    // 👇 CHANGED: Only broadcast if a route is selected
    if (!region || !selectedRoute) return;

    let isMounted = true;

    const pollLocation = async () => {
      try {
        // 👇 CHANGED: Find the selected route object
        const activeRoute = routes.find((r) => r.routeName === selectedRoute);
        if (!activeRoute) {
          console.log("Selected route not found in routes list");
          return;
        }

        const payload = {
          latitude: region.latitude,
          longitude: region.longitude,
          currRouteName: activeRoute.routeName,
          customComments: activeRoute.customComments || "No Comment",
        };

        await updateLocation(payload);
        if (isMounted) {
          console.log("📡 Broadcasting route:", payload);
        }
      } catch (err) {
        console.error("Failed to update location:", err);
      }
    };

    // Initial send
    pollLocation();

    // Every 3 seconds
    const interval = setInterval(pollLocation, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [region, selectedRoute, routes]); // 👈 CHANGED: Added selectedRoute dependency

  // 🔥 Save a new route
  const handleSaveRoute = async (route: NewRoutePayload) => {
    try {
      await addNewRoute(
        route.routeName,
        route.destinationLat,
        route.destinationLong,
        route.customComments ?? "No Comment"
      );

      // 👇 CHANGED: Add full route object to state
      setRoutes((prev) => [
        ...prev,
        {
          routeName: route.routeName,
          destinationLat: route.destinationLat,
          destinationLong: route.destinationLong,
          customComments: route.customComments,
        },
      ]);

      setShowAddRoute(false);
    } catch (err) {
      console.error("Failed to save route:", err);
    }
  };

  // 👇 CHANGED: Now receives routeName instead of index
  const handleDelete = async (routeName: string) => {
    try {
      await deleteRoute(routeName);
      setRoutes((prev) => prev.filter((r) => r.routeName !== routeName));
    } catch (err) {
      console.error("Failed to delete route:", err);
    }
  };

  // 👇 NEW: Handle opening edit popup
  const handleEditRoute = (route: DriverRoute) => {
    setRouteToEdit(route);
    setShowEditRoute(true);
    setShowViewRoutes(false); // Close the view routes popup
  };

  // 👇 NEW: Handle saving edited route
  const handleSaveEditedRoute = async (
    oldName: string,
    newName: string,
    comments: string
  ) => {
    try {
      if (!routeToEdit) return;

      await updateRoute(
        oldName,
        newName,
        routeToEdit.destinationLat,
        routeToEdit.destinationLong,
        comments
      );

      // Update local state
      setRoutes((prev) =>
        prev.map((r) =>
          r.routeName === oldName
            ? { ...r, routeName: newName, customComments: comments }
            : r
        )
      );

      setShowEditRoute(false);
      setRouteToEdit(null);
    } catch (err) {
      console.error("Failed to update route:", err);
    }
  };

  // 👇 NEW: Handle selecting which route to broadcast
  const handleSelectRoute = async (routeName: string) => {
    try {
      await setSelectedRoute(routeName);
      setSelectedRouteState(routeName);
      console.log("✅ Selected route for broadcasting:", routeName);
    } catch (err) {
      console.error("Failed to select route:", err);
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (loc) => {
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          });
        }
      );
      return () => subscription.remove();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Navbar
        onAddRoute={() => setShowAddRoute(true)}
        onViewRoutes={() => setShowViewRoutes(true)}
        onLogout={handleLogout}
        onUserPress={() => setShowAccount(true)}
      />

      <ViewAccountPopup
        visible={showAccount}
        onClose={() => setShowAccount(false)}
      />

      {/* 👇 UPDATED: Added selectedRoute and onSelectRoute props */}
      <ViewRoutesPopup
        visible={showViewRoutes}
        routes={routes}
        selectedRoute={selectedRoute}
        onClose={() => setShowViewRoutes(false)}
        onDelete={handleDelete}
        onEdit={handleEditRoute}
        onSelectRoute={handleSelectRoute} // 👈 NEW PROP
      />

      <AddRoutePopup
        visible={showAddRoute}
        onClose={() => setShowAddRoute(false)}
        onSave={handleSaveRoute}
      />

      {/* 👇 NEW: Edit Route Popup */}
      <EditRoutePopup
        visible={showEditRoute}
        route={routeToEdit}
        onClose={() => {
          setShowEditRoute(false);
          setRouteToEdit(null);
        }}
        onSave={handleSaveEditedRoute}
      />

      {region && (
        <MapView
          style={styles.map}
          region={region}
          mapType="standard"
          customMapStyle={[]}
          loadingEnabled={false}
          loadingBackgroundColor="transparent"
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  map: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
