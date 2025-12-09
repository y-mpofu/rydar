import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type NavbarProps = {
    onAddRoute: () => void;
    onViewRoutes?: () => void;
    onLogout?: () => void;
    onUserPress?: () => void;
};

export default function Navbar({ onAddRoute, onViewRoutes, onLogout, onUserPress }: NavbarProps) {
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
            <View
                style={{
                    width: "90%",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 50,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",

                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 6,
                }}
            >
                <TouchableOpacity onPress={onUserPress}>
                    <Ionicons name="person-circle-outline" size={32} color="black" />
                </TouchableOpacity>

                {/* Right side icons */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
                    <TouchableOpacity onPress={onViewRoutes}>
                        <Ionicons name="map-outline" size={28} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onAddRoute}>
                        <Ionicons name="add-circle-outline" size={30} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onLogout}>
                        <Ionicons name="log-out-outline" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
