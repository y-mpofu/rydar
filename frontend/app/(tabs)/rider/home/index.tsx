// app/(tabs)/rider/home/index.tsx
import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

export default function HomeScreen() {
    const [region, setRegion] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            // Start watching user position in real time
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000,     // update every 2s
                    distanceInterval: 5,    // or every 5 meters
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

            // Cleanup listener when component unmounts
            return () => subscription.remove();
        })();
    }, []);

    return (
        <View style={styles.container}>
            {region && (
                <MapView
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    loadingEnabled={true}
                >
                    <Circle
                        center={{
                            latitude: region.latitude,
                            longitude: region.longitude,
                        }}
                        radius={1000} // 1 km radius
                        strokeColor="rgba(0, 122, 255, 0.6)"
                        fillColor="rgba(0, 122, 255, 0.25)"
                        strokeWidth={2}
                    />
                </MapView>

            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});
