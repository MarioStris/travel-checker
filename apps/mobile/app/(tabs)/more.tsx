import React, { useState } from "react";
import { View, Text, Pressable, Linking, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { del } from "@/api/client";
import { ContentContainer } from "@/components/ContentContainer";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface MenuItemProps {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ icon, label, onPress, destructive }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: pressed ? "#f3f4f6" : "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
        minHeight: 48,
      })}
    >
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: destructive ? "#fef2f2" : "#f0f9ff",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
      }}>
        <Ionicons name={icon} size={18} color={destructive ? "#ef4444" : "#0284c7"} />
      </View>
      <Text style={{
        fontSize: 16,
        color: destructive ? "#ef4444" : "#111827",
        flex: 1,
      }}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
    </Pressable>
  );
}

export default function MoreScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [showSignOut, setShowSignOut] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmSignOut = async () => {
    setShowSignOut(false);
    await signOut();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await del("/api/users/me");
      setShowDelete(false);
      await signOut();
    } catch {
      setIsDeleting(false);
    }
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
        <ContentContainer style={{ paddingTop: 16, paddingBottom: 12 }}>
          <Text className="text-xl font-bold text-gray-900">More</Text>
        </ContentContainer>

        {/* Settings */}
        <ContentContainer noPadding style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", paddingHorizontal: 16, marginBottom: 4 }}>
            Settings
          </Text>
          <MenuItem icon="person-outline" label="Account Settings" onPress={() => {}} />
          <MenuItem icon="lock-closed-outline" label="Privacy" onPress={() => {}} />
          <MenuItem icon="bar-chart-outline" label="Data & Storage" onPress={() => {}} />
        </ContentContainer>

        {/* Support */}
        <ContentContainer noPadding style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", paddingHorizontal: 16, marginBottom: 4 }}>
            Support
          </Text>
          <MenuItem icon="help-circle-outline" label="Help & FAQ" onPress={() => {}} />
          <MenuItem icon="star-outline" label="Rate Travel Checker" onPress={handleRateApp} />
          <MenuItem icon="share-outline" label="Tell a Friend" onPress={handleShareApp} />
        </ContentContainer>

        {/* Account */}
        <ContentContainer noPadding style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", paddingHorizontal: 16, marginBottom: 4 }}>
            Account
          </Text>
          <MenuItem icon="log-out-outline" label="Sign Out" onPress={() => setShowSignOut(true)} />
          <MenuItem icon="trash-outline" label="Delete Account" onPress={() => setShowDelete(true)} destructive />
        </ContentContainer>

        <ContentContainer style={{ marginTop: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
            Travel Checker v1.0.0
          </Text>
        </ContentContainer>
      </ScrollView>

      {/* Sign Out Modal */}
      <Modal visible={showSignOut} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "85%", maxWidth: 340, alignItems: "center" }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#f0f9ff", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Ionicons name="log-out-outline" size={28} color="#0284c7" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 8 }}>Sign Out</Text>
            <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
              Are you sure you want to sign out?
            </Text>
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <Pressable
                onPress={() => setShowSignOut(false)}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center",
                  backgroundColor: pressed ? "#e5e7eb" : "#f3f4f6",
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#374151" }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleConfirmSignOut()}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center",
                  backgroundColor: pressed ? "#0369a1" : "#0284c7",
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#fff" }}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal visible={showDelete} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "85%", maxWidth: 340, alignItems: "center" }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#fef2f2", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Ionicons name="warning-outline" size={28} color="#ef4444" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 8 }}>Delete Account</Text>
            <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
              This will permanently delete your account and all data. This cannot be undone.
            </Text>
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <Pressable
                onPress={() => setShowDelete(false)}
                disabled={isDeleting}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center",
                  backgroundColor: pressed ? "#e5e7eb" : "#f3f4f6",
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#374151" }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleConfirmDelete()}
                disabled={isDeleting}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center",
                  backgroundColor: pressed ? "#b91c1c" : "#ef4444",
                  opacity: isDeleting ? 0.6 : 1,
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#fff" }}>
                  {isDeleting ? "..." : "Delete"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
