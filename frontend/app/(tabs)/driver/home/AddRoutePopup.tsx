import { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: (routes: string[]) => void;
};

export default function AddRoutePopup({ visible, onClose, onSave }: Props) {
    const [routeCount, setRouteCount] = useState<number | null>(null);
    const [routes, setRoutes] = useState<string[]>([]);

    const handleConfirmCount = () => {
        if (!routeCount || routeCount <= 0) return;
        setRoutes(Array(routeCount).fill(""));
    };

    const updateRouteValue = (index: number, value: string) => {
        const updated = [...routes];
        updated[index] = value;
        setRoutes(updated);
    };

    const handleSave = () => {
        onSave(routes);
        reset();
    };

    const reset = () => {
        setRouteCount(null);
        setRoutes([]);
        onClose();
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

                    <Text style={styles.title}>Add Routes</Text>

                    {/* Step 1: choose number */}
                    {!routes.length ? (
                        <>
                            <Text style={styles.label}>How many routes?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter a number"
                                keyboardType="numeric"
                                onChangeText={(t) => setRouteCount(Number(t))}
                            />

                            <Pressable style={styles.button} onPress={handleConfirmCount}>
                                <Text style={styles.buttonText}>Next</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <ScrollView style={{ maxHeight: 300 }}>
                                {routes.map((r, i) => (
                                    <View key={i} style={{ marginBottom: 12 }}>
                                        <Text style={styles.label}>Route {i + 1}</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter destination"
                                            value={routes[i]}
                                            onChangeText={(v) => updateRouteValue(i, v)}
                                        />
                                    </View>
                                ))}
                            </ScrollView>

                            <Pressable
                                style={[styles.button, { backgroundColor: "#0f172a" }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Save Routes</Text>
                            </Pressable>
                        </>
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
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 12,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "600",
    },
});
