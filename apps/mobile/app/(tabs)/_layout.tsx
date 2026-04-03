import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/lib/theme";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IoniconsName;
  focusedName: IoniconsName;
  focused: boolean;
  color: string;
}

function TabIcon({ name, focusedName, focused, color }: TabIconProps) {
  return (
    <View style={{ alignItems: "center", paddingTop: 4 }}>
      <Ionicons name={focused ? focusedName : name} size={24} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { colors } = useThemeStore();

  useEffect(() => {
    if (!isLoaded) return;
    SplashScreen.hideAsync();
    if (!isSignedIn) {
      router.replace("/(auth)/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          borderTopWidth: 0,
          backgroundColor: colors.tabBar,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.tabBarBorder,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="newspaper-outline" focusedName="newspaper" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: "Feed tab",
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Maps",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="map-outline" focusedName="map" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: "Maps tab",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Trips",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="airplane-outline" focusedName="airplane" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: "My Trips tab",
        }}
      />
      {/* Hidden screens — still exist as routes but not shown as tabs */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="more" options={{ href: null }} />
      <Tabs.Screen name="add" options={{ href: null }} />
    </Tabs>
  );
}
