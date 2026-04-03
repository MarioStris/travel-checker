import { useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useComments, useAddComment } from "@/hooks/useReactions";
import { useThemeStore } from "@/lib/theme";
import { useCurrentUser } from "@/hooks/useUser";
import type { CommentDTO } from "@/types/social";

dayjs.extend(relativeTime);

export function TripComments({ tripId }: { tripId: string }) {
  const { colors } = useThemeStore();
  const [text, setText] = useState("");

  const { data } = useComments(tripId);
  const addComment = useAddComment(tripId);
  const { data: currentUser } = useCurrentUser();

  const comments: CommentDTO[] = data?.comments ?? [];

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment.mutate(trimmed);
    setText("");
  }

  return (
    <View>
      {/* Section header */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        }}
      >
        Comments{comments.length > 0 ? ` (${comments.length})` : ""}
      </Text>

      {/* Comment list */}
      {comments.length === 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: 12 }}>
          No comments yet
        </Text>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} colors={colors} />
        ))
      )}

      {/* Input bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 4,
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textMuted}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 20,
            paddingHorizontal: 16,
            backgroundColor: colors.inputBg,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            color: colors.text,
            fontSize: 14,
          }}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleSend}
          disabled={text.trim().length === 0 || addComment.isPending}
          accessibilityLabel="Send comment"
          accessibilityRole="button"
          style={{ opacity: text.trim().length === 0 ? 0.4 : 1 }}
        >
          <Ionicons name="send" size={22} color={colors.accent} />
        </Pressable>
      </View>
    </View>
  );
}

/* ---------- CommentItem ---------- */

interface CommentItemProps {
  comment: CommentDTO;
  colors: ReturnType<typeof useThemeStore>["colors"];
}

function CommentItem({ comment, colors }: CommentItemProps) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 12 }}>
      {comment.user.avatarUrl ? (
        <Image
          source={{ uri: comment.user.avatarUrl }}
          style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
          accessibilityLabel={`${comment.user.displayName} avatar`}
        />
      ) : (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: 8,
            backgroundColor: colors.accentBg,
            alignItems: "center",
            justifyContent: "center",
          }}
          accessible
          accessibilityLabel={`${comment.user.displayName} avatar`}
        >
          <Text style={{ color: colors.accent, fontSize: 13, fontWeight: "600" }}>
            {comment.user.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <Text style={{ fontWeight: "700", color: colors.text, fontSize: 13 }}>
            {comment.user.displayName}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>
            {dayjs(comment.createdAt).fromNow()}
          </Text>
        </View>
        <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
          {comment.text}
        </Text>
      </View>
    </View>
  );
}
