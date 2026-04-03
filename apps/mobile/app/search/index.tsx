import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSearchUsers } from "@/hooks/useSocial";
import { useThemeStore } from "@/lib/theme";
import type { UserSearchResult } from "@/types/social";

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useSearchUsers(
    searchQuery || query,
    page
  );

  const handleSearch = useCallback(() => {
    setSearchQuery(query);
    setPage(1);
  }, [query]);

  const handleLoadMore = useCallback(() => {
    if (data && data.users.length < data.total) {
      setPage((p) => p + 1);
    }
  }, [data]);

  const renderUser = useCallback(
    ({ item }: { item: UserSearchResult }) => (
      <Pressable
        onPress={() => router.push(`/user/${item.id}`)}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          padding: 14,
          marginHorizontal: 16,
          marginBottom: 8,
          backgroundColor: colors.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        {item.avatarUrl ? (
          <Image
            source={{ uri: item.avatarUrl }}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.accentBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person" size={22} color={colors.accent} />
          </View>
        )}

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{ fontSize: 16, fontWeight: "600", color: colors.text }}
            numberOfLines={1}
          >
            {item.displayName}
          </Text>
          {item.username && (
            <Text
              style={{ fontSize: 13, color: colors.textMuted, marginTop: 1 }}
            >
              @{item.username}
            </Text>
          )}
          <Text
            style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}
          >
            {item.tripsCount} trips · {item.countriesCount} countries
          </Text>
        </View>

        {item.friendStatus === "accepted" && (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: colors.accentBg,
            }}
          >
            <Text style={{ fontSize: 11, color: colors.accent, fontWeight: "600" }}>
              Friend
            </Text>
          </View>
        )}
        {item.friendStatus === "pending_sent" && (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: colors.inputBg,
            }}
          >
            <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: "500" }}>
              Pending
            </Text>
          </View>
        )}

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textMuted}
          style={{ marginLeft: 8 }}
        />
      </Pressable>
    ),
    [colors, router]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
          Find Friends
        </Text>
      </View>

      {/* Search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          marginBottom: 12,
          gap: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 14,
            paddingHorizontal: 12,
            height: 44,
          }}
        >
          <Ionicons
            name="search"
            size={18}
            color={colors.textMuted}
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or username..."
            placeholderTextColor={colors.textMuted}
            style={{ flex: 1, fontSize: 15, color: colors.text }}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => { setQuery(""); setSearchQuery(""); }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={handleSearch}
          style={{
            backgroundColor: colors.buttonPrimary,
            height: 44,
            paddingHorizontal: 16,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.buttonPrimaryText, fontWeight: "600", fontSize: 15 }}>
            Search
          </Text>
        </Pressable>
      </View>

      {/* Results */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={data?.users ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginTop: 12,
                  textAlign: "center",
                  paddingHorizontal: 40,
                }}
              >
                {query.length > 0
                  ? "No users found. Try a different search."
                  : "Start typing to search for travelers."}
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetching && data ? (
              <ActivityIndicator
                size="small"
                color={colors.accent}
                style={{ paddingVertical: 16 }}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
