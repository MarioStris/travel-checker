import React from "react";
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { del } from "@/api/client";

interface MenuItemProps {
  emoji: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ emoji, label, onPress, destructive }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3.5 bg-white border-b border-gray-100"
    >
      <Text className="text-lg mr-3">{emoji}</Text>
      <Text
        className={`text-base ${destructive ? "text-red-500" : "text-gray-900"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: () => void signOut(),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await del("/api/users/me");
              await signOut();
            } catch (err) {
              Alert.alert("Error", "Failed to delete account");
            }
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Linking.openURL(
      "https://apps.apple.com/app/travel-checker/id0000000000"
    ).catch(() => {});
  };

  const handleShareApp = async () => {
    const { Share } = await import("react-native");
    Share.share({
      message:
        "Check out Travel Checker - track your travels and build your world map! https://travelchecker.app",
    }).catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xl font-bold text-gray-900">More</Text>
        </View>

        {/* Settings */}
        <View className="mt-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase px-4 mb-1">
            Settings
          </Text>
          <MenuItem emoji="👤" label="Account Settings" onPress={() => {}} />
          <MenuItem emoji="🔒" label="Privacy" onPress={() => {}} />
          <MenuItem emoji="📊" label="Data & Storage" onPress={() => {}} />
        </View>

        {/* Support */}
        <View className="mt-6">
          <Text className="text-xs font-semibold text-gray-400 uppercase px-4 mb-1">
            Support
          </Text>
          <MenuItem emoji="❓" label="Help & FAQ" onPress={() => {}} />
          <MenuItem emoji="⭐" label="Rate Travel Checker" onPress={handleRateApp} />
          <MenuItem emoji="📤" label="Tell a Friend" onPress={handleShareApp} />
        </View>

        {/* Account */}
        <View className="mt-6">
          <Text className="text-xs font-semibold text-gray-400 uppercase px-4 mb-1">
            Account
          </Text>
          <MenuItem emoji="🚪" label="Sign Out" onPress={handleSignOut} />
          <MenuItem
            emoji="🗑️"
            label="Delete Account"
            onPress={handleDeleteAccount}
            destructive
          />
        </View>

        <Text className="text-xs text-gray-400 text-center mt-6 mb-4">
          Travel Checker v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
