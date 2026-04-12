/**
 * app/index.tsx — Welcome Screen
 *
 * Shown on first launch only. Subsequent launches skip directly to (tabs).
 * Uses AsyncStorage to persist the "seen" flag.
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const WELCOME_KEY = "@invera_welcome_seen";

export default function WelcomeScreen() {
  // ── Animations ────────────────────────────────────────────────────────────
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(30)).current;
  const line1Opacity = useRef(new Animated.Value(0)).current;
  const line1Y = useRef(new Animated.Value(20)).current;
  const line2Opacity = useRef(new Animated.Value(0)).current;
  const line2Y = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(0.9)).current;
  const dividerWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance sequence
    Animated.sequence([
      // Logo fades + rises
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(logoY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      // Gold divider draws across
      Animated.timing(dividerWidth, { toValue: 1, duration: 400, useNativeDriver: false }),
      // Headline line 1
      Animated.parallel([
        Animated.timing(line1Opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(line1Y, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),
      // Headline line 2 (gold)
      Animated.parallel([
        Animated.timing(line2Opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(line2Y, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),
      // Subtitle
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      // CTA button
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      ]),
    ]).start();
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleGetStarted = async () => {
    await AsyncStorage.setItem(WELCOME_KEY, "true");
    router.replace("/(tabs)");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000a1e" />

      {/* Full-screen background gradient */}
      <LinearGradient
        colors={["#002147", "#001530", "#000a1e"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Gold corner radiance — top-left */}
      <LinearGradient
        colors={["rgba(201,168,76,0.22)", "rgba(201,168,76,0.06)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 0.7 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Subtle bottom-right counter-glow */}
      <LinearGradient
        colors={["transparent", "rgba(201,168,76,0.08)"]}
        start={{ x: 0.3, y: 0.3 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        {/* ── Centre content ── */}
        <View style={styles.content}>

          {/* Logo mark */}
          <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ translateY: logoY }] }]}>
            <LinearGradient
              colors={["rgba(201,168,76,0.18)", "rgba(201,168,76,0.06)"]}
              style={styles.logoCircle}
            >
              <Ionicons name="trending-up" size={42} color="#C9A84C" />
            </LinearGradient>
            <Text style={styles.wordmark}>INVERA</Text>
          </Animated.View>

          {/* Gold divider */}
          <Animated.View
            style={[
              styles.divider,
              {
                width: dividerWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "40%"],
                }),
              },
            ]}
          />

          {/* Headline */}
          <Animated.Text style={[styles.headline1, { opacity: line1Opacity, transform: [{ translateY: line1Y }] }]}>
            Invest in the
          </Animated.Text>
          <Animated.Text style={[styles.headline2, { opacity: line2Opacity, transform: [{ translateY: line2Y }] }]}>
            Future of Jordan
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
            Discover curated investment opportunities{"\n"}across Jordan{"'"}s fastest-growing sectors.
          </Animated.Text>
        </View>

        {/* ── Bottom CTA ── */}
        <Animated.View style={[styles.btnWrap, { opacity: btnOpacity, transform: [{ scale: btnScale }] }]}>
          <TouchableOpacity
            style={styles.btn}
            onPress={handleGetStarted}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <LinearGradient
              colors={["#C9A84C", "#a8853a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="#000a1e" />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Jordan Investment Commission · Regulated Platform
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000a1e",
  },
  safe: {
    flex: 1,
    justifyContent: "space-between",
  },

  // ── Content block ──────────────────────────────────────────────────────────
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },

  // Logo
  logoWrap: {
    alignItems: "center",
    marginBottom: 28,
    gap: 14,
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.35)",
  },
  wordmark: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(201,168,76,0.8)",
    letterSpacing: 5,
  },

  // Divider
  divider: {
    height: 1.5,
    backgroundColor: "#C9A84C",
    borderRadius: 1,
    marginBottom: 24,
    opacity: 0.6,
  },

  // Headline
  headline1: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 34,
    color: "#ffffff",
    letterSpacing: 0.2,
    lineHeight: 42,
    textAlign: "center",
  },
  headline2: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 38,
    color: "#C9A84C",
    letterSpacing: 0.2,
    lineHeight: 46,
    textAlign: "center",
    marginBottom: 24,
  },

  // Subtitle
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  // ── CTA block ─────────────────────────────────────────────────────────────
  btnWrap: {
    paddingHorizontal: 28,
    paddingBottom: 20,
    alignItems: "center",
    gap: 14,
  },
  btn: {
    width: "100%",
    borderRadius: 50,
    overflow: "hidden",
    shadowColor: "#C9A84C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  btnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  btnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000a1e",
    letterSpacing: 0.3,
  },
  disclaimer: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
