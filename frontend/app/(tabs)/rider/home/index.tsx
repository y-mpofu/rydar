import {
  BorderRadius,
  Colors,
  FontWeights,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import AnimatedPressable from "@/components/AnimatedPressable";
import LoadingSpinner from "@/components/LoadingSpinner";
import Toast from "@/components/Toast";
import * as haptics from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  searchPlaces,
  type PlaceResult,
} from "../../../../scripts/mapboxSearch";
import { driversNearby, type NearbyDriver } from "../services/drivers";
import { getProfile, type UserProfile } from "../services/profile";
import DriverDetailPopup from "./DriverDetailPopup";
import ViewAccountPopup from "./ViewAccountPopup";

const { width, height } = Dimensions.get("window");

type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

type Destination = {
    latitude: number;
    longitude: number;
    name: string;
    address?: string;
};

// Avatar component with initials
const Avatar = ({ 
  firstname, 
  lastname, 
  size = 52 
}: { 
  firstname?: string; 
  lastname?: string; 
  size?: number;
}) => {
  const initials = firstname && lastname 
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
  const searchInputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

    const [region, setRegion] = useState<Region | null>(null);
    const [userRegion, setUserRegion] = useState<Region | null>(null);
    const [nearby, setNearby] = useState<NearbyDriver[]>([]);
    const [showAccount, setShowAccount] = useState(false);
    const [results, setResults] = useState<PlaceResult[]>([]);
    const [query, setQuery] = useState("");
    const [destination, setDestination] = useState<Destination | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<NearbyDriver | null>(null);
    const [showDriverDetail, setShowDriverDetail] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" as "success" | "error" | "warning" | "info" });

  // Load user profile
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

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Subtle pulse animation for search card
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Animate to map view when destination is set
  useEffect(() => {
    if (destination) {
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
  }, [destination]);

    // AUTOCOMPLETE SEARCH
    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            try {
                const places = region
                    ? await searchPlaces(query, region.longitude, region.latitude)
                    : await searchPlaces(query);

                setResults(places);
            } catch (e) {
                console.log("searchPlaces error:", e);
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, region]);

  // USER LOCATION TRACKING
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
                    const initialRegion: Region = {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        latitudeDelta: 0.025,
                        longitudeDelta: 0.025,
                    };

                    setUserRegion(initialRegion);
                    setRegion((prev) => (prev ? prev : initialRegion));
                }
            );

            return () => subscription.remove();
        })();
    }, []);

  // POLL FOR NEARBY DRIVERS
    useEffect(() => {
    if (!destination) return;

        let isMounted = true;
        let isFirstFetch = true;

        const fetchDrivers = async () => {
            try {
                if (isFirstFetch) {
                    setIsLoadingDrivers(true);
                }
                
                const res = await driversNearby(
                    destination.latitude,
                    destination.longitude,
                    1000,
                    20,
                    destination.name
                );
                if (isMounted) {
                    setNearby(res.nearbyDrivers);
                    setHasSearchedOnce(true);
                    
                    // Haptic feedback when drivers found for first time
                    if (isFirstFetch && res.nearbyDrivers.length > 0) {
                        haptics.success();
                    }
                }
            } catch (err) {
                console.error("Failed to poll driversNearby:", err);
                if (isMounted && isFirstFetch) {
                    setToast({
                        visible: true,
                        message: "Couldn't search for drivers. Please check your connection.",
                        type: "error",
                    });
                    haptics.error();
                }
            } finally {
                if (isMounted) {
                    setIsLoadingDrivers(false);
                    isFirstFetch = false;
                }
            }
        };

        fetchDrivers();
        const interval = setInterval(fetchDrivers, 3000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [destination]);

    const handleRecenter = () => {
    if (!userRegion || !mapRef.current) return;
    haptics.lightTap();
    mapRef.current.animateToRegion(userRegion, 800);
    };

    const handleStopChecking = () => {
        setDestination(null);
        setNearby([]);
        setQuery("");
        setResults([]);
    setIsSearching(false);
    setHasSearchedOnce(false);
    haptics.mediumTap();

        if (userRegion) {
            setRegion(userRegion);
            mapRef.current?.animateToRegion(userRegion, 600);
        }
    };

    const handleSelectPlace = async (place: PlaceResult) => {
        Keyboard.dismiss();
    setIsSearching(false);
    haptics.selection();

        setDestination({
            latitude: place.latitude,
            longitude: place.longitude,
            name: place.name,
            address: place.address,
        });

    if (userRegion) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(userRegion, 600);
      }, 500);
    }

        setQuery("");
        setResults([]);
  };

  const handleStartSearch = () => {
    haptics.lightTap();
    setIsSearching(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleCancelSearch = () => {
    haptics.lightTap();
    setIsSearching(false);
    setQuery("");
    setResults([]);
    Keyboard.dismiss();
  };

    const driverCountLabel =
        destination != null
            ? isLoadingDrivers
        ? "Searching for drivers..."
        : nearby.length === 0
        ? "No drivers found nearby"
        : `${nearby.length} driver${nearby.length > 1 ? "s" : ""} heading your way`
      : "";

  // Home/Search View - Minimal Design
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
      pointerEvents={destination ? "none" : "auto"}
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
        <View style={styles.decorativeCircle3} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{greeting}</Text>
            {profile?.firstname && (
              <Text style={styles.nameText}>{profile.firstname}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              haptics.lightTap();
              setShowAccount(true);
            }}
          >
            <Avatar firstname={profile?.firstname} lastname={profile?.lastname} size={52} />
          </TouchableOpacity>
        </View>

        {/* Main Content - Centered */}
        <View style={styles.mainContent}>
          <Text style={styles.titleText}>Where to?</Text>

          {/* Search Card */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.searchCard}
              onPress={handleStartSearch}
              activeOpacity={0.95}
            >
              <View style={styles.searchIconContainer}>
                <Ionicons name="search" size={26} color={Colors.primary.main} />
              </View>
              <Text style={styles.searchPlaceholder}>Enter destination</Text>
              <View style={styles.searchArrow}>
                <Ionicons name="arrow-forward" size={20} color={Colors.text.tertiary} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Bottom hint */}
        <View style={styles.bottomHint}>
          <View style={styles.hintDot} />
          <Text style={styles.hintText}>Find drivers on your route</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Search Modal
  const renderSearchModal = () =>
    isSearching && (
      <View style={styles.searchModal}>
        <LinearGradient
          colors={["#0C4A6E", "#0E7490"]}
          style={styles.searchModalGradient}
        >
          {/* Search Header */}
          <View style={styles.searchModalHeader}>
            <TouchableOpacity onPress={handleCancelSearch} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.text.inverse} />
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={Colors.text.tertiary} />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Where are you going?"
                placeholderTextColor={Colors.text.tertiary}
                value={query}
                onChangeText={setQuery}
                autoFocus={false}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Ionicons name="close-circle" size={20} color={Colors.text.tertiary} />
                            </TouchableOpacity>
                        )}
                        </View>
                    </View>

          {/* Search Results */}
          <ScrollView
            style={styles.searchResults}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            {query.length < 2 ? (
              <View style={styles.searchHint}>
                <Ionicons name="location-outline" size={48} color="rgba(255,255,255,0.3)" />
                <Text style={styles.searchHintText}>
                  Start typing to search
                </Text>
              </View>
            ) : results.length === 0 ? (
              <View style={styles.searchHint}>
                <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.3)" />
                <Text style={styles.searchHintText}>Searching...</Text>
              </View>
            ) : (
              results.map((item) => (
                <AnimatedPressable
                  key={item.id}
                  onPress={() => handleSelectPlace(item)}
                  style={styles.resultItem}
                  hapticType="selection"
                  scaleValue={0.98}
                >
                  <View style={styles.resultIcon}>
                    <Ionicons name="location" size={20} color={Colors.primary.light} />
                  </View>
                  <View style={styles.resultText}>
                    <Text style={styles.resultTitle}>{item.name}</Text>
                    <Text style={styles.resultSubtitle}>{item.address}</Text>
                </View>
                </AnimatedPressable>
              ))
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    );

  // Map View (shown when destination is set)
  const renderMapView = () => (
    <Animated.View
      style={[
        styles.mapContainer,
        {
          opacity: slideAnim,
        },
      ]}
      pointerEvents={destination ? "auto" : "none"}
    >
      {/* Map */}
            {region && (
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        region={region}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                    >
          {/* Destination marker */}
                        {destination && (
                            <Marker
                                coordinate={{
                                    latitude: destination.latitude,
                                    longitude: destination.longitude,
                                }}
                                title={destination.name}
                                description={destination.address}
                            />
                        )}

          {/* Driver markers */}
                        {nearby.map((driver) => (
                            <Marker
                                key={driver.userId}
                                coordinate={{
                                    latitude: driver.latitude,
                                    longitude: driver.longitude,
                                }}
                                title={driver.currRouteName || "Driver"}
                                onPress={() => {
                                    setSelectedDriver(driver);
                                    setShowDriverDetail(true);
                                }}
                            >
                                <View style={styles.driverMarker}>
                <LinearGradient
                  colors={[Colors.primary.main, Colors.primary.dark]}
                  style={styles.driverMarkerGradient}
                >
                  <Ionicons name="car" size={18} color={Colors.text.inverse} />
                </LinearGradient>
                                </View>
                            </Marker>
                        ))}
                    </MapView>
      )}

      {/* Top Destination Card */}
      {destination && (
        <View style={styles.destinationCard}>
          <View style={styles.destinationHeader}>
            <TouchableOpacity
              onPress={handleStopChecking}
              style={styles.destinationBackButton}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.destinationInfo}
              onPress={() => {
                if (mapRef.current && destination) {
                  mapRef.current.animateToRegion(
                    {
                      latitude: destination.latitude,
                      longitude: destination.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    },
                    600
                  );
                }
              }}
            >
              <Text style={styles.destinationLabel}>Going to</Text>
              <View style={styles.destinationNameRow}>
                <Text style={styles.destinationName} numberOfLines={1}>
                  {destination.name}
                </Text>
                <Ionicons name="navigate" size={14} color={Colors.primary.main} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowAccount(true)}
              style={styles.destinationProfileButton}
            >
              <Avatar firstname={profile?.firstname} lastname={profile?.lastname} size={40} />
                    </TouchableOpacity>
          </View>

          {/* Driver Status */}
          <View style={styles.driverStatus}>
            {isLoadingDrivers ? (
              <LoadingSpinner size={18} color={Colors.primary.main} />
            ) : (
              <View
                style={[
                  styles.statusDot,
                  nearby.length > 0 ? styles.statusDotActive : styles.statusDotEmpty,
                ]}
              />
            )}
            <Text style={styles.statusText}>{driverCountLabel}</Text>
          </View>
        </View>
      )}

      {/* Recenter Button */}
      <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
        <Ionicons name="locate" size={24} color={Colors.primary.main} />
      </TouchableOpacity>

      {/* Stop Button */}
      {destination && (
        <TouchableOpacity style={styles.stopButton} onPress={handleStopChecking}>
          <LinearGradient
            colors={[Colors.accent.error, "#DC2626"]}
            style={styles.stopButtonGradient}
          >
            <Ionicons name="close" size={22} color={Colors.text.inverse} />
            <Text style={styles.stopButtonText}>Cancel</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderMapView()}
      {renderHomeView()}
      {renderSearchModal()}

      <ViewAccountPopup visible={showAccount} onClose={() => setShowAccount(false)} />

            <DriverDetailPopup
                visible={showDriverDetail}
                driver={selectedDriver}
                onClose={() => {
                    setShowDriverDetail(false);
                    setSelectedDriver(null);
                }}
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

  // Home View Styles
  homeContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  homeGradient: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: Spacing.xl,
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
    bottom: 100,
    left: -50,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    top: height * 0.4,
    right: -30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.lg,
    color: "rgba(255, 255, 255, 0.7)",
  },
  nameText: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.inverse,
        marginTop: 2,
    },
  profileButton: {
    ...Shadows.glow,
    borderRadius: BorderRadius.full,
  },

  // Main content
  mainContent: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },
  titleText: {
    fontWeight: FontWeights.bold,
    fontSize: 42,
    color: Colors.text.inverse,
    marginBottom: Spacing["2xl"],
    letterSpacing: -1,
  },

  // Search Card
  searchCard: {
        flexDirection: "row",
        alignItems: "center",
    backgroundColor: Colors.surface.card,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.lg,
    ...Shadows.xl,
  },
  searchIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: `${Colors.primary.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  searchPlaceholder: {
    flex: 1,
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
  },
  searchArrow: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.lightSecondary,
    justifyContent: "center",
    alignItems: "center",
  },

  // Bottom hint
  bottomHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
    gap: Spacing.sm,
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.light,
  },
  hintText: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.6)",
  },

  // Search Modal
  searchModal: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  searchModalGradient: {
    flex: 1,
    paddingTop: 60,
  },
  searchModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    paddingVertical: 8,
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  searchHint: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  searchHintText: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  resultItem: {
        flexDirection: "row",
        alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  resultText: {
    flex: 1,
  },
  resultTitle: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.5)",
  },

  // Map View Styles
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 1,
  },
  driverMarker: {
    ...Shadows.glow,
    borderRadius: BorderRadius.full,
  },
  driverMarkerGradient: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.surface.card,
  },

  // Destination Card
  destinationCard: {
    position: "absolute",
    top: 50,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.surface.card,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.lg,
    ...Shadows.xl,
  },
  destinationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  destinationBackButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.lightSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationLabel: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  destinationNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  destinationName: {
    fontWeight: FontWeights.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    flex: 1,
  },
  destinationProfileButton: {
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  driverStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.lightSecondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm,
  },
  statusDotActive: {
    backgroundColor: Colors.accent.success,
  },
  statusDotSearching: {
    backgroundColor: Colors.accent.warning,
  },
  statusDotEmpty: {
    backgroundColor: Colors.text.tertiary,
  },
  statusText: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
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
