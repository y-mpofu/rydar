import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RiderLogin from "./login";
import RiderSignup from "./signup";

export default function RiderIndex() {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rider Portal</Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "login" && styles.activeTab]}
                    onPress={() => setActiveTab("login")}
                >
                    <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === "signup" && styles.activeTab]}
                    onPress={() => setActiveTab("signup")}
                >
                    <Text style={[styles.tabText, activeTab === "signup" && styles.activeTabText]}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.formContainer}>
                {activeTab === "login" ? <RiderLogin /> : <RiderSignup />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F9FF",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1E3A8A",
        marginBottom: 40,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#E0E7FF",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 30,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 35,
    },
    tabText: {
        fontSize: 16,
        color: "#1E3A8A",
        fontWeight: "500",
    },
    activeTab: {
        backgroundColor: "#3B82F6",
    },
    activeTabText: {
        color: "#fff",
    },
    formContainer: {
        width: "80%",
    },
});
