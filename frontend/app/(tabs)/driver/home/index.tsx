import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Circle } from "react-native-maps";
import * as Location from "expo-location";
import Navbar from "./Navbar";
import AddRoutePopup from "./AddRoutePopup";
import ViewRoutesPopup from "./ViewRoutesPopup";
import { router } from "expo-router";
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

    // -----------------------------
    // TODO: Implement route logic later
    // -----------------------------
    const handleSaveRoutes = (routes: string[]) => {
        // ⚠️ Unimplemented — but structured for future use
        // TODO: Save to backend / draw on map / store locally

        console.log("handleSaveRoutes called with:", routes);

        // Close popup
        setShowAddRoute(false);
    };


    const handleLogout = () => {
        // Clear token or session here if needed
        router.push("/driver/login");
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
            />


            <ViewRoutesPopup
                visible={showViewRoutes}
                routes={routes}
                onClose={() => setShowViewRoutes(false)}
                onDelete={(index) => {
                    const updated = routes.filter((_, i) => i !== index);
                    setRoutes(updated);
                }}
            />

            <AddRoutePopup
                visible={showAddRoute}
                onClose={() => setShowAddRoute(false)}
                onSave={handleSaveRoutes}
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
                >
                </MapView>
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
