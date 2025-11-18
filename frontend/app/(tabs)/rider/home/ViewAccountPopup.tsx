import React from "react";
import { View, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    visible: boolean;
    onClose: () => void;
    onLogout?: () => void;
};

export default function ViewAccountPopup({ visible, onClose, onLogout }: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            {/* Background overlay — clicking here closes */}
            <Pressable
                onPress={onClose}
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Inner content — clicking inside should NOT close */}
                <Pressable
                    onPress={() => { }} // ← stops propagation
                    style={{
                        width: "85%",
                        padding: 24,
                        backgroundColor: "white",
                        borderRadius: 20,
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 10,
                    }}
                >
                    {/* Header */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: "600" }}>
                            Account
                        </Text>

                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={26} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* User Info */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 24,
                        }}
                    >
                        <Ionicons
                            name="person-circle-outline"
                            size={64}
                            color="black"
                        />

                        <View style={{ marginLeft: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: "500" }}>
                                Username
                            </Text>
                            <Text style={{ fontSize: 14, color: "#666" }}>
                                user@example.com
                            </Text>
                        </View>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        onPress={onLogout}
                        style={{
                            backgroundColor: "#ef4444",
                            paddingVertical: 12,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
