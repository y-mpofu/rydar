import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type NavbarProps = {
    onUserPress?: () => void;
    onSearch?: (text: string) => void;
    value?: string;
};

export default function Navbar({ onUserPress, onSearch, value }: NavbarProps) {
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
            {/* 🔵 Rounded Pill Navbar */}
            <View
                style={{
                    width: "90%",
                    paddingVertical: 10,
                    paddingHorizontal: 16,

                    borderRadius: 50,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,

                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 6,
                }}
            >
                {/* 👤 User Icon (Left) */}
                <TouchableOpacity onPress={onUserPress}>
                    <Ionicons name="person-circle-outline" size={32} color="black" />
                </TouchableOpacity>

                {/* 🔍 Search Bar (Expands to fill space) */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={{ marginRight: 6 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor="#888"
                        value={value}
                        onChangeText={onSearch}
                    />

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        borderColor: "#e5e7eb", // subtle light-gray border

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
        marginLeft: 6,
        paddingVertical: 2,
    },
});


