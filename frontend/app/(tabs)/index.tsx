// app/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF", "#C7E2FF", "#A8D4FF"]}
      locations={[0, 0.4, 0.65, 1]}
      style={styles.container}
    >
      <Text style={styles.title}>
        WELCOME{"\n"}
        TO <Text style={styles.brand}>Rydar</Text>
      </Text>


      {/* Rider Option */}
      <TouchableOpacity
        onPress={() => router.push("/rider")}
        style={styles.outlineBox}
      >
        <View style={styles.centerContent}>
          <Ionicons name="person-outline" size={22} color="#000" />
          <Text style={styles.optionText}>I am a rider</Text>
        </View>
      </TouchableOpacity>

      {/* Driver Option */}
      <TouchableOpacity
        onPress={() => router.push("/driver")}
        style={styles.outlineBox}
      >
        <View style={styles.centerContent}>
          <Ionicons name="car-outline" size={22} color="#000" />
          <Text style={styles.optionText}>I am a driver</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  brand: {
    color: "#1E7CFF",
  },


  title: {
    fontSize: 50,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 80,
    lineHeight: 48,
  },

  outlineBox: {
    width: "80%",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.28)",
    marginVertical: 14,

    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
  },

  centerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  optionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
});
