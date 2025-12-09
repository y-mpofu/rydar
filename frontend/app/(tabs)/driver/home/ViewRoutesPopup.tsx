import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    visible: boolean;
    routes: string[];
    onClose: () => void;
    onDelete?: (index: number) => void;
};

export default function ViewRoutesPopup({ visible, routes, onClose, onDelete }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            {/* Overlay — clicking closes */}
            <Pressable style={styles.overlay} onPress={onClose}>
                {/* Inner card — press does NOT close */}
                <Pressable style={styles.card} onPress={() => { }}>

                    {/* X button */}
                    <Pressable style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={28} color="black" />
                    </Pressable>

                    <Text style={styles.title}>Saved Routes</Text>

                    {/* No routes */}
                    {routes.length === 0 ? (
                        <Text style={styles.emptyText}>No routes added yet.</Text>
                    ) : (
                        <ScrollView style={{ maxHeight: 320 }}>
                            {routes.map((route, i) => (
                                <View key={i} style={styles.routeRow}>
                                    <Text style={styles.routeText}>
                                        {i + 1}. {route}
                                    </Text>

                                    {onDelete && (
                                        <Pressable
                                            onPress={() => onDelete(i)}
                                            style={styles.deleteButton}
                                        >
                                            <Text style={styles.deleteText}>Delete</Text>
                                        </Pressable>
                                    )}

                                </View>
                            ))}
                        </ScrollView>
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
        right: 12,
        top: 12,
        padding: 4,
        zIndex: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 14,
    },
    emptyText: {
        textAlign: "center",
        color: "#555",
        fontSize: 16,
        marginVertical: 20,
    },
    routeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    routeText: {
        fontSize: 16,
        color: "#111",
        flexShrink: 1,
    },
    deleteButton: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: "#fee2e2",
    },
    deleteText: {
        color: "#b91c1c",
        fontWeight: "600",
    },
});
