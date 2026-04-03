import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useCurrentUser, useUserStats, useUpdateProfile, useUploadAvatar } from "@/hooks/useUser";
import { useTrips } from "@/hooks/useTrips";
import { TripCard } from "@/components/TripCard";
import { StatsSkeleton } from "@/components/LoadingSkeleton";
import { getCategoryConfig, ALL_CATEGORIES, CATEGORY_CONFIG } from "@/lib/categoryConfig";
import { formatCurrency } from "@/lib/formatters";
import { ContentContainer } from "@/components/ContentContainer";
import { useThemeStore, THEME_OPTIONS, type ThemeKey } from "@/lib/theme";
import type { TravelerCategory } from "@travel-checker/shared/src/types";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: trips } = useTrips({ limit: 6 });
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const { colors, themeKey, setTheme } = useThemeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCategory, setEditCategory] = useState<TravelerCategory | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleEdit = () => {
    setEditDisplayName(user?.displayName ?? "");
    setEditUsername(user?.username ?? "");
    setEditBio(user?.bio ?? "");
    setEditCategory((user?.travelerCategory as TravelerCategory) ?? null);
    setAvatarPreview(null);
    setIsEditing(true);
  };

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo library access to change your avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarPreview(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const errors: string[] = [];

    if (avatarPreview) {
      try {
        await uploadAvatar.mutateAsync(avatarPreview);
      } catch (err) {
        console.warn("Avatar upload failed:", err);
        errors.push("Avatar upload failed — try again later");
      }
    }

    try {
      const payload: Record<string, string> = {};
      const trimmedName = editDisplayName.trim();
      const trimmedUsername = editUsername.trim();
      const trimmedBio = editBio.trim();

      if (trimmedName) payload.displayName = trimmedName;
      if (trimmedUsername) payload.username = trimmedUsername;
      payload.bio = trimmedBio;
      if (editCategory) payload.travelerCategory = editCategory;

      await updateProfile.mutateAsync(payload);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Profile update failed";
      errors.push(msg);
    }

    if (errors.length > 0) {
      Alert.alert("Warning", errors.join("\n"));
    }

    setIsEditing(false);
    setAvatarPreview(null);
  };

  const handleThemeChange = (key: ThemeKey) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTheme(key);
  };

  const isSaving = updateProfile.isPending || uploadAvatar.isPending;

  if (userLoading || statsLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LinearGradient
          colors={[colors.gradientTop, colors.gradientMid, colors.gradientBottom]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <StatsSkeleton />
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  if (!user) return null;

  const category = getCategoryConfig(user.travelerCategory as TravelerCategory);
  const currentAvatarUri = avatarPreview ?? user.avatarUrl;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientMid, colors.gradientBottom]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header card */}
            <ContentContainer style={{
              backgroundColor: colors.card,
              borderBottomWidth: 1,
              borderBottomColor: colors.cardBorder,
              paddingTop: 16,
              paddingBottom: 24,
              alignItems: "center",
            }}>
              {/* Edit/Close button */}
              <Pressable
                onPress={isEditing ? () => { setIsEditing(false); setAvatarPreview(null); } : handleEdit}
                accessibilityLabel={isEditing ? "Cancel editing" : "Edit profile"}
                accessibilityRole="button"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  minWidth: 44,
                  minHeight: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={isEditing ? "close" : "create-outline"}
                  size={22}
                  color={colors.accent}
                />
              </Pressable>

              {/* Avatar */}
              <Pressable
                onPress={isEditing ? handlePickAvatar : undefined}
                disabled={!isEditing}
                style={{ position: "relative" }}
              >
                {currentAvatarUri ? (
                  <Image
                    source={{ uri: currentAvatarUri }}
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 48,
                      borderWidth: 3,
                      borderColor: colors.cardBorder,
                    }}
                  />
                ) : (
                  <View style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    backgroundColor: colors.skeleton,
                    borderWidth: 3,
                    borderColor: colors.cardBorder,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Ionicons name="person" size={44} color={colors.textSecondary} />
                  </View>
                )}

                {isEditing && (
                  <View style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.accentBg,
                    borderWidth: 1,
                    borderColor: colors.accentBorder,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Ionicons name="camera" size={16} color={colors.accent} />
                  </View>
                )}
              </Pressable>

              {isEditing ? (
                /* Edit form */
                <View style={{ width: "100%", marginTop: 16, gap: 12 }}>
                  {/* Display Name */}
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textMuted, marginBottom: 6, marginLeft: 4 }}>
                      DISPLAY NAME
                    </Text>
                    <TextInput
                      value={editDisplayName}
                      onChangeText={setEditDisplayName}
                      placeholder="Your display name"
                      placeholderTextColor={colors.textMuted}
                      maxLength={100}
                      style={{
                        backgroundColor: colors.inputBg,
                        borderWidth: 1,
                        borderColor: colors.inputBorder,
                        borderRadius: 14,
                        paddingHorizontal: 16,
                        height: 48,
                        fontSize: 16,
                        color: colors.text,
                      }}
                      accessibilityLabel="Display name input"
                    />
                  </View>

                  {/* Username */}
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textMuted, marginBottom: 6, marginLeft: 4 }}>
                      USERNAME
                    </Text>
                    <View style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.inputBg,
                      borderWidth: 1,
                      borderColor: colors.inputBorder,
                      borderRadius: 14,
                      paddingLeft: 16,
                      height: 48,
                    }}>
                      <Text style={{ fontSize: 16, color: colors.textMuted }}>@</Text>
                      <TextInput
                        value={editUsername}
                        onChangeText={(t) => setEditUsername(t.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        placeholder="username"
                        placeholderTextColor={colors.textMuted}
                        autoCapitalize="none"
                        maxLength={50}
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: colors.text,
                          paddingHorizontal: 4,
                          height: 48,
                        }}
                        accessibilityLabel="Username input"
                      />
                    </View>
                  </View>

                  {/* Bio */}
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textMuted, marginBottom: 6, marginLeft: 4 }}>
                      BIO
                    </Text>
                    <TextInput
                      value={editBio}
                      onChangeText={setEditBio}
                      placeholder="Tell us about yourself..."
                      placeholderTextColor={colors.textMuted}
                      multiline
                      maxLength={500}
                      style={{
                        backgroundColor: colors.inputBg,
                        borderWidth: 1,
                        borderColor: colors.inputBorder,
                        borderRadius: 14,
                        paddingHorizontal: 16,
                        paddingTop: 14,
                        paddingBottom: 14,
                        minHeight: 80,
                        fontSize: 16,
                        color: colors.text,
                        textAlignVertical: "top",
                      }}
                      accessibilityLabel="Bio text input"
                    />
                    <Text style={{ fontSize: 11, color: colors.textMuted, textAlign: "right", marginTop: 4 }}>
                      {editBio.length}/500
                    </Text>
                  </View>

                  {/* Traveler Category */}
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textMuted, marginBottom: 6, marginLeft: 4 }}>
                      TRAVELER CATEGORY
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                      {ALL_CATEGORIES.map((cat) => {
                        const cfg = CATEGORY_CONFIG[cat];
                        const selected = editCategory === cat;
                        return (
                          <Pressable
                            key={cat}
                            onPress={() => {
                              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setEditCategory(cat);
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={cfg.label}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 12,
                              gap: 6,
                              backgroundColor: selected ? colors.accentBg : colors.inputBg,
                              borderWidth: 1.5,
                              borderColor: selected ? colors.accent : colors.inputBorder,
                            }}
                          >
                            <Ionicons name={cfg.icon} size={16} color={selected ? colors.accent : colors.textSecondary} />
                            <Text style={{
                              fontSize: 13,
                              fontWeight: selected ? "700" : "500",
                              color: selected ? colors.accent : colors.textSecondary,
                            }}>
                              {cfg.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {/* Theme Picker */}
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textMuted, marginBottom: 6, marginLeft: 4 }}>
                      APP THEME
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      {THEME_OPTIONS.map((opt) => {
                        const selected = themeKey === opt.key;
                        return (
                          <Pressable
                            key={opt.key}
                            onPress={() => handleThemeChange(opt.key)}
                            accessibilityRole="button"
                            accessibilityLabel={`${opt.label} theme`}
                            style={{
                              flex: 1,
                              alignItems: "center",
                              paddingVertical: 14,
                              borderRadius: 14,
                              backgroundColor: selected ? colors.accentBg : colors.inputBg,
                              borderWidth: 2,
                              borderColor: selected ? colors.accent : colors.inputBorder,
                              gap: 8,
                            }}
                          >
                            <View style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              backgroundColor: opt.preview,
                              borderWidth: 2,
                              borderColor: selected ? colors.accent : colors.cardBorder,
                            }} />
                            <Text style={{
                              fontSize: 13,
                              fontWeight: selected ? "700" : "500",
                              color: selected ? colors.accent : colors.textSecondary,
                            }}>
                              {opt.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {/* Save button */}
                  <Pressable
                    onPress={() => void handleSave()}
                    disabled={isSaving}
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      backgroundColor: isSaving
                        ? colors.accentBg
                        : pressed
                          ? colors.accentBorder
                          : colors.accentBg,
                      borderWidth: 1,
                      borderColor: colors.accentBorder,
                      borderRadius: 14,
                      paddingVertical: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 52,
                      opacity: isSaving ? 0.6 : 1,
                    })}
                  >
                    {isSaving ? (
                      <ActivityIndicator color={colors.accent} />
                    ) : (
                      <Text style={{ color: colors.accent, fontSize: 16, fontWeight: "700" }}>
                        Save Changes
                      </Text>
                    )}
                  </Pressable>
                </View>
              ) : (
                /* Display mode */
                <>
                  <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 12 }}>
                    {user.displayName}
                  </Text>
                  {user.username && (
                    <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 2 }}>
                      @{user.username}
                    </Text>
                  )}

                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginTop: 10,
                    gap: 4,
                    backgroundColor: colors.skeleton,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}>
                    <Ionicons name="compass-outline" size={14} color={category.color} />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: category.color }}>
                      {category.label}
                    </Text>
                  </View>

                  {user.bio ? (
                    <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 10, textAlign: "center", paddingHorizontal: 32 }}>
                      {user.bio}
                    </Text>
                  ) : null}
                </>
              )}
            </ContentContainer>

            {/* Stats */}
            {stats && !isEditing && (
              <ContentContainer style={{ marginTop: 16 }}>
                <View style={{
                  flexDirection: "row",
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  overflow: "hidden",
                }}>
                  <StatItem label="Countries" value={String(stats.countries)} />
                  <StatItem label="Trips" value={String(stats.trips)} />
                  <StatItem
                    label="Spent"
                    value={formatCurrency(stats.totalBudget, "EUR", true)}
                  />
                  <StatItem label="Photos" value={String(stats.photos)} />
                </View>
              </ContentContainer>
            )}

            {/* My Trips */}
            {!isEditing && (
              <ContentContainer style={{ marginTop: 24, marginBottom: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>My Trips</Text>
                  <Pressable
                    onPress={() => router.push("/(tabs)")}
                    accessibilityLabel="See all trips"
                    accessibilityRole="button"
                    style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 4 }}
                  >
                    <Text style={{ color: colors.accent, fontSize: 14, fontWeight: "600" }}>See All</Text>
                  </Pressable>
                </View>

                {trips?.map((trip) => <TripCard key={trip.id} trip={trip} />)}
              </ContentContainer>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  const { colors } = useThemeStore();

  return (
    <View style={{
      flex: 1,
      alignItems: "center",
      paddingVertical: 14,
      borderRightWidth: 1,
      borderRightColor: colors.cardBorder,
    }}>
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>{value}</Text>
      <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}
