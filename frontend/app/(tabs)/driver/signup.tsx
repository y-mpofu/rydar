import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signupDriver } from "./services/auth";
import { useRouter } from "expo-router";

export default function DriverSignup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const [error, setError] = useState(""); // <-- error message above inputs

    const handleSignup = async () => {
        setError(""); // clear old errors

        if (!email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Your signup backend expects first_name + lastname
            const res = await signupDriver(
                "Driver",
                "User",
                email,
                password
            );

            // success → optional redirect
            console.log("Signup success:", res);
            router.push("/driver/home");

        } catch (err: any) {
            setError(err.message || "Signup failed");
        }
    };

    return (
        <View style={styles.container}>

            {/* Error Message */}
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%" },

    errorText: {
        color: "red",
        marginBottom: 10,
        fontSize: 14,
        fontWeight: "500",
    },

    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },

    button: {
        backgroundColor: "#3B82F6",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
