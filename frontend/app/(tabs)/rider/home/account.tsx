// app/home/account.tsx
import { View, Text } from "react-native";

export default function AccountScreen() {
    return (
        <View style={{ flex: 1, padding: 16, gap: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: "700" }}>Account</Text>
            <Text>Profile/settings for the logged-in user.</Text>
        </View>
    );
}
