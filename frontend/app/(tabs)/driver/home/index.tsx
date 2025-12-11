import {
  BorderRadius,
  Colors,
  FontWeights,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import AnimatedPressable from "@/components/AnimatedPressable";
import Toast from "@/components/Toast";
import * as haptics from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";
import { logout } from "../services/auth";
import { updateLocation } from "../services/me";
import {
  addNewRoute,
  deleteRoute,
  getAllRoutes,
  getProfile,
  getSelectedRoute,
  setSelectedRoute,
  updateRoute,
  type DriverRoute,
  type UserProfile,
} from "../services/routes";
import AddRoutePopup from "./AddRoutePopup";
import EditRoutePopup from "./EditRoutePopup";
import ViewAccountPopup from "./ViewAccountPopup";

const { width, height } = Dimensions.get("window");

export type NewRoutePayload = {
  routeName: string;
  destinationLat: number;
  destinationLong: number;
  customComments?: string;
};

// Avatar component with initials
const Avatar = ({
  firstname,
  lastname,
  size = 52,
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
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={size * 0.45} color={Colors.text.inverse} />
      )}
    </LinearGradient>
  );
};

export default function HomeScreen() {
  const mapRef = useRef<MapView | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [showAddRoute, setShowAddRoute] = useState(false);
  const [routes, setRoutes] = useState<DriverRoute[]>([]);
  const [showAccount, setShowAccount] = useState(false);
  const [showEditRoute, setShowEditRoute] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<DriverRoute | null>(null);
  const [selectedRoute, setSelectedRouteState] = useState<string | null>(null);
  const [showMapView, setShowMapView] = useState(false); // Separate view state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [greeting, setGreeting] = useState("Good morning");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" as "success" | "error" | "warning" | "info" });

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Pulse animation for broadcast indicator
  useEffect(() => {
    if (selectedRoute) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [selectedRoute]);

  // Animate between views
  useEffect(() => {
    if (showMapView) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMapView]);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.log("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, []);

  // Load routes function (reusable for pull-to-refresh)
  const loadRoutes = useCallback(async (showLoadingToast = false) => {
    try {
      const fullRoutes = await getAllRoutes();
      setRoutes(fullRoutes);

      const saved = await getSelectedRoute();
      if (saved) {
        setSelectedRouteState(saved);
        // If we were broadcasting, show the map
        setShowMapView(true);
      }
    } catch (err) {
      console.error("Failed to load routes:", err);
      if (showLoadingToast) {
        setToast({
          visible: true,
          message: "Couldn't load routes. Please try again.",
          type: "error",
        });
        haptics.error();
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptics.lightTap();
    await loadRoutes(true);
    setRefreshing(false);
  }, [loadRoutes]);

  // Location tracking
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (loc) => {
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          });
        }
      );
      return () => subscription.remove();
    })();
  }, []);

  // Broadcast location when route selected
  useEffect(() => {
    if (!region || !selectedRoute) return;

    let isMounted = true;

    const pollLocation = async () => {
      try {
        const activeRoute = routes.find((r) => r.routeName === selectedRoute);
        if (!activeRoute) return;

        const payload = {
          latitude: region.latitude,
          longitude: region.longitude,
          currRouteName: activeRoute.routeName,
          customComments: activeRoute.customComments || "No Comment",
        };

        await updateLocation(payload);
        if (isMounted) {
          console.log("📡 Broadcasting:", payload.currRouteName);
        }
      } catch (err) {
        console.error("Failed to update location:", err);
      }
    };

    pollLocation();
    const interval = setInterval(pollLocation, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [region, selectedRoute, routes]);

  const handleSaveRoute = async (route: NewRoutePayload) => {
    try {
      await addNewRoute(
        route.routeName,
        route.destinationLat,
        route.destinationLong,
        route.customComments ?? "No Comment"
      );

      setRoutes((prev) => [
        ...prev,
        {
          routeName: route.routeName,
          destinationLat: route.destinationLat,
          destinationLong: route.destinationLong,
          customComments: route.customComments,
        },
      ]);

      setShowAddRoute(false);
      haptics.success();
      setToast({
        visible: true,
        message: "Route added successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to save route:", err);
      haptics.error();
      setToast({
        visible: true,
        message: "Couldn't save route. Please try again.",
        type: "error",
      });
    }
  };

  const handleDelete = async (routeName: string) => {
    try {
      await deleteRoute(routeName);
      setRoutes((prev) => prev.filter((r) => r.routeName !== routeName));
      if (selectedRoute === routeName) {
        await setSelectedRoute(null);
        setSelectedRouteState(null);
        setShowMapView(false);
      }
      haptics.success();
      setToast({
        visible: true,
        message: "Route deleted",
        type: "info",
      });
    } catch (err) {
      console.error("Failed to delete route:", err);
      haptics.error();
      setToast({
        visible: true,
        message: "Couldn't delete route. Please try again.",
        type: "error",
      });
    }
  };

  const handleEditRoute = (route: DriverRoute) => {
    setRouteToEdit(route);
    setShowEditRoute(true);
  };

  const handleSaveEditedRoute = async (
    oldName: string,
    newName: string,
    comments: string
  ) => {
    try {
      if (!routeToEdit) return;

      await updateRoute(
        oldName,
        newName,
        routeToEdit.destinationLat,
        routeToEdit.destinationLong,
        comments
      );

      setRoutes((prev) =>
        prev.map((r) =>
          r.routeName === oldName
            ? { ...r, routeName: newName, customComments: comments }
            : r
        )
      );

      if (selectedRoute === oldName) {
        await setSelectedRoute(newName);
        setSelectedRouteState(newName);
      }

      setShowEditRoute(false);
      setRouteToEdit(null);
      haptics.success();
      setToast({
        visible: true,
        message: "Route updated!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to update route:", err);
      haptics.error();
      setToast({
        visible: true,
        message: "Couldn't update route. Please try again.",
        type: "error",
      });
    }
  };

  const handleStartBroadcast = async (routeName: string) => {
    try {
      haptics.mediumTap();
      await setSelectedRoute(routeName);
      setSelectedRouteState(routeName);
      setShowMapView(true); // Show map when starting broadcast
      setToast({
        visible: true,
        message: "Now broadcasting your location!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to start broadcast:", err);
      haptics.error();
      setToast({
        visible: true,
        message: "Couldn't start broadcasting. Please try again.",
        type: "error",
      });
    }
  };

  const handleStopBroadcast = async () => {
    try {
      haptics.mediumTap();
      await setSelectedRoute(null);
      setSelectedRouteState(null);
      setShowMapView(false); // Go back to home when stopping
      setToast({
        visible: true,
        message: "Broadcasting stopped",
        type: "info",
      });
    } catch (err) {
      console.error("Failed to stop broadcast:", err);
      haptics.error();
      setToast({
        visible: true,
        message: "Couldn't stop broadcasting. Please try again.",
        type: "error",
      });
    }
  };

  const handleGoBack = () => {
    // Just go back to home, keep broadcasting
    haptics.lightTap();
    setShowMapView(false);
  };

  const handleViewMap = () => {
    // Go to map view (when tapping broadcast indicator on home)
    haptics.lightTap();
    setShowMapView(true);
  };

  const handleRecenter = () => {
    if (!region || !mapRef.current) return;
    haptics.lightTap();
    mapRef.current.animateToRegion(region, 800);
  };

  const handleLogout = () => {
    logout();
  };

  const activeRoute = routes.find((r) => r.routeName === selectedRoute);

  // Home View - Route Selection
  const renderHomeView = () => (
    <Animated.View
      style={[
        styles.homeContainer,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -height],
              }),
            },
          ],
        },
      ]}
      pointerEvents={showMapView ? "none" : "auto"}
    >
      <LinearGradient
        colors={["#0C4A6E", "#0E7490", "#06B6D4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.homeGradient}
      >
        <StatusBar barStyle="light-content" />

        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        {/* Active Broadcast Banner - Show when broadcasting but on home screen */}
        {selectedRoute && !showMapView && (
          <TouchableOpacity 
            style={styles.activeBroadcastBanner}
            onPress={handleViewMap}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.accent.success, "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.activeBroadcastGradient}
            >
              <Animated.View
                style={[
                  styles.bannerDot,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerLabel}>Currently Broadcasting</Text>
                <Text style={styles.bannerRoute} numberOfLines={1}>
                  {selectedRoute}
                </Text>
              </View>
              <View style={styles.bannerArrow}>
                <Ionicons name="chevron-forward" size={20} color={Colors.text.inverse} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{greeting}</Text>
            {profile?.firstname && (
              <Text style={styles.nameText}>{profile.firstname}</Text>
            )}
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setShowAccount(true)}
            >
              <Avatar firstname={profile?.firstname} lastname={profile?.lastname} size={48} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.titleText}>Where to?</Text>

        {/* Routes List */}
        <ScrollView
          style={styles.routesList}
          contentContainerStyle={styles.routesListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.text.inverse}
              colors={[Colors.primary.main]}
            />
          }
        >
          {routes.length === 0 ? (
            // Empty State
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="car-outline" size={48} color="rgba(255,255,255,0.3)" />
              </View>
              <Text style={styles.emptyTitle}>No routes yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first route to start{"\n"}connecting with riders
              </Text>
            </View>
          ) : (
            // Route Cards
            routes.map((route) => {
              const isActive = route.routeName === selectedRoute;
              return (
                <AnimatedPressable
                  key={route.routeName}
                  style={[styles.routeCard, isActive && styles.routeCardActive]}
                  onPress={() => isActive ? handleViewMap() : handleStartBroadcast(route.routeName)}
                  onLongPress={() => {
                    haptics.heavyTap();
                    handleEditRoute(route);
                  }}
                  hapticType="selection"
                  scaleValue={0.98}
                >
                  <View style={[styles.routeIconContainer, isActive && styles.routeIconActive]}>
                    <Ionicons 
                      name={isActive ? "radio" : "navigate"} 
                      size={24} 
                      color={isActive ? Colors.accent.success : Colors.primary.main} 
                    />
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeName}>{route.routeName}</Text>
                    {route.customComments && (
                      <Text style={styles.routeComments} numberOfLines={1}>
                        {route.customComments}
                      </Text>
                    )}
                    <Text style={[styles.routeAction, isActive && styles.routeActionActive]}>
                      {isActive ? "Broadcasting • Tap to view map" : "Tap to start broadcasting"}
                    </Text>
                  </View>
                  <View style={[styles.routeArrow, isActive && styles.routeArrowActive]}>
                    <Ionicons 
                      name={isActive ? "eye" : "radio"} 
                      size={20} 
                      color={isActive ? Colors.accent.success : Colors.text.tertiary} 
                    />
                  </View>
                </AnimatedPressable>
              );
            })
          )}

          {/* Add Route Card */}
          <AnimatedPressable
            style={styles.addRouteCard}
            onPress={() => {
              haptics.lightTap();
              setShowAddRoute(true);
            }}
            hapticType="none"
            scaleValue={0.98}
          >
            <View style={styles.addRouteIcon}>
              <Ionicons name="add" size={28} color={Colors.primary.main} />
            </View>
            <Text style={styles.addRouteText}>Add new route</Text>
          </AnimatedPressable>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Bottom hint */}
        <View style={styles.bottomHint}>
          <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.hintText}>Long press a route to edit or delete</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Map View - Broadcasting
  const renderMapView = () => (
    <Animated.View
      style={[
        styles.mapContainer,
        {
          opacity: slideAnim,
        },
      ]}
      pointerEvents={showMapView ? "auto" : "none"}
    >
      {/* Map */}
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          mapType="standard"
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={false}
        />
      )}

      {/* Top Status Card */}
      {activeRoute && (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.statusBackButton}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.statusInfo}>
              <View style={styles.broadcastingRow}>
                <Animated.View
                  style={[
                    styles.broadcastDot,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                />
                <Text style={styles.broadcastingLabel}>Broadcasting</Text>
              </View>
              <Text style={styles.statusRouteName} numberOfLines={1}>
                {activeRoute.routeName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAccount(true)}
              style={styles.statusProfileButton}
            >
              <Avatar firstname={profile?.firstname} lastname={profile?.lastname} size={40} />
            </TouchableOpacity>
          </View>

          {activeRoute.customComments && (
            <View style={styles.commentsRow}>
              <Ionicons name="chatbubble-outline" size={14} color={Colors.text.tertiary} />
              <Text style={styles.commentsText} numberOfLines={1}>
                {activeRoute.customComments}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Recenter Button */}
      <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
        <Ionicons name="locate" size={24} color={Colors.primary.main} />
      </TouchableOpacity>

      {/* Stop Button */}
      <TouchableOpacity style={styles.stopButton} onPress={handleStopBroadcast}>
        <LinearGradient
          colors={[Colors.accent.error, "#DC2626"]}
          style={styles.stopButtonGradient}
        >
          <Ionicons name="stop-circle" size={22} color={Colors.text.inverse} />
          <Text style={styles.stopButtonText}>Stop Broadcasting</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderMapView()}
      {renderHomeView()}

      <ViewAccountPopup
        visible={showAccount}
        onClose={() => setShowAccount(false)}
      />

      <AddRoutePopup
        visible={showAddRoute}
        onClose={() => setShowAddRoute(false)}
        onSave={handleSaveRoute}
      />

      <EditRoutePopup
        visible={showEditRoute}
        route={routeToEdit}
        onClose={() => {
          setShowEditRoute(false);
          setRouteToEdit(null);
        }}
        onSave={handleSaveEditedRoute}
        onDelete={handleDelete}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },

  // Avatar
  avatarGradient: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: Colors.text.inverse,
    fontWeight: FontWeights.semiBold,
    letterSpacing: 0.5,
  },

  // Home View
  homeContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  homeGradient: {
    flex: 1,
    paddingTop: 60,
  },

  // Active Broadcast Banner
  activeBroadcastBanner: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Shadows.lg,
  },
  activeBroadcastGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  bannerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.text.inverse,
    marginRight: Spacing.sm,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerLabel: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.xs,
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bannerRoute: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
  },
  bannerArrow: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Decorative elements
  decorativeCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    bottom: 150,
    left: -80,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.7)",
  },
  nameText: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.inverse,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileButton: {
    ...Shadows.glow,
    borderRadius: BorderRadius.full,
  },

  titleText: {
    fontWeight: FontWeights.bold,
    fontSize: 32,
    color: Colors.text.inverse,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    lineHeight: 40,
  },

  // Routes List
  routesList: {
    flex: 1,
  },
  routesListContent: {
    paddingHorizontal: Spacing.xl,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 22,
  },

  // Route Card
  routeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface.card,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  routeCardActive: {
    borderWidth: 2,
    borderColor: Colors.accent.success,
  },
  routeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    backgroundColor: `${Colors.primary.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  routeIconActive: {
    backgroundColor: `${Colors.accent.success}15`,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  routeComments: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  routeAction: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.primary.main,
  },
  routeActionActive: {
    color: Colors.accent.success,
  },
  routeArrow: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.lightSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  routeArrowActive: {
    backgroundColor: `${Colors.accent.success}15`,
  },

  // Add Route Card
  addRouteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderStyle: "dashed",
  },
  addRouteIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  addRouteText: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
  },

  // Bottom hint
  bottomHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    paddingBottom: 30,
    gap: Spacing.xs,
  },
  hintText: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.5)",
  },

  // Map View
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 1,
  },

  // Status Card
  statusCard: {
    position: "absolute",
    top: 50,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.surface.card,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.lg,
    ...Shadows.xl,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBackButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.lightSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  statusInfo: {
    flex: 1,
  },
  broadcastingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: 2,
  },
  broadcastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.success,
  },
  broadcastingLabel: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.accent.success,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusRouteName: {
    fontWeight: FontWeights.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
  statusProfileButton: {
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  commentsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  commentsText: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    flex: 1,
  },

  // Buttons
  recenterButton: {
    position: "absolute",
    bottom: 100,
    right: Spacing.xl,
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface.card,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.lg,
  },
  stopButton: {
    position: "absolute",
    bottom: 30,
    left: Spacing.xl,
    right: Spacing.xl,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    ...Shadows.lg,
  },
  stopButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  stopButtonText: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.inverse,
  },
});
