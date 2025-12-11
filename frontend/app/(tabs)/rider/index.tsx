import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RiderLogin from "./login";
import RiderSignup from "./signup";

const { width } = Dimensions.get("window");

export default function RiderIndex() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const scrollViewRef = useRef<ScrollView>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(tabIndicatorPosition, {
      toValue: activeTab === "login" ? 0 : 1,
      friction: 8,
      tension: 60,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const indicatorLeft = tabIndicatorPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [4, width * 0.4 - 4],
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#0F172A", "#1E293B"]}
        style={styles.backgroundGradient}
      />

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle} />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          bounces={true}
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.inverse} />
          </TouchableOpacity>

          {/* Header Section */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.iconBadge}>
              <Ionicons name="person" size={32} color={Colors.primary.main} />
            </View>
            <Text style={styles.title}>Rider Portal</Text>
            <Text style={styles.subtitle}>
              Find drivers heading your way
            </Text>
          </Animated.View>

          {/* Auth Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <Animated.View
                style={[
                  styles.tabIndicator,
                  { left: indicatorLeft },
                ]}
              />
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab("login")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "login" && styles.activeTabText,
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab("signup")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "signup" && styles.activeTabText,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={styles.formContainer}>
              {activeTab === "login" ? <RiderLogin /> : <RiderSignup />}
            </View>
          </Animated.View>
          
          {/* Extra padding for keyboard */}
          <View style={{ height: 50 }} />
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.primary.main,
    opacity: 0.05,
    top: -width * 0.2,
    right: -width * 0.3,
  },
  scrollContent: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing["5xl"],
    paddingBottom: Spacing["3xl"],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    backgroundColor: "rgba(0, 102, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 255, 0.3)",
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize["3xl"],
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.surface.glass,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["2xl"],
    ...Shadows.xl,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background.lightSecondary,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing["2xl"],
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    top: 4,
    width: width * 0.4 - 8,
    height: "100%",
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.md,
    ...Shadows.glow,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    zIndex: 1,
  },
  tabText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.inverse,
    fontFamily: Typography.fontFamily.semiBold,
  },
  formContainer: {
    width: "100%",
  },
});
