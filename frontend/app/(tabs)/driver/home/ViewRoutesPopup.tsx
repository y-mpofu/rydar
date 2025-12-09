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
    routes: DriverRoute[];
    selectedRoute: string | null; // 👈 NEW: Currently selected/broadcasting route
    onClose: () => void;
    onDelete?: (routeName: string) => void;
    onEdit?: (route: DriverRoute) => void;
    onSelectRoute?: (routeName: string) => void; // 👈 NEW: Callback when route is selected to broadcast
};

export default function ViewRoutesPopup({ visible, routes, selectedRoute, onClose, onDelete, onEdit, onSelectRoute }: Props) {
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
                            {routes.map((route, i) => {
                                const isSelected = selectedRoute === route.routeName;
                                
                                return (
                                    <View key={i} style={styles.routeContainer}>
                                        {/* Radio Button + Route Info */}
                                        <Pressable
                                            style={styles.routeRow}
                                            onPress={() => onSelectRoute && onSelectRoute(route.routeName)}
                                        >
                                            {/* Radio Button */}
                                            <View style={styles.radioContainer}>
                                                <View style={[
                                                    styles.radioButton,
                                                    isSelected && styles.radioButtonSelected
                                                ]}>
                                                    {isSelected && <View style={styles.radioButtonInner} />}
                                                </View>
                                            </View>

                                            {/* Route Info */}
                                            <View style={styles.routeInfo}>
                                                <View style={styles.routeNameRow}>
                                                    <Text style={styles.routeText}>
                                                        {i + 1}. {route.routeName}
                                                    </Text>
                                                    {/* Broadcasting Indicator */}
                                                    {isSelected && (
                                                        <View style={styles.broadcastingBadge}>
                                                            <Ionicons name="radio" size={12} color="#10b981" />
                                                            <Text style={styles.broadcastingText}>Broadcasting</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                
                                                {/* Comments */}
                                                {route.customComments && (
                                                    <Text style={styles.commentsText}>
                                                        "{route.customComments}"
                                                    </Text>
                                                )}
                                            </View>

                                            {/* Edit Icon */}
                                            {onEdit && (
                                                <Pressable
                                                    onPress={() => onEdit(route)}
                                                    style={styles.editButton}
                                                >
                                                    <Ionicons name="pencil" size={18} color="#3b82f6" />
                                                </Pressable>
                                            )}

                                            {/* Delete Button */}
                                            {onDelete && (
                                                <Pressable
                                                    onPress={() => onDelete(route.routeName)}
                                                    style={styles.deleteButton}
                                                >
                                                    <Ionicons name="trash-outline" size={18} color="#b91c1c" />
                                                </Pressable>
                                            )}
                                        </Pressable>
                                    </View>
                                );
                            })}
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
    routeContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    routeRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 10,
    },
    radioContainer: {
        paddingRight: 4,
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#d1d5db",
        justifyContent: "center",
        alignItems: "center",
    },
    radioButtonSelected: {
        borderColor: "#10b981",
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#10b981",
    },
    routeInfo: {
        flex: 1,
    },
    routeNameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    routeText: {
        fontSize: 16,
        color: "#111",
        fontWeight: "500",
    },
    broadcastingBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#d1fae5",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        gap: 4,
    },
    broadcastingText: {
        fontSize: 11,
        color: "#10b981",
        fontWeight: "600",
    },
    commentsText: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        marginTop: 4,
    },
    editButton: {
        padding: 6,
    },
    deleteButton: {
        padding: 6,
    },
    deleteText: {
        color: "#b91c1c",
        fontWeight: "600",
    },
});