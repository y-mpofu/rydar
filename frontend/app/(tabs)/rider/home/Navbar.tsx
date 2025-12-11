import { View, TouchableOpacity, TextInput, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

type NavbarProps = {
  onUserPress?: () => void;
  onSearch?: (text: string) => void;
  value?: string;
};

export default function Navbar({ onUserPress, onSearch, value }: NavbarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {/* User Profile Button */}
        <TouchableOpacity style={styles.profileButton} onPress={onUserPress}>
          <LinearGradient
            colors={[Colors.primary.main, Colors.primary.dark]}
            style={styles.profileGradient}
          >
            <Ionicons name="person" size={20} color={Colors.text.inverse} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
          <Ionicons
            name="search"
            size={20}
            color={isFocused ? Colors.primary.main : Colors.text.tertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Where are you going?"
            placeholderTextColor={Colors.text.tertiary}
            value={value}
            onChangeText={onSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {value && value.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearch?.("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color={Colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 99,
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  navbar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.md,
    backgroundColor: Colors.surface.glass,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    gap: Spacing.md,
    ...Shadows.lg,
  },
  profileButton: {
    ...Shadows.glow,
    borderRadius: BorderRadius.full,
  },
  profileGradient: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
  },
  searchContainerFocused: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.surface.card,
    ...Shadows.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: Spacing.xs,
  },
});
