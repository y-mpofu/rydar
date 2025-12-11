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
import {
  ActionSheetIOS,
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { NearbyDriver } from "../services/drivers";

type Props = {
  visible: boolean;
  driver: NearbyDriver | null;
  onClose: () => void;
};

type MapApp = {
  name: string;
  icon: string;
  getUrl: (lat: number, lng: number) => string;
  checkUrl?: string;
};

const MAP_APPS: MapApp[] = [
  {
    name: "Google Maps",
    icon: "logo-google",
    getUrl: (lat, lng) => 
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
  },
  ...(Platform.OS === "ios" ? [{
    name: "Apple Maps",
    icon: "map",
    getUrl: (lat: number, lng: number) => `maps://app?daddr=${lat},${lng}`,
    checkUrl: "maps://",
  }] : []),
  {
    name: "Waze",
    icon: "navigate",
    getUrl: (lat, lng) => `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    checkUrl: "waze://",
  },
];

export default function DriverDetailPopup({ visible, driver, onClose }: Props) {
  if (!driver) return null;

  const openMapApp = async (mapApp: MapApp) => {
    const { latitude, longitude } = driver;
    const url = mapApp.getUrl(latitude, longitude);

    try {
      // Check if the app is installed (for native apps)
      if (mapApp.checkUrl) {
        const canOpen = await Linking.canOpenURL(mapApp.checkUrl);
        if (!canOpen) {
          Alert.alert(
            `${mapApp.name} Not Installed`,
            `Please install ${mapApp.name} or choose another maps app.`,
            [{ text: "OK" }]
          );
          return;
        }
      }
      
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "Unable to Open Maps",
        "There was a problem opening the maps app.",
        [{ text: "OK" }]
      );
    }
  };

  const handleGetDirections = () => {
    if (Platform.OS === "ios") {
      // Use iOS Action Sheet for a native feel
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Choose Maps App",
          message: "Select your preferred navigation app",
          options: ["Cancel", ...MAP_APPS.map(app => app.name)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            openMapApp(MAP_APPS[buttonIndex - 1]);
          }
        }
      );
    } else {
      // Use Alert for Android
      Alert.alert(
        "Choose Maps App",
        "Select your preferred navigation app",
        [
          { text: "Cancel", style: "cancel" },
          ...MAP_APPS.map(app => ({
            text: app.name,
            onPress: () => openMapApp(app),
          })),
        ]
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={[Colors.primary.main, Colors.primary.dark]}
              style={styles.driverAvatar}
            >
              <Ionicons name="car" size={28} color={Colors.text.inverse} />
            </LinearGradient>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>Driver Nearby</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <View style={styles.content}>
            {/* Route Name */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="navigate-circle"
                  size={24}
                  color={Colors.primary.main}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Heading to</Text>
                <Text style={styles.infoValue}>{driver.currRouteName}</Text>
              </View>
            </View>

            {/* Custom Comments */}
            {driver.customComments && 
             driver.customComments.trim() !== "" && 
             driver.customComments.toLowerCase() !== "no comment" && (
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="chatbubble"
                    size={22}
                    color={Colors.primary.light}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Driver's Note</Text>
                  <Text style={styles.commentsValue}>
                    "{driver.customComments}"
                  </Text>
                </View>
              </View>
            )}

            {/* Get Directions Button */}
            <TouchableOpacity
              onPress={handleGetDirections}
              activeOpacity={0.85}
              style={styles.directionsButtonWrapper}
            >
              <View style={styles.directionsButton}>
                <View style={styles.directionsIconContainer}>
                  <Ionicons name="navigate" size={20} color={Colors.primary.main} />
                </View>
                <View style={styles.directionsTextContainer}>
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                  <Text style={styles.directionsSubtext}>
                    Open in maps app
                  </Text>
                </View>
                <View style={styles.directionsArrow}>
                  <Ionicons name="arrow-forward" size={18} color={Colors.primary.main} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Close</Text>
            </TouchableOpacity>
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
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    ...Shadows.glow,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontWeight: FontWeights.bold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.success,
  },
  statusText: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.success,
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
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.background.light,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
  commentsValue: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontStyle: "italic",
    lineHeight: 22,
  },
  
  // Directions Button
  directionsButtonWrapper: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.light,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.xl,
  },
  directionsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  directionsTextContainer: {
    flex: 1,
  },
  directionsButtonText: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  directionsSubtext: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  directionsArrow: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary.main}10`,
    justifyContent: "center",
    alignItems: "center",
  },
  
  doneButton: {
    backgroundColor: Colors.background.lightSecondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  doneButtonText: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
});
