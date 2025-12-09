import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    FlatList,
    Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchPlaces, type PlaceResult } from "../../../../scripts/mapboxSearch";

export type NewRoutePayload = {
    routeName: string;
    destinationLat: number;
    destinationLong: number;
    customComments?: string;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: (route: NewRoutePayload) => void;
};

export default function AddRoutePopup({ visible, onClose, onSave }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const reset = () => {
        setSearchQuery("");
        setSearchResults([]);
        setIsSearching(false);
        onClose();
    };

    // 🔍 AUTOCOMPLETE SEARCH (same pattern as navbar/home)
    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!searchQuery || searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }

            try {
                setIsSearching(true);
                const places = await searchPlaces(searchQuery);
                setSearchResults(places);
            } catch (err) {
                console.log("searchPlaces error in AddRoutePopup:", err);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    // single tap -> use place, call onSave, close
    const handleSelectPlace = (place: PlaceResult) => {
        Keyboard.dismiss();

        onSave({
            routeName: place.name,
            destinationLat: place.latitude,
            destinationLong: place.longitude,
            customComments: "No Comment", // can add a comments field later
        });

        reset();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            {/* Background overlay — clicking closes */}
            <Pressable style={styles.overlay} onPress={reset}>
                {/* Inner card — clicking inside does NOT close */}
                <Pressable style={styles.card} onPress={() => { }}>
                    {/* X Button */}
                    <Pressable style={styles.closeIcon} onPress={reset}>
                        <Ionicons name="close" size={28} color="black" />
                    </Pressable>

                    <Text style={styles.title}>Add Route</Text>

                    <Text style={styles.label}>Destination</Text>
                    <View style={styles.searchRow}>
                        <Ionicons
                            name="search"
                            size={18}
                            color="#6b7280"
                            style={{ marginRight: 6 }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Search destination"
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                            }}
                        />
                    </View>

                    {/* 🔽 AUTOCOMPLETE DROPDOWN */}
                    {searchResults.length > 0 && (
                        <View style={styles.dropdown}>
                            <FlatList
                                data={searchResults}
                                keyboardShouldPersistTaps="handled"
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => handleSelectPlace(item)}
                                        style={styles.dropdownItem}
                                    >
                                        <Text style={styles.dropdownTitle}>{item.name}</Text>
                                        <Text style={styles.dropdownSubtitle}>{item.address}</Text>
                                    </Pressable>
                                )}
                            />
                        </View>
                    )}

                    {isSearching && (
                        <Text style={styles.searchHint}>Searching…</Text>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "85%",
        padding: 20,
        paddingTop: 36,
        borderRadius: 16,
        backgroundColor: "white",
        position: "relative",
    },
    closeIcon: {
        position: "absolute",
        top: 12,
        right: 12,
        padding: 4,
        zIndex: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        fontWeight: "500",
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },

    dropdown: {
        marginTop: 10,
        maxHeight: 220,
        borderRadius: 10,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        overflow: "hidden",
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: "#f3f4f6",
    },
    dropdownTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111827",
    },
    dropdownSubtitle: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },
    searchHint: {
        marginTop: 8,
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
    },
});
