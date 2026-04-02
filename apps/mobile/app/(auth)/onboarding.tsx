import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInUp,
} from "react-native-reanimated";
import type { TravelerCategory, AgeRange } from "@travel-checker/shared/src/types";
import { ALL_CATEGORIES, getCategoryConfig } from "@/lib/categoryConfig";
import { useUpdateProfile } from "@/hooks/useUser";
import { Button } from "@/components/Button";
import { syncUser } from "@/api/users";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ONBOARDING_KEY = "onboarding_seen";

const AGE_RANGES: AgeRange[] = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

type Phase = "intro" | "category" | "age";

const SLIDES = [
  {
    emoji: "🗺️",
    title: "Track Your Travels",
    description: "Pin every destination on your personal world map and watch your travel story grow.",
    gradient: ["#0284c7", "#38bdf8"] as const,
  },
  {
    emoji: "📊",
    title: "Log Every Detail",
    description: "Record budgets, photos, accommodation and more for each trip you take.",
    gradient: ["#7c3aed", "#a78bfa"] as const,
  },
  {
    emoji: "✨",
    title: "Build Your Story",
    description: "See stats, compare trips, and share your adventures with fellow travelers.",
    gradient: ["#059669", "#34d399"] as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [slideIndex, setSlideIndex] = useState(0);
  const [category, setCategory] = useState<TravelerCategory | null>(null);
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const translateX = useSharedValue(0);

  React.useEffect(() => {
    void syncUser();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setSlideIndex(index);
      translateX.value = withTiming(-index * SCREEN_WIDTH, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
    },
    [translateX]
  );

  const handleNext = useCallback(() => {
    void Haptics.selectionAsync();
    if (slideIndex < SLIDES.length - 1) {
      goToSlide(slideIndex + 1);
    } else {
      setPhase("category");
    }
  }, [slideIndex, goToSlide]);

  const handleSkip = useCallback(() => {
    void Haptics.selectionAsync();
    setPhase("category");
  }, []);

  const handleCategoryContinue = () => {
    if (!category) {
      Alert.alert("Select category", "Please select your travel style.");
      return;
    }
    void Haptics.selectionAsync();
    setPhase("age");
  };

  const handleFinish = async () => {
    if (!category || !ageRange) return;
    try {
      await updateProfile({ travelerCategory: category, ageRange });
      await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Could not save preferences. Please try again.");
    }
  };

  const slideAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // --- Intro slides ---
  if (phase === "intro") {
    const slide = SLIDES[slideIndex];
    return (
      <View className="flex-1">
        <LinearGradient colors={[...slide.gradient]} className="flex-1 justify-center items-center px-8">
          <Animated.View style={[{ flexDirection: "row", width: SCREEN_WIDTH * SLIDES.length }, slideAnimStyle]}>
            {SLIDES.map((s, i) => (
              <View key={i} style={{ width: SCREEN_WIDTH }} className="items-center justify-center px-8">
                <Text className="text-7xl mb-6">{s.emoji}</Text>
                <Text className="text-3xl font-bold text-white text-center mb-3">{s.title}</Text>
                <Text className="text-base text-white/80 text-center leading-6">{s.description}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Dots */}
          <View className="flex-row gap-2 mt-10">
            {SLIDES.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
                <View
                  className={`h-2 rounded-full ${i === slideIndex ? "w-8 bg-white" : "w-2 bg-white/40"}`}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View className="absolute bottom-12 left-0 right-0 px-6 flex-row justify-between items-center">
            <TouchableOpacity onPress={handleSkip} accessibilityRole="button" accessibilityLabel="Skip intro">
              <Text className="text-white/70 font-medium">Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              className="bg-white/20 px-6 py-3 rounded-2xl"
              accessibilityRole="button"
              accessibilityLabel={slideIndex < SLIDES.length - 1 ? "Next slide" : "Get started"}
            >
              <Text className="text-white font-bold">
                {slideIndex < SLIDES.length - 1 ? "Next" : "Get Started"}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // --- Category + Age selection ---
  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={["#0284c7", "#38bdf8"]} className="px-6 pb-8 pt-16">
        <Text className="text-sm text-sky-200 font-medium mb-1">
          Step {phase === "category" ? "1" : "2"} of 2
        </Text>
        <Text className="text-2xl font-bold text-white">
          {phase === "category" ? "How do you travel?" : "How old are you?"}
        </Text>
        <Text className="text-sky-100 mt-1">
          {phase === "category"
            ? "This helps us personalize your experience."
            : "We use this to connect you with like-minded travelers."}
        </Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        {phase === "category" ? (
          <Animated.View entering={FadeInUp.duration(400)} className="flex-row flex-wrap gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const config = getCategoryConfig(cat);
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => { setCategory(cat); void Haptics.selectionAsync(); }}
                  className="w-[47%] p-4 rounded-2xl border-2"
                  style={{
                    backgroundColor: isSelected ? config.color : config.bgColor,
                    borderColor: isSelected ? config.color : "transparent",
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={config.label}
                >
                  <Text className="text-3xl mb-2">{config.emoji}</Text>
                  <Text
                    className="font-semibold text-sm"
                    style={{ color: isSelected ? "#fff" : config.textColor }}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp.duration(400)} className="gap-3">
            {AGE_RANGES.map((range) => {
              const isSelected = ageRange === range;
              return (
                <TouchableOpacity
                  key={range}
                  onPress={() => { setAgeRange(range); void Haptics.selectionAsync(); }}
                  className={`p-4 rounded-2xl border-2 ${
                    isSelected ? "border-sky-500 bg-sky-50" : "border-gray-100 bg-gray-50"
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text className={`text-lg font-semibold ${isSelected ? "text-sky-700" : "text-gray-700"}`}>
                    {range} years
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-white border-t border-gray-100">
        {phase === "category" ? (
          <Button title="Continue" onPress={handleCategoryContinue} fullWidth size="lg" />
        ) : (
          <Button
            title="Get Started"
            onPress={() => void handleFinish()}
            loading={isPending}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </View>
  );
}
