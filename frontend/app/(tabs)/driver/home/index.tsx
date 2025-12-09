import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Navbar from "./Navbar";
import AddRoutePopup from "./AddRoutePopup";
import ViewRoutesPopup from "./ViewRoutesPopup";
import ViewAccountPopup from "./ViewAccountPopup";
import { addNewRoute, getAllRoutes, deleteRoute } from "../services/routes";
import { logout } from "../services/auth";
import { updateLocation } from "../services/me";

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
    const [routes, setRoutes] = useState<string[]>([]);
    const [showViewRoutes, setShowViewRoutes] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    useEffect(() => {
        const loadRoutes = async () => {
            try {
                const names = await getAllRoutes(); // now string[]
                setRoutes(names);
            } catch (err) {
                console.error("Failed to load routes:", err);
            }
        };

        loadRoutes();
    }, []);


    useEffect(() => {
        if (!region || routes.length === 0) return;

        let isMounted = true;

        const pollLocation = async () => {
            try {
                const randomRoute =
                    routes[Math.floor(Math.random() * routes.length)];

                const payload = {
                    latitude: region.latitude,
                    longitude: region.longitude,
                    currRouteName: randomRoute,
                    customComments: "No Comment"
                };

                await updateLocation(payload);
                if (isMounted) {
                    console.log("Sent location + route:", payload);
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
    }, [region, routes]);

    // 🔥 NEW: save a single route with lat/long
    const handleSaveRoute = async (route: NewRoutePayload) => {
        try {
            await addNewRoute(
                route.routeName,
                route.destinationLat,
                route.destinationLong,
                route.customComments ?? "No Comment"
            );

            // Just keep the name locally (used for random route selection)
            setRoutes((prev) => [...prev, route.routeName]);

            setShowAddRoute(false);
        } catch (err) {
            console.error("Failed to save route:", err);
        }
    };

    const handleDelete = async (index: number) => {
        try {
            const routeName = routes[index];
            if (!routeName) return;

            await deleteRoute(routeName);
            setRoutes((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Failed to delete route:", err);
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

            <ViewRoutesPopup
                visible={showViewRoutes}
                routes={routes}
                onClose={() => setShowViewRoutes(false)}
                onDelete={handleDelete}
            />

            {/* 👇 updated onSave */}
            <AddRoutePopup
                visible={showAddRoute}
                onClose={() => setShowAddRoute(false)}
                onSave={handleSaveRoute}
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
