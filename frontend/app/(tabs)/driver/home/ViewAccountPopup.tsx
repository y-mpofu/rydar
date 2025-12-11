import {
  BorderRadius,
  Colors,
  FontWeights,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logout } from "../services/auth";
import { getProfile, type UserProfile } from "../services/routes";

type Props = {
  visible: boolean;
  onClose: () => void;
};

// Avatar component with initials
const Avatar = ({
  firstname,
  lastname,
  size = 64,
}: {
  firstname?: string;
  lastname?: string;
  size?: number;
}) => {
  const initials =
    firstname && lastname
      ? `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase()
      : firstname
      ? firstname.charAt(0).toUpperCase()
      : null;

  return (
    <LinearGradient
      colors={[Colors.primary.main, Colors.primary.dark]}
      style={[
        styles.avatarGradient,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {initials ? (
        <Text style={[styles.avatarText, { fontSize: size * 0.35 }]}>
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={size * 0.45} color={Colors.text.inverse} />
      )}
    </LinearGradient>
  );
};

export default function ViewAccountPopup({ visible, onClose }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="person" size={24} color={Colors.primary.main} />
            </View>
            <Text style={styles.title}>Account</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <View style={styles.content}>
            {/* Loading State */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
              </View>
            )}

            {/* Profile Info */}
            {!loading && profile && (
              <View style={styles.profileSection}>
                <Avatar
                  firstname={profile.firstname}
                  lastname={profile.lastname}
                  size={72}
                />

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {profile.firstname} {profile.lastname}
                  </Text>
                  <View style={styles.emailRow}>
                    <Ionicons
                      name="mail-outline"
                      size={14}
                      color={Colors.text.tertiary}
                    />
                    <Text style={styles.profileEmail}>{profile.email}</Text>
                  </View>
                  <View style={styles.badgeRow}>
                    <View style={styles.driverBadge}>
                      <Ionicons
                        name="car"
                        size={12}
                        color={Colors.text.inverse}
                      />
                      <Text style={styles.driverBadgeText}>Driver</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Logout Button */}
            {!loading && (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <View style={styles.logoutIconContainer}>
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={Colors.accent.error}
                  />
                </View>
                <Text style={styles.logoutText}>Sign Out</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.text.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.surface.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: Colors.surface.card,
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
    ...Shadows.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: `${Colors.primary.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  title: {
    flex: 1,
    fontWeight: FontWeights.bold,
    fontSize: Typography.fontSize["2xl"],
    color: Colors.text.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.lightSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.xl,
  },
  content: {
    padding: Spacing.xl,
  },
  loadingContainer: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarGradient: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
    ...Shadows.glow,
  },
  avatarText: {
    fontWeight: FontWeights.bold,
    color: Colors.text.inverse,
    letterSpacing: 1,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 4,
  },
  profileEmail: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: Spacing.sm,
  },
  driverBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  driverBadgeText: {
    fontWeight: FontWeights.semiBold,
    fontSize: 10,
    color: Colors.text.inverse,
    textTransform: "uppercase",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.accent.error}10`,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: `${Colors.accent.error}20`,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.accent.error}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  logoutText: {
    flex: 1,
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.accent.error,
  },
});
