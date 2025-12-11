import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Haptic feedback utilities for better UX
 */

// Light tap - for subtle interactions like toggles
export const lightTap = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else {
    Haptics.selectionAsync();
  }
};

// Medium tap - for button presses
export const mediumTap = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } else {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

// Heavy tap - for important actions
export const heavyTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

// Selection - for selecting items in a list
export const selection = () => {
  Haptics.selectionAsync();
};

// Success notification
export const success = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

// Error notification
export const error = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

// Warning notification
export const warning = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};


