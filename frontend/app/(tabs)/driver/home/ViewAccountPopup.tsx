import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Pressable, Switch, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getProfile, type UserProfile } from "../services/routes";

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function ViewAccountPopup({ visible, onClose }: Props) {
    const [available, setAvailable] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    // Load profile when popup becomes visible
    useEffect(() => {
        if (!visible) return;

        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getProfile();
                setProfile(data);
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            {/* Background overlay */}
            <Pressable
                onPress={onClose}
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Card - prevent closing when tapping inside */}
                <Pressable
                    onPress={() => { }}
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

                    {/* LOADING STATE */}
                    {loading && (
                        <View style={{ paddingVertical: 20, alignItems: "center" }}>
                            <ActivityIndicator size="large" color="#000" />
                        </View>
                    )}

                    {/* USER INFO */}
                    {!loading && profile && (
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
                                    {profile.firstname} {profile.lastname}
                                </Text>
                                <Text style={{ fontSize: 14, color: "#666" }}>
                                    {profile.email}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Availability Toggle */}
                    {!loading && (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingVertical: 12,
                                paddingHorizontal: 4,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>
                                Available
                            </Text>

                            <Switch
                                value={available}
                                onValueChange={setAvailable}
                                trackColor={{ false: "#d1d5db", true: "#34d399" }}
                                thumbColor="white"
                            />
                        </View>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}
