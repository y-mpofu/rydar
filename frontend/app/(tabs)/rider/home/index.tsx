import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Keyboard } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Navbar from "./Navbar";
import ViewAccountPopup from "./ViewAccountPopup";
import DriverDetailPopup from "./DriverDetailPopup";
import { driversNearby, type NearbyDriver } from "../services/drivers";
import { searchPlaces, type PlaceResult } from "../../../../scripts/mapboxSearch";

type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

type Destination = {
    latitude: number;
    longitude: number;
    name: string;
    address?: string;
};

export default function HomeScreen() {
    const mapRef = useRef<MapView | null>(null);

    const [region, setRegion] = useState<Region | null>(null);
    const [userRegion, setUserRegion] = useState<Region | null>(null);
    const [nearby, setNearby] = useState<NearbyDriver[]>([]);
    const [showAccount, setShowAccount] = useState(false);
    const [results, setResults] = useState<PlaceResult[]>([]);
    const [query, setQuery] = useState("");
    const [destination, setDestination] = useState<Destination | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<NearbyDriver | null>(null);
    const [showDriverDetail, setShowDriverDetail] = useState(false);

    // --------------------------
    // AUTOCOMPLETE SEARCH
    // --------------------------
    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            try {
                const places = region
                    ? await searchPlaces(query, region.longitude, region.latitude)
                    : await searchPlaces(query);

                setResults(places);
            } catch (e) {
                console.log("searchPlaces error:", e);
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, region]);

    // --------------------------
    // USER LOCATION TRACKING (for blue dot + initial center)
    // --------------------------
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
                    const initialRegion: Region = {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        latitudeDelta: 0.025,
                        longitudeDelta: 0.025,
                    };

                    // remember user's region
                    setUserRegion(initialRegion);

                    // only set as map region on first load
                    setRegion((prev) => (prev ? prev : initialRegion));
                }
            );

            return () => subscription.remove();
        })();
    }, []);

    // --------------------------
    // 👇 NEW: POLL FOR NEARBY DRIVERS EVERY 3 SECONDS
    // --------------------------
    useEffect(() => {
        if (!destination) return; // Only poll when destination is selected

        let isMounted = true;

        const fetchDrivers = async () => {
            try {
                const res = await driversNearby(
                    destination.latitude,
                    destination.longitude,
                    1000,
                    20,
                    destination.name
                );
                if (isMounted) {
                    setNearby(res.nearbyDrivers);
                    console.log("Updated nearby drivers:", res.nearbyDrivers.length);
                }
            } catch (err) {
                console.error("Failed to poll driversNearby:", err);
            }
        };

        // Initial fetch
        fetchDrivers();

        // Poll every 3 seconds
        const interval = setInterval(fetchDrivers, 3000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [destination]);

    // --------------------------
    // RECENTER (to current region – user or destination)
    // --------------------------
    const handleRecenter = () => {
        if (!region || !mapRef.current) return;
        mapRef.current.animateToRegion(region, 800);
    };

    // --------------------------
    // 👇 UPDATED: STOP CHECKING - Clear destination + reset to home
    // --------------------------
    const handleStopChecking = () => {
        setDestination(null);
        setNearby([]);
        setQuery("");
        setResults([]);

        // Recenter back to user's current location
        if (userRegion) {
            setRegion(userRegion);
            mapRef.current?.animateToRegion(userRegion, 600);
        }
    };

    // --------------------------
    // CLEAR DESTINATION (X button on badge)
    // --------------------------
    const handleClearDestination = () => {
        handleStopChecking(); // Same as stop checking
    };

    // --------------------------
    // HANDLE PLACE SELECTION
    // Take user there, zoom in, drop marker, clear results, load nearby drivers
    // --------------------------
    const handleSelectPlace = async (place: PlaceResult) => {
        Keyboard.dismiss();

        const destRegion: Region = {
            latitude: place.latitude,
            longitude: place.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };

        // Center map on the destination and zoom in
        setRegion(destRegion);
        mapRef.current?.animateToRegion(destRegion, 600);

        // Save destination so we can place a marker + show address
        setDestination({
            latitude: place.latitude,
            longitude: place.longitude,
            name: place.name,
            address: place.address,
        });

        // Clear search input and results
        setQuery("");
        setResults([]);

        // Initial fetch will happen in the polling useEffect
    };

    // --------------------------
    // LABEL FOR DRIVER COUNT
    // --------------------------
    const driverCountLabel =
        destination != null
            ? nearby.length === 0
                ? "No drivers found"
                : `${nearby.length} driver${nearby.length > 1 ? "s" : ""} nearby`
            : "";

    return (
        <View style={styles.container}>
            {/* 🔵 Navbar */}
            <Navbar
                onUserPress={() => setShowAccount(true)}
                onSearch={setQuery}
                value={query}
            />

            <ViewAccountPopup
                visible={showAccount}
                onClose={() => setShowAccount(false)}
            />

            {/* 🔽 AUTOCOMPLETE DROPDOWN */}
            {results.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={results}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelectPlace(item)}
                                style={styles.dropdownItem}
                            >
                                <Text style={styles.dropdownTitle}>{item.name}</Text>
                                <Text style={styles.dropdownSubtitle}>{item.address}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {/* 🏁 DESTINATION + DRIVER COUNT BADGE */}
            {destination && (
                <View style={styles.driverCountBadge}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.destinationName} numberOfLines={1}>
                            {destination.name}
                        </Text>
                        {destination.address && (
                            <Text style={styles.destinationAddress} numberOfLines={1}>
                                {destination.address}
                            </Text>
                        )}

                        <View style={styles.driverCountRow}>
                            <Ionicons name="car-sport-outline" size={16} color="#111827" />
                            <Text style={styles.driverCountText}>{driverCountLabel}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleClearDestination} style={styles.clearButton}>
                        <Ionicons name="close" size={18} color="#6b7280" />
                    </TouchableOpacity>
                </View>
            )}

            {/* 👇 NEW: STOP CHECKING BUTTON */}
            {destination && (
                <TouchableOpacity style={styles.stopCheckingButton} onPress={handleStopChecking}>
                    <Ionicons name="stop-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.stopCheckingText}>Stop Checking</Text>
                </TouchableOpacity>
            )}

            {/* 🗺️ MAP */}
            {region && (
                <>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        region={region}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                    >
                        {/* 📍 Destination marker */}
                        {destination && (
                            <Marker
                                coordinate={{
                                    latitude: destination.latitude,
                                    longitude: destination.longitude,
                                }}
                                title={destination.name}
                                description={destination.address}
                            />
                        )}

                        {/* 🚗 Drivers returned from /drivers/nearby */}
                        {nearby.map((driver) => (
                            <Marker
                                key={driver.userId}
                                coordinate={{
                                    latitude: driver.latitude,
                                    longitude: driver.longitude,
                                }}
                                title={driver.currRouteName || "Driver"}
                                onPress={() => {
                                    setSelectedDriver(driver);
                                    setShowDriverDetail(true);
                                }}
                            >
                                <View style={styles.driverMarker}>
                                    <Ionicons name="car-sharp" size={28} />
                                </View>
                            </Marker>
                        ))}
                    </MapView>

                    {/* 🔵 RECENTER BUTTON */}
                    <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
                        <Ionicons name="locate" size={28} color="black" />
                    </TouchableOpacity>
                </>
            )}

            {/* Driver Detail Popup */}
            <DriverDetailPopup
                visible={showDriverDetail}
                driver={selectedDriver}
                onClose={() => {
                    setShowDriverDetail(false);
                    setSelectedDriver(null);
                }}
            />
        </View>
    );
}

// --------------------------
// 💅 STYLES
// --------------------------
const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },

    dropdown: {
        position: "absolute",
        top: 110,
        width: "90%",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 12,
        paddingVertical: 6,
        zIndex: 100,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },

    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    dropdownTitle: {
        fontWeight: "600",
        fontSize: 16,
    },

    dropdownSubtitle: {
        color: "#666",
        fontSize: 14,
        marginTop: 2,
    },

    driverMarker: {
        backgroundColor: "white",
        padding: 4,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    recenterButton: {
        position: "absolute",
        bottom: 30,
        right: 20,
        backgroundColor: "white",
        padding: 14,
        borderRadius: 40,
        elevation: 5,
    },

    driverCountBadge: {
        position: "absolute",
        top: 110,
        right: 20,
        left: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
        zIndex: 105,
        gap: 8,
    },

    destinationName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },

    destinationAddress: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },

    driverCountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 6,
    },

    driverCountText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#111827",
    },

    clearButton: {
        padding: 4,
    },

    // 👇 NEW: Stop Checking Button
    stopCheckingButton: {
        position: "absolute",
        bottom: 30,
        left: 20,
        backgroundColor: "#ef4444", // Red color
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },

    stopCheckingText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
});