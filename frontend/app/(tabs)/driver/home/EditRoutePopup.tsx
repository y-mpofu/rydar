import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { DriverRoute } from "../services/routes";

type Props = {
    visible: boolean;
    route: DriverRoute | null;
    onClose: () => void;
    onSave: (oldName: string, newName: string, comments: string) => void;
};

export default function EditRoutePopup({ visible, route, onClose, onSave }: Props) {
    const [routeName, setRouteName] = useState("");
    const [customComments, setCustomComments] = useState("");

    // When the popup opens with a route, populate the fields
    useEffect(() => {
        if (route) {
            setRouteName(route.routeName);
            setCustomComments(route.customComments || "");
        }
    }, [route]);

    const reset = () => {
        setRouteName("");
        setCustomComments("");
        onClose();
    };

    const handleSave = () => {
        if (!route) return;
        
        // Call onSave with old name, new name, and comments
        onSave(route.routeName, routeName, customComments);
        reset();
    };

    if (!route) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={reset}>
                <Pressable style={styles.card} onPress={() => { }}>
                    {/* X Button */}
                    <Pressable style={styles.closeIcon} onPress={reset}>
                        <Ionicons name="close" size={28} color="black" />
                    </Pressable>

                    <Text style={styles.title}>Edit Route</Text>

                    {/* Route Name */}
                    <Text style={styles.label}>Route Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Route name"
                        value={routeName}
                        onChangeText={setRouteName}
                    />

                    {/* Comments */}
                    <Text style={[styles.label, { marginTop: 15 }]}>Comments (Optional)</Text>
                    <TextInput
                        style={styles.commentsInput}
                        placeholder="Add comments"
                        placeholderTextColor="#000"
                        value={customComments}
                        onChangeText={setCustomComments}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />

                    {/* Save Button */}
                    <Pressable style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </Pressable>
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
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 16,
    },
    commentsInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 16,
        minHeight: 80,
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: "#3B82F6",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});