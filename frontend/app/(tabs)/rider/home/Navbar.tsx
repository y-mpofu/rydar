import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type NavbarProps = {
    onUserPress?: () => void;
    onLogout?: () => void;
};

export default function Navbar({ onUserPress, onLogout }: NavbarProps) {
    return (
        <View
            style={{
                position: "absolute",
                top: 40,
                width: "100%",
                zIndex: 99,
                alignItems: "center",
                backgroundColor: "transparent",
            }}
        >
            {/* 🔵 Pill Navbar */}
            <View
                style={{
                    width: "90%",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    borderRadius: 50,
                    flexDirection: "row",
                    justifyContent: "space-between", // ⭐ user left, logout right
                    alignItems: "center",

                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 6,
                }}
            >
                {/* 👤 User Icon (far left) */}
                <TouchableOpacity onPress={onUserPress}>
                    <Ionicons name="person-circle-outline" size={30} color="black" />
                </TouchableOpacity>

                {/* 🚪 Logout Icon (far right) */}
                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={28} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
