import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCurrentUser, useUserStats, useUpdateProfile } from "@/hooks/useUser";
import { useTrips } from "@/hooks/useTrips";
import { TripCard } from "@/components/TripCard";
import { StatsSkeleton } from "@/components/LoadingSkeleton";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatCurrency } from "@/lib/formatters";
import type { TravelerCategory } from "@travel-checker/shared/src/types";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: trips } = useTrips({ limit: 6 });
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");

  const handleEdit = () => {
    setEditBio(user?.bio ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile.mutate(
      { bio: editBio },
      {
        onSuccess: () => setIsEditing(false),
        onError: (err) => Alert.alert("Error", err.message),
      }
    );
  };

  if (userLoading || statsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatsSkeleton />
      </SafeAreaView>
    );
  }

  if (!user) return null;

  const category = getCategoryConfig(user.travelerCategory as TravelerCategory);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-4 pt-4 pb-6 items-center border-b border-gray-100">
          <TouchableOpacity onPress={handleEdit} className="absolute top-4 right-4">
            <Text className="text-sky-500 font-semibold">
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>

          {user.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-sky-100 items-center justify-center">
              <Text className="text-3xl">{category.emoji}</Text>
            </View>
          )}

          <Text className="text-xl font-bold text-gray-900 mt-3">
            {user.displayName}
          </Text>
          {user.username && (
            <Text className="text-sm text-gray-400">@{user.username}</Text>
          )}

          <View
            className="px-3 py-1 rounded-full mt-2"
            style={{ backgroundColor: category.bgColor }}
          >
            <Text className="text-xs font-medium" style={{ color: category.textColor }}>
              {category.emoji} {category.label}
            </Text>
          </View>

          {isEditing ? (
            <View className="w-full mt-3">
              <TextInput
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Tell us about yourself..."
                multiline
                maxLength={500}
                className="bg-gray-50 rounded-xl p-3 text-gray-700 min-h-[60px]"
              />
              <TouchableOpacity
                onPress={handleSave}
                disabled={updateProfile.isPending}
                className="bg-sky-500 rounded-xl py-2 mt-2"
              >
                <Text className="text-white font-semibold text-center">
                  {updateProfile.isPending ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : user.bio ? (
            <Text className="text-sm text-gray-500 mt-2 text-center px-8">
              {user.bio}
            </Text>
          ) : null}
        </View>

        {/* Stats */}
        {stats && (
          <View className="flex-row mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <StatItem label="Countries" value={String(stats.countries)} />
            <StatItem label="Trips" value={String(stats.trips)} />
            <StatItem
              label="Spent"
              value={formatCurrency(stats.totalBudget, "EUR", true)}
            />
            <StatItem label="Photos" value={String(stats.photos)} />
          </View>
        )}

        {/* My Trips */}
        <View className="px-4 mt-6 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-gray-900">My Trips</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)")}>
              <Text className="text-sky-500 text-sm font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          {trips?.map((trip) => <TripCard key={trip.id} trip={trip} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center py-3 border-r border-gray-100 last:border-r-0">
      <Text className="text-lg font-bold text-gray-900">{value}</Text>
      <Text className="text-xs text-gray-500">{label}</Text>
    </View>
  );
}
