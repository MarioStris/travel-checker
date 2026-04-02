import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTripDetail, useUpdateTrip } from "@/hooks/useTrips";
import { CategoryPicker } from "@/components/CategoryPicker";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import type { TravelerCategory } from "@travel-checker/shared/src/types";

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: trip, isLoading } = useTripDetail(id);
  const updateTrip = useUpdateTrip();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TravelerCategory>("solo");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDescription(trip.description ?? "");
      setCategory(trip.travelerCategory as TravelerCategory);
      setIsPublic(trip.isPublic);
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
          isPublic,
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
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-sky-500 font-semibold">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-base font-bold text-gray-900">Edit Trip</Text>
        <TouchableOpacity onPress={handleSave} disabled={updateTrip.isPending}>
          <Text className="text-sky-500 font-semibold">
            {updateTrip.isPending ? "..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Trip title"
          maxLength={200}
        />

        <View className="mt-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell your travel story..."
            multiline
            className="bg-white rounded-xl p-3 text-gray-700 min-h-[120px] border border-gray-200"
            textAlignVertical="top"
          />
        </View>

        <View className="mt-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Traveler Category</Text>
          <CategoryPicker selected={category} onSelect={setCategory} />
        </View>

        <View className="mt-4 flex-row items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
          <Text className="text-sm text-gray-700">Public trip</Text>
          <TouchableOpacity
            onPress={() => setIsPublic(!isPublic)}
            className={`w-12 h-7 rounded-full ${isPublic ? "bg-sky-500" : "bg-gray-300"} justify-center`}
          >
            <View
              className={`w-5 h-5 bg-white rounded-full shadow ${isPublic ? "ml-6" : "ml-1"}`}
            />
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
