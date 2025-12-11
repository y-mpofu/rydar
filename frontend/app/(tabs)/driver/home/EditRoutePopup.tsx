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
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type { DriverRoute } from "../services/routes";

type Props = {
  visible: boolean;
  route: DriverRoute | null;
  onClose: () => void;
  onSave: (oldName: string, newName: string, comments: string) => void;
  onDelete?: (routeName: string) => void;
};

export default function EditRoutePopup({
  visible,
  route,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [routeName, setRouteName] = useState("");
  const [customComments, setCustomComments] = useState("");

  useEffect(() => {
    if (route) {
      setRouteName(route.routeName);
      setCustomComments(route.customComments || "");
    }
  }, [route]);

  const reset = () => {
    setRouteName("");
    setCustomComments("");
    Keyboard.dismiss();
    onClose();
  };

  const handleSave = () => {
    if (!route) return;
    onSave(route.routeName, routeName, customComments);
    reset();
  };

  const handleDelete = () => {
    if (!route || !onDelete) return;
    
    Alert.alert(
      "Delete Route",
      `Are you sure you want to delete "${route.routeName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(route.routeName);
            reset();
          },
        },
      ]
    );
  };

  if (!route) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={reset}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerIcon}>
                    <Ionicons name="pencil" size={24} color={Colors.primary.main} />
                  </View>
                  <Text style={styles.title}>Edit Route</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={reset}>
                    <Ionicons name="close" size={24} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Content */}
                <ScrollView 
                  style={styles.content}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {/* Route Name */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Route Name</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="flag-outline"
                        size={20}
                        color={Colors.text.tertiary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Route name"
                        placeholderTextColor={Colors.text.tertiary}
                        value={routeName}
                        onChangeText={setRouteName}
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  {/* Comments */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Comments (Optional)</Text>
                    <View style={styles.commentsContainer}>
                      <TextInput
                        style={styles.commentsInput}
                        placeholder="Add notes for riders..."
                        placeholderTextColor={Colors.text.tertiary}
                        value={customComments}
                        onChangeText={setCustomComments}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.buttonRow}>
                    {/* Delete Button */}
                    {onDelete && (
                      <TouchableOpacity 
                        style={styles.deleteButton} 
                        onPress={handleDelete}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="trash-outline" size={20} color={Colors.accent.error} />
                      </TouchableOpacity>
                    )}

                    {/* Save Button */}
                    <TouchableOpacity 
                      onPress={handleSave} 
                      activeOpacity={0.8}
                      style={styles.saveButtonWrapper}
                    >
                      <LinearGradient
                        colors={[Colors.primary.main, Colors.primary.dark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButton}
                      >
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={Colors.text.inverse}
                        />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <View style={{ height: 20 }} />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.surface.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxHeight: "85%",
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
  inputWrapper: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.light,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
  },
  commentsContainer: {
    backgroundColor: Colors.background.light,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  commentsInput: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    minHeight: 80,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  deleteButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.accent.error}10`,
    borderWidth: 1,
    borderColor: `${Colors.accent.error}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonWrapper: {
    flex: 1,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    ...Shadows.glow,
  },
  saveButtonText: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
  },
});
