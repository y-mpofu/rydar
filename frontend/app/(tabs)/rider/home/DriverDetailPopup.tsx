import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { NearbyDriver } from "../services/drivers";

type Props = {
  visible: boolean;
  driver: NearbyDriver | null;
  onClose: () => void;
};

export default function DriverDetailPopup({ visible, driver, onClose }: Props) {
  if (!driver) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          {/* X Button */}
          <Pressable style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={28} color="black" />
          </Pressable>

          <Text style={styles.title}>Driver Details</Text>

          {/* Route Name */}
          <View style={styles.section}>
            <View style={styles.iconRow}>
              <Ionicons
                name="navigate-circle-outline"
                size={20}
                color="#3B82F6"
              />
              <Text style={styles.label}>Route</Text>
            </View>
            <Text style={styles.value}>{driver.currRouteName}</Text>
          </View>

          {/* Custom Comments */}
          {driver.customComments && driver.customComments !== "No Comment" && (
            <View style={styles.section}>
              <View style={styles.iconRow}>
                <Ionicons name="chatbubble-outline" size={20} color="#3B82F6" />
                <Text style={styles.label}>Comments</Text>
              </View>
              <Text style={styles.commentsValue}>
                "{driver.customComments}"
              </Text>
            </View>
          )}

          {/* Location Coordinates (Optional - can remove if not needed) */}
          <View style={styles.section}>
            <View style={styles.iconRow}>
              <Ionicons name="location-outline" size={20} color="#3B82F6" />
              <Text style={styles.label}>Current Location</Text>
            </View>
            <Text style={styles.coordValue}>
              {driver.latitude.toFixed(4)}, {driver.longitude.toFixed(4)}
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 20,
    paddingTop: 36,
    borderRadius: 16,
    backgroundColor: "white",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 18,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 8,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
  },
  commentsValue: {
    fontSize: 16,
    color: "#374151",
    fontStyle: "italic",
    lineHeight: 22,
  },
  coordValue: {
    fontSize: 14,
    color: "#6b7280",
    fontFamily: "monospace",
  },
});
