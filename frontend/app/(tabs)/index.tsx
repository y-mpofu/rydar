// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const riderCardAnim = useRef(new Animated.Value(50)).current;
  const driverCardAnim = useRef(new Animated.Value(50)).current;
  const riderOpacity = useRef(new Animated.Value(0)).current;
  const driverOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.sequence([
      // Hero text fade in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Cards slide in with stagger
      Animated.stagger(150, [
        Animated.parallel([
          Animated.timing(riderCardAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(riderOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(driverCardAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(driverOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const handlePressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const riderScale = useRef(new Animated.Value(1)).current;
  const driverScale = useRef(new Animated.Value(1)).current;

  return (
    <View style={styles.container}>
      {/* Animated Background Gradient */}
      <LinearGradient
        colors={["#0F172A", "#1E293B", "#0F172A"]}
        locations={[0, 0.5, 1]}
        style={styles.backgroundGradient}
      />

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      {/* Content Container */}
      <View style={styles.content}>
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>WELCOME TO</Text>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>Rydar</Text>
            <View style={styles.brandAccent} />
          </View>
          <Text style={styles.tagline}>Your journey starts here</Text>
        </Animated.View>

        {/* Role Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* Rider Card */}
          <Animated.View
            style={{
              opacity: riderOpacity,
              transform: [
                { translateY: riderCardAnim },
                { scale: riderScale },
              ],
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/rider")}
              onPressIn={() => handlePressIn(riderScale)}
              onPressOut={() => handlePressOut(riderScale)}
              activeOpacity={1}
            >
              <LinearGradient
                colors={[Colors.primary.main, Colors.primary.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.roleCard}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="person" size={32} color={Colors.text.inverse} />
                </View>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>I'm a Rider</Text>
                  <Text style={styles.roleSubtitle}>Find drivers nearby</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.text.inverse}
                  style={styles.chevron}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Driver Card */}
          <Animated.View
            style={{
              opacity: driverOpacity,
              transform: [
                { translateY: driverCardAnim },
                { scale: driverScale },
              ],
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/driver")}
              onPressIn={() => handlePressIn(driverScale)}
              onPressOut={() => handlePressOut(driverScale)}
              activeOpacity={1}
            >
              <View style={styles.roleCardOutline}>
                <View style={styles.iconContainerOutline}>
                  <Ionicons name="car-sport" size={32} color={Colors.primary.main} />
                </View>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitleOutline}>I'm a Driver</Text>
                  <Text style={styles.roleSubtitleOutline}>
                    Share your route
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.primary.main}
                  style={styles.chevron}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Bottom Accent */}
      <LinearGradient
        colors={["transparent", "rgba(0, 102, 255, 0.1)"]}
        style={styles.bottomAccent}
      />
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
  decorativeCircle1: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.primary.main,
    opacity: 0.05,
    top: -width * 0.3,
    right: -width * 0.2,
  },
  decorativeCircle2: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: Colors.accent.cyan,
    opacity: 0.03,
    bottom: height * 0.1,
    left: -width * 0.3,
  },
  decorativeCircle3: {
    position: "absolute",
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: Colors.primary.light,
    opacity: 0.04,
    top: height * 0.4,
    right: -width * 0.15,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  heroContainer: {
    alignItems: "center",
    marginBottom: Spacing["5xl"],
  },
  welcomeText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.tertiary,
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  brandContainer: {
    alignItems: "center",
  },
  brandText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 64,
    color: Colors.text.inverse,
    letterSpacing: -2,
  },
  brandAccent: {
    width: 80,
    height: 4,
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  tagline: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    marginTop: Spacing.lg,
  },
  cardsContainer: {
    gap: Spacing.lg,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    ...Shadows.glow,
  },
  roleCardOutline: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.primary.main,
    backgroundColor: "rgba(0, 102, 255, 0.08)",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerOutline: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(0, 102, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  roleTextContainer: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  roleTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.inverse,
  },
  roleTitleOutline: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.inverse,
  },
  roleSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  roleSubtitleOutline: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  chevron: {
    opacity: 0.7,
  },
  bottomAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
});
