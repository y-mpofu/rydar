import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { DriverRoute } from "../services/routes";

type Props = {
    visible: boolean;
    routes: DriverRoute[]; // 👈 CHANGED: Now accepts full DriverRoute objects
    onClose: () => void;
    onDelete?: (routeName: string) => void; // 👈 CHANGED: Now passes routeName instead of index
    onEdit?: (route: DriverRoute) => void; // 👈 NEW: Callback when route is clicked for editing
};

export default function ViewRoutesPopup({ visible, routes, onClose, onDelete, onEdit }: Props) {
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
                                <Pressable
                                    key={i}
                                    style={styles.routeRow}
                                    onPress={() => onEdit && onEdit(route)} // 👈 NEW: Make route clickable
                                >
                                    <View style={styles.routeInfo}>
                                        {/* Route Name */}
                                        <Text style={styles.routeText}>
                                            {i + 1}. {route.routeName}
                                        </Text>
                                        
                                        {/* Comments - Show if exists */}
                                        {route.customComments && (
                                            <Text style={styles.commentsText}>
                                                "{route.customComments}"
                                            </Text>
                                        )}
                                    </View>

                                    {/* Delete Button */}
                                    {onDelete && (
                                        <Pressable
                                            onPress={() => onDelete(route.routeName)} // 👈 CHANGED: Pass routeName
                                            style={styles.deleteButton}
                                        >
                                            <Text style={styles.deleteText}>Delete</Text>
                                        </Pressable>
                                    )}
                                </Pressable>
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    routeInfo: {
        flex: 1,
        marginRight: 10,
    },
    routeText: {
        fontSize: 16,
        color: "#111",
        fontWeight: "500",
    },
    commentsText: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        marginTop: 4,
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