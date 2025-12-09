import React, { useState } from "react";
import { useRouter } from "expo-router";
import { loginRider } from "./services/auth";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RiderLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        setError(""); // clear previous errors

        try {
            const res = await loginRider(email, password);

            if (res?.token) {
                router.push("/rider/home");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <View style={styles.container}>

            {/* Error message ABOVE email input */}
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}

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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
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

    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
