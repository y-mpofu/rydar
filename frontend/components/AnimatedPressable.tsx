import { useRef } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import * as haptics from "@/utils/haptics";

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  hapticType?: "light" | "medium" | "heavy" | "selection" | "none";
  scaleValue?: number;
}

export default function AnimatedPressable({
  children,
  onPress,
  onLongPress,
  style,
  disabled = false,
  hapticType = "light",
  scaleValue = 0.97,
}: AnimatedPressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerHaptic = () => {
    switch (hapticType) {
      case "light":
        haptics.lightTap();
        break;
      case "medium":
        haptics.mediumTap();
        break;
      case "heavy":
        haptics.heavyTap();
        break;
      case "selection":
        haptics.selection();
        break;
      default:
        break;
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    triggerHaptic();
    onPress?.();
  };

  const handleLongPress = () => {
    if (disabled) return;
    haptics.heavyTap();
    onLongPress?.();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress ? handleLongPress : undefined}
      disabled={disabled}
    >
      <Animated.View
        style={[
          style,
          { transform: [{ scale: scaleAnim }] },
          disabled && styles.disabled,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.6,
  },
});

