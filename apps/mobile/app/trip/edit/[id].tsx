import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTripDetail, useUpdateTrip } from "@/hooks/useTrips";
import { CategoryPicker } from "@/components/CategoryPicker";
import { VisibilityPicker } from "@/components/VisibilityPicker";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useThemeStore } from "@/lib/theme";
import type { TravelerCategory } from "@travel-checker/shared/src/types";
import type { TripVisibility } from "@/types/social";

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: trip, isLoading } = useTripDetail(id);
  const updateTrip = useUpdateTrip();
  const { colors } = useThemeStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TravelerCategory>("solo");
  const [visibility, setVisibility] = useState<TripVisibility>("private");

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDescription(trip.description ?? "");
      setCategory(trip.travelerCategory as TravelerCategory);
      setVisibility(
        trip.isPublic ? "public" : "private"
      );
    }
  }, [trip]);

  const handleSave = () => {
    updateTrip.mutate(
      {
        id,
        input: {
          title,
          description,
          travelerCategory: category,
          isPublic: visibility === "public",
          // @ts-ignore - visibility field for backend
          visibility,
        },
      },
      {
        onSuccess: () => router.back(),
        onError: (err) => Alert.alert("Error", err.message),
      }
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.cardBorder,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 15 }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>Edit Trip</Text>
        <TouchableOpacity onPress={handleSave} disabled={updateTrip.isPending}>
          <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 15 }}>
            {updateTrip.isPending ? "..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          maxWidth: 560,
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Trip title"
          maxLength={200}
        />

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginBottom: 6 }}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell your travel story..."
            placeholderTextColor={colors.textMuted}
            multiline
            style={{
              backgroundColor: colors.inputBg,
              borderRadius: 12,
              padding: 12,
              color: colors.text,
              minHeight: 120,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              fontSize: 16,
              textAlignVertical: "top",
            }}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginBottom: 8 }}>
            Traveler Category
          </Text>
          <CategoryPicker value={category} onChange={setCategory} />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginBottom: 8 }}>
            Who can see this trip?
          </Text>
          <VisibilityPicker value={visibility} onChange={setVisibility} />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
