import { View, Pressable, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { useReactions, useToggleReaction } from "@/hooks/useReactions";
import { useThemeStore } from "@/lib/theme";
import { REACTION_EMOJIS, type ReactionSummary } from "@/types/social";

export function TripReactions({ tripId }: { tripId: string }) {
  const { colors } = useThemeStore();
  const { data: reactions } = useReactions(tripId);
  const toggleReaction = useToggleReaction(tripId);

  const summaryMap = new Map<string, ReactionSummary>(
    (reactions ?? []).map((r) => [r.emoji, r])
  );

  function handlePress(emoji: (typeof REACTION_EMOJIS)[number]) {
    const current = summaryMap.get(emoji);
    const reacted = current?.reacted ?? false;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleReaction.mutate({ emoji, reacted });
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {REACTION_EMOJIS.map((emoji) => {
        const summary = summaryMap.get(emoji);
        const reacted = summary?.reacted ?? false;
        const count = summary?.count ?? 0;

        return (
          <Pressable
            key={emoji}
            onPress={() => handlePress(emoji)}
            accessibilityRole="button"
            accessibilityLabel={`React with ${emoji}${count > 0 ? `, ${count} reaction${count !== 1 ? "s" : ""}` : ""}`}
            accessibilityState={{ selected: reacted }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              borderWidth: 1,
              backgroundColor: reacted ? colors.accentBg : colors.inputBg,
              borderColor: reacted ? colors.accentBorder : colors.inputBorder,
            }}
          >
            <Text style={{ fontSize: 16 }}>{emoji}</Text>
            {count > 0 && (
              <Text style={{ fontSize: 12, color: colors.text }}>{count}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
