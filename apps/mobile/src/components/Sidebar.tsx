import React, { useState } from "react";
import { View, Text, Image, Pressable, Modal, ScrollView, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useCurrentUser } from "@/hooks/useUser";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { del } from "@/api/client";
import { useThemeStore } from "@/lib/theme";
import type { TravelerCategory } from "@travel-checker/shared/src/types";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ icon, label, onPress, destructive }: MenuItemProps) {
  const { colors } = useThemeStore();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: pressed ? (destructive ? "rgba(239,68,68,0.1)" : colors.accentBg) : "transparent",
        gap: 14,
        minHeight: 48,
      })}
    >
      <Ionicons name={icon} size={20} color={destructive ? "#ef4444" : colors.text} />
      <Text style={{ fontSize: 15, color: destructive ? "#ef4444" : colors.text, flex: 1 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Sidebar({ visible, onClose }: SidebarProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { colors } = useThemeStore();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const category = user?.travelerCategory
    ? getCategoryConfig(user.travelerCategory as TravelerCategory)
    : null;

  const handleSignOut = async () => {
    setShowSignOutConfirm(false);
    onClose();
    await signOut();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await del("/api/users/me");
      setShowDeleteConfirm(false);
      onClose();
      await signOut();
    } catch {
      setIsDeleting(false);
    }
  };

  const handleEditProfile = () => {
    onClose();
    router.push("/(tabs)/profile");
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        {/* Spacer pushes sidebar right */}
        <View style={{ flex: 1 }} />

        {/* Sidebar panel */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: SIDEBAR_WIDTH,
            backgroundColor: colors.background,
            height: "100%",
          }}
        >
          <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
            {/* Profile header */}
            <View style={{
              paddingTop: 60,
              paddingBottom: 24,
              paddingHorizontal: 20,
              backgroundColor: colors.card,
              borderBottomWidth: 1,
              borderBottomColor: colors.cardBorder,
            }}>
              {/* Close button */}
              <Pressable
                onPress={onClose}
                accessibilityLabel="Close menu"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.skeleton,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>

              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: colors.accentBorder }}
                />
              ) : (
                <View style={{
                  width: 64, height: 64, borderRadius: 32,
                  backgroundColor: colors.accentBg,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Ionicons name="person" size={28} color={colors.accent} />
                </View>
              )}

              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text, marginTop: 12 }}>
                {user?.displayName ?? "Traveler"}
              </Text>
              {user?.username && (
                <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>@{user.username}</Text>
              )}
              {category && (
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.accentBg,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginTop: 10,
                  alignSelf: "flex-start",
                  gap: 4,
                }}>
                  <Ionicons name={category.icon} size={14} color={category.color} />
                  <Text style={{ fontSize: 12, fontWeight: "600", color: category.color }}>
                    {category.label}
                  </Text>
                </View>
              )}
            </View>

            {/* Menu items */}
            <View style={{ paddingTop: 8 }}>
              <MenuItem icon="person-outline" label="Edit Profile" onPress={handleEditProfile} />
              <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
              <MenuItem icon="lock-closed-outline" label="Privacy" onPress={() => {}} />
              <MenuItem icon="help-circle-outline" label="Help & FAQ" onPress={() => {}} />
            </View>

            <View style={{ height: 1, backgroundColor: colors.cardBorder, marginVertical: 8, marginHorizontal: 20 }} />

            <View>
              <MenuItem icon="log-out-outline" label="Sign Out" onPress={() => setShowSignOutConfirm(true)} />
              <MenuItem icon="trash-outline" label="Delete Account" onPress={() => setShowDeleteConfirm(true)} destructive />
            </View>

            {/* Version */}
            <View style={{ flex: 1 }} />
            <Text style={{ fontSize: 11, color: colors.textMuted, textAlign: "center", paddingBottom: 32, paddingTop: 16 }}>
              Travel Checker v1.0.0
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>

      {/* Sign Out Confirm */}
      {showSignOutConfirm && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: colors.background, borderRadius: 20, padding: 24, width: "85%", maxWidth: 340, alignItems: "center", borderWidth: 1, borderColor: colors.cardBorder }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accentBg, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Ionicons name="log-out-outline" size={28} color={colors.accent} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 8 }}>Sign Out</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center", marginBottom: 24 }}>Are you sure you want to sign out?</Text>
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <Pressable
                onPress={() => setShowSignOutConfirm(false)}
                style={({ pressed }) => ({ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: pressed ? colors.inputBorder : colors.inputBg })}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleSignOut()}
                style={({ pressed }) => ({ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: pressed ? "#0369a1" : "#0284c7" })}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#fff" }}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: colors.background, borderRadius: 20, padding: 24, width: "85%", maxWidth: 340, alignItems: "center", borderWidth: 1, borderColor: colors.cardBorder }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(239,68,68,0.1)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Ionicons name="warning-outline" size={28} color="#ef4444" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 8 }}>Delete Account</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center", marginBottom: 24 }}>This will permanently delete your account and all data.</Text>
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <Pressable
                onPress={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                style={({ pressed }) => ({ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: pressed ? colors.inputBorder : colors.inputBg })}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleDelete()}
                disabled={isDeleting}
                style={({ pressed }) => ({ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: pressed ? "#b91c1c" : "#ef4444", opacity: isDeleting ? 0.6 : 1 })}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#fff" }}>{isDeleting ? "..." : "Delete"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}
