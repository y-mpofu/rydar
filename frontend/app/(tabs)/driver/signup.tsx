import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import * as haptics from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signupDriver } from "./services/auth";

export default function DriverSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const router = useRouter();

  // Animation for error shake
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleSignup = async () => {
    setError("");
    haptics.mediumTap();

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      shake();
      haptics.warning();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      shake();
      haptics.warning();
      return;
    }

    setIsLoading(true);

    try {
      const res = await signupDriver("Driver", "User", email, password);
      console.log("Signup success:", res);
      haptics.success();
      router.push("/driver/home");
    } catch (err: any) {
      setError(err.message || "Signup failed");
      shake();
      haptics.error();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error !== "" && (
        <Animated.View
          style={[
            styles.errorContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <Ionicons name="alert-circle" size={18} color={Colors.accent.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={Colors.text.tertiary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.text.tertiary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={() => {
              passwordInputRef.current?.focus();
            }}
            blurOnSubmit={false}
          />
        </View>
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={Colors.text.tertiary}
            style={styles.inputIcon}
          />
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor={Colors.text.tertiary}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={() => {
              confirmPasswordInputRef.current?.focus();
            }}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={Colors.text.tertiary}
            style={styles.inputIcon}
          />
          <TextInput
            ref={confirmPasswordInputRef}
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor={Colors.text.tertiary}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onSubmitEditing={handleSignup}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Signup Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          onPress={handleSignup}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[Colors.primary.main, Colors.primary.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, isLoading && styles.buttonDisabled]}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>Creating account...</Text>
            ) : (
              <>
                <Text style={styles.buttonText}>Sign Up</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={Colors.text.inverse}
                  style={styles.buttonIcon}
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 61, 87, 0.1)",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 61, 87, 0.3)",
  },
  errorText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.error,
    marginLeft: Spacing.sm,
  },
  inputWrapper: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
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
    height: 52,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    height: "100%",
  },
  eyeButton: {
    padding: Spacing.sm,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    ...Shadows.glow,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
  },
  buttonIcon: {
    marginLeft: Spacing.sm,
  },
});
