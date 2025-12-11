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
  FlatList,
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
import {
  searchPlaces,
  type PlaceResult,
} from "../../../../scripts/mapboxSearch";

export type NewRoutePayload = {
  routeName: string;
  destinationLat: number;
  destinationLong: number;
  customComments?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (route: NewRoutePayload) => void;
};

export default function AddRoutePopup({ visible, onClose, onSave }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [customComments, setCustomComments] = useState("");

  const reset = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setSelectedPlace(null);
    setCustomComments("");
    Keyboard.dismiss();
    onClose();
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const places = await searchPlaces(searchQuery);
        setSearchResults(places);
      } catch (err) {
        console.log("searchPlaces error in AddRoutePopup:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSelectPlace = (place: PlaceResult) => {
    Keyboard.dismiss();
    setSelectedPlace(place);
    setSearchResults([]);
    setSearchQuery(place.name);
  };

  const handleSaveRoute = () => {
    if (!selectedPlace) return;

    onSave({
      routeName: selectedPlace.name,
      destinationLat: selectedPlace.latitude,
      destinationLong: selectedPlace.longitude,
      customComments: customComments || undefined,
    });

    reset();
  };

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
                    <Ionicons name="add-circle" size={24} color={Colors.primary.main} />
                  </View>
                  <Text style={styles.title}>Add Route</Text>
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
                  {/* Destination Search */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Destination</Text>
                    <View style={styles.searchContainer}>
                      <Ionicons
                        name="search"
                        size={20}
                        color={Colors.text.tertiary}
                        style={styles.searchIcon}
                      />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search for a destination"
                        placeholderTextColor={Colors.text.tertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                        autoCapitalize="none"
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            setSearchQuery("");
                            setSelectedPlace(null);
                          }}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color={Colors.text.tertiary}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <View style={styles.dropdown}>
                      <FlatList
                        data={searchResults}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleSelectPlace(item)}
                            style={styles.dropdownItem}
                          >
                            <View style={styles.dropdownIcon}>
                              <Ionicons
                                name="location"
                                size={16}
                                color={Colors.primary.main}
                              />
                            </View>
                            <View style={styles.dropdownTextContainer}>
                              <Text style={styles.dropdownTitle}>{item.name}</Text>
                              <Text style={styles.dropdownSubtitle}>{item.address}</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  )}

                  {isSearching && (
                    <View style={styles.searchingIndicator}>
                      <Text style={styles.searchingText}>Searching...</Text>
                    </View>
                  )}

                  {/* Selected Place Card */}
                  {selectedPlace && (
                    <View style={styles.selectedCard}>
                      <View style={styles.selectedIcon}>
                        <Ionicons name="flag" size={20} color={Colors.accent.success} />
                      </View>
                      <View style={styles.selectedInfo}>
                        <Text style={styles.selectedName}>{selectedPlace.name}</Text>
                        <Text style={styles.selectedAddress}>{selectedPlace.address}</Text>
                      </View>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={Colors.accent.success}
                      />
                    </View>
                  )}

                  {/* Comments Field - Only show when destination is selected */}
                  {selectedPlace && (
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
                  )}

                  {/* Save Button */}
                  {selectedPlace && (
                    <TouchableOpacity onPress={handleSaveRoute} activeOpacity={0.8}>
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
                        <Text style={styles.saveButtonText}>Save Route</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.light,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
  },
  dropdown: {
    backgroundColor: Colors.surface.card,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.md,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.border.light,
  },
  dropdownIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: `${Colors.primary.main}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  dropdownTextContainer: {
    flex: 1,
  },
  dropdownTitle: {
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  dropdownSubtitle: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  searchingIndicator: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  searchingText: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.accent.success}15`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.accent.success}30`,
  },
  selectedIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.accent.success}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  selectedAddress: {
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
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
