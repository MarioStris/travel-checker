import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCreateTrip } from "@/hooks/useTrips";
import { PlacesAutocomplete } from "@/components/PlacesAutocomplete";
import { CategoryPicker } from "@/components/CategoryPicker";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useThemeStore } from "@/lib/theme";
import type {
  TravelerCategory,
  PlaceDetails,
} from "@travel-checker/shared/src/types";

const TOTAL_STEPS = 7;

const SEASONS = [
  { value: "spring", label: "Spring", emoji: "\u{1F338}" },
  { value: "summer", label: "Summer", emoji: "\u2600\uFE0F" },
  { value: "autumn", label: "Autumn", emoji: "\u{1F342}" },
  { value: "winter", label: "Winter", emoji: "\u2744\uFE0F" },
] as const;

const ACCOMMODATION_TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel" },
  { value: "airbnb", label: "Airbnb" },
  { value: "camping", label: "Camping" },
  { value: "friends", label: "Friends" },
  { value: "other", label: "Other" },
] as const;

interface TripForm {
  destination: string;
  country: string;
  countryCode: string;
  city: string;
  latitude: number;
  longitude: number;
  title: string;
  startDate: string;
  endDate: string;
  season: string;
  travelerCategory: TravelerCategory;
  accommodationName: string;
  accommodationType: string;
  accommodationUrl: string;
  accommodationRating: number;
  budgetAccommodation: string;
  budgetFood: string;
  budgetTransport: string;
  budgetActivities: string;
  budgetOther: string;
  budgetCurrency: string;
  description: string;
  isPublic: boolean;
}

const INITIAL_FORM: TripForm = {
  destination: "",
  country: "",
  countryCode: "",
  city: "",
  latitude: 0,
  longitude: 0,
  title: "",
  startDate: "",
  endDate: "",
  season: "",
  travelerCategory: "solo",
  accommodationName: "",
  accommodationType: "hotel",
  accommodationUrl: "",
  accommodationRating: 0,
  budgetAccommodation: "",
  budgetFood: "",
  budgetTransport: "",
  budgetActivities: "",
  budgetOther: "",
  budgetCurrency: "EUR",
  description: "",
  isPublic: false,
};

export default function AddTripScreen() {
  const router = useRouter();
  const createTrip = useCreateTrip();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TripForm>(INITIAL_FORM);
  const [showConfirm, setShowConfirm] = useState(false);
  const { colors } = useThemeStore();

  const update = useCallback(
    (field: keyof TripForm, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handlePlaceSelect = (place: PlaceDetails) => {
    setForm((prev) => ({
      ...prev,
      destination: `${place.city || place.name}, ${place.country}`,
      country: place.country,
      countryCode: place.countryCode,
      city: place.city || place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      title: place.city || place.name,
    }));
  };

  const canGoNext = (): boolean => {
    switch (step) {
      case 1:
        return Boolean(form.destination && form.latitude);
      case 2:
        return Boolean(form.startDate);
      case 3:
        return Boolean(form.travelerCategory);
      default:
        return true;
    }
  };

  const handleConfirmSave = () => {
    const budget =
      form.budgetAccommodation || form.budgetFood || form.budgetTransport
        ? {
            currency: form.budgetCurrency,
            accommodation: Number(form.budgetAccommodation) || 0,
            food: Number(form.budgetFood) || 0,
            transport: Number(form.budgetTransport) || 0,
            activities: Number(form.budgetActivities) || 0,
            other: Number(form.budgetOther) || 0,
            isApproximate: false,
          }
        : undefined;

    const accommodation = form.accommodationName
      ? {
          name: form.accommodationName,
          type: form.accommodationType,
          url: form.accommodationUrl || undefined,
          rating: form.accommodationRating || undefined,
        }
      : undefined;

    createTrip.mutate(
      {
        title: form.title || form.destination,
        destination: form.destination,
        country: form.country,
        countryCode: form.countryCode,
        city: form.city,
        latitude: form.latitude,
        longitude: form.longitude,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        season: form.season || undefined,
        travelerCategory: form.travelerCategory,
        description: form.description || undefined,
        isPublic: form.isPublic,
        budget,
        accommodation,
      },
      {
        onSuccess: () => {
          setShowConfirm(false);
          router.back();
        },
        onError: (err) => {
          setShowConfirm(false);
          Alert.alert("Error", err.message);
        },
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.cardBorder,
        }}
      >
        <TouchableOpacity onPress={() => (step > 1 ? setStep(step - 1) : router.back())}>
          <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 15 }}>
            {step > 1 ? "Back" : "Cancel"}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>New Trip</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* Progress dots */}
      <View style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 12, gap: 6 }}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i < step ? colors.accent : colors.inputBorder,
            }}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ maxWidth: 560, width: "100%", alignSelf: "center", paddingHorizontal: 16 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && <StepWhere form={form} onPlaceSelect={handlePlaceSelect} update={update} />}
          {step === 2 && <StepWhen form={form} update={update} />}
          {step === 3 && <StepWho form={form} update={update} />}
          {step === 4 && <StepStay form={form} update={update} />}
          {step === 5 && <StepCost form={form} update={update} />}
          {step === 6 && <StepStory form={form} update={update} />}
          {step === 7 && <StepVisibility form={form} update={update} />}
          <View style={{ height: 96 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, backgroundColor: colors.background }}>
        {step < TOTAL_STEPS ? (
          <Button
            title={`Next (${step}/${TOTAL_STEPS})`}
            onPress={() => setStep(step + 1)}
            disabled={!canGoNext()}
            fullWidth
          />
        ) : (
          <Button
            title="Save Trip"
            onPress={() => setShowConfirm(true)}
            fullWidth
          />
        )}
      </View>

      {/* Confirm Save Modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <Pressable
          onPress={() => setShowConfirm(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.card,
              borderRadius: 24,
              padding: 32,
              width: "100%",
              maxWidth: 360,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.cardBorder,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 10,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.accentBg,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 36 }}>{"\u2708\uFE0F"}</Text>
            </View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: colors.text,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Save this trip?
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.textSecondary,
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              {form.title || form.destination}
            </Text>
            {form.startDate ? (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                {form.startDate}{form.endDate ? ` \u2014 ${form.endDate}` : ""}
              </Text>
            ) : (
              <View style={{ height: 24 }} />
            )}
            <Pressable
              onPress={handleConfirmSave}
              disabled={createTrip.isPending}
              style={{
                backgroundColor: createTrip.isPending ? colors.accentBorder : colors.buttonPrimary,
                width: "100%",
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                {createTrip.isPending ? "Saving..." : "Yes, Save Trip"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowConfirm(false)}
              disabled={createTrip.isPending}
              style={{
                width: "100%",
                paddingVertical: 12,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: "500" }}>
                Go Back
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- Step Components ---------- */

function StepWhere({
  form,
  onPlaceSelect,
  update,
}: {
  form: TripForm;
  onPlaceSelect: (p: PlaceDetails) => void;
  update: (k: keyof TripForm, v: string) => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
        Where did you go?
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Search for a city or destination
      </Text>
      <PlacesAutocomplete onSelectPlace={onPlaceSelect} />
      {form.destination ? (
        <View
          style={{
            marginTop: 16,
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.accentBorder,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
            {form.destination}
          </Text>
          <Input
            label="Trip title"
            value={form.title}
            onChangeText={(v) => update("title", v)}
            placeholder={form.destination}
            containerStyle={{ marginTop: 12 }}
          />
        </View>
      ) : null}
    </View>
  );
}

function StepWhen({
  form,
  update,
}: {
  form: TripForm;
  update: (k: keyof TripForm, v: string) => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
        When was it?
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Enter your travel dates
      </Text>
      <Input
        label="Start date"
        value={form.startDate}
        onChangeText={(v) => update("startDate", v)}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
      />
      <Input
        label="End date (optional)"
        value={form.endDate}
        onChangeText={(v) => update("endDate", v)}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
        containerStyle={{ marginTop: 12 }}
      />
      <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginTop: 16, marginBottom: 8 }}>
        Season
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {SEASONS.map((s) => {
          const selected = form.season === s.value;
          return (
            <TouchableOpacity
              key={s.value}
              onPress={() => update("season", selected ? "" : s.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selected ? colors.accent : colors.inputBorder,
                backgroundColor: selected ? colors.accentBg : colors.inputBg,
              }}
            >
              <Text style={{ fontSize: 14, color: selected ? colors.accent : colors.text }}>
                {s.emoji} {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function StepWho({
  form,
  update,
}: {
  form: TripForm;
  update: (k: keyof TripForm, v: string) => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
        Who traveled?
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        What kind of trip was this?
      </Text>
      <CategoryPicker
        value={form.travelerCategory}
        onChange={(v) => update("travelerCategory", v)}
      />
    </View>
  );
}

function StepStay({
  form,
  update,
}: {
  form: TripForm;
  update: (k: keyof TripForm, v: string) => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
        Where did you stay?
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Optional - add accommodation details
      </Text>
      <Input
        label="Accommodation name"
        value={form.accommodationName}
        onChangeText={(v) => update("accommodationName", v)}
        placeholder="e.g. Casa Central Airbnb"
      />
      <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginTop: 12, marginBottom: 8 }}>
        Type
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {ACCOMMODATION_TYPES.map((t) => {
          const selected = form.accommodationType === t.value;
          return (
            <TouchableOpacity
              key={t.value}
              onPress={() => update("accommodationType", t.value)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selected ? colors.accent : colors.inputBorder,
                backgroundColor: selected ? colors.accentBg : colors.inputBg,
              }}
            >
              <Text style={{ fontSize: 14, color: selected ? colors.accent : colors.text }}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Input
        label="Booking link (optional)"
        value={form.accommodationUrl}
        onChangeText={(v) => update("accommodationUrl", v)}
        placeholder="https://..."
        containerStyle={{ marginTop: 12 }}
        keyboardType="url"
      />
      <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginTop: 12, marginBottom: 8 }}>
        Rating
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = Number(form.accommodationRating) >= n;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => update("accommodationRating", String(n))}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: filled ? "#facc15" : colors.inputBorder,
                backgroundColor: filled ? "rgba(250,204,21,0.15)" : colors.inputBg,
              }}
            >
              <Text style={{ color: filled ? "#facc15" : colors.textMuted }}>
                {filled ? "\u2605" : "\u2606"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function StepCost({
  form,
  update,
}: {
  form: TripForm;
  update: (k: keyof TripForm, v: string) => void;
}) {
  const { colors } = useThemeStore();
  const total =
    (Number(form.budgetAccommodation) || 0) +
    (Number(form.budgetFood) || 0) +
    (Number(form.budgetTransport) || 0) +
    (Number(form.budgetActivities) || 0) +
    (Number(form.budgetOther) || 0);

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
        How much did it cost?
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Optional - track your spending
      </Text>

      <BudgetInput emoji={"\u{1F3E8}"} label="Accommodation" value={form.budgetAccommodation} onChange={(v) => update("budgetAccommodation", v)} />
      <BudgetInput emoji={"\u{1F37D}\uFE0F"} label="Food & Dining" value={form.budgetFood} onChange={(v) => update("budgetFood", v)} />
      <BudgetInput emoji={"\u{1F697}"} label="Transport" value={form.budgetTransport} onChange={(v) => update("budgetTransport", v)} />
      <BudgetInput emoji={"\u{1F3AF}"} label="Activities" value={form.budgetActivities} onChange={(v) => update("budgetActivities", v)} />
      <BudgetInput emoji={"\u{1F4E6}"} label="Other" value={form.budgetOther} onChange={(v) => update("budgetOther", v)} />

      <View
        style={{
          backgroundColor: colors.accentBg,
          borderRadius: 12,
          padding: 16,
          marginTop: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.accentBorder,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>Total</Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.accent }}>
          {form.budgetCurrency} {total.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

function BudgetInput({
  emoji,
  label,
  value,
  onChange,
}: {
  emoji: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.inputBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 18, marginRight: 8 }}>{emoji}</Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, flex: 1 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="0"
        placeholderTextColor={colors.textMuted}
        keyboardType="numeric"
        style={{ textAlign: "right", fontSize: 16, fontWeight: "600", color: colors.text, width: 96 }}
      />
    </View>
  );
}

function StepStory({
  form,
  update,
}: {
  form: TripForm;
  update: (k: keyof TripForm, v: string) => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
        Tell your story
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Write about your experience
      </Text>
      <TextInput
        value={form.description}
        onChangeText={(v) => update("description", v)}
        placeholder="What made this trip special? Share tips, highlights, and memories..."
        placeholderTextColor={colors.textMuted}
        multiline
        style={{
          backgroundColor: colors.inputBg,
          borderRadius: 12,
          padding: 16,
          color: colors.text,
          minHeight: 200,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          fontSize: 16,
          textAlignVertical: "top",
        }}
      />
      <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>
        You can add photos after saving the trip.
      </Text>
    </View>
  );
}

function StepVisibility({
  form,
  update,
}: {
  form: TripForm;
  update: (k: keyof TripForm, v: string | boolean) => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
        Almost done!
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Choose who can see this trip
      </Text>

      <TouchableOpacity
        onPress={() => update("isPublic", false)}
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          marginBottom: 12,
          borderColor: !form.isPublic ? colors.accent : colors.inputBorder,
          backgroundColor: !form.isPublic ? colors.accentBg : colors.inputBg,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>{"\u{1F512}"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>Private</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Only you can see this trip</Text>
          </View>
          {!form.isPublic && <Text style={{ color: colors.accent, fontSize: 18 }}>{"\u2713"}</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => update("isPublic", true)}
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: form.isPublic ? colors.accent : colors.inputBorder,
          backgroundColor: form.isPublic ? colors.accentBg : colors.inputBg,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>{"\u{1F30D}"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>Public</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              Other travelers can discover this trip
            </Text>
          </View>
          {form.isPublic && <Text style={{ color: colors.accent, fontSize: 18 }}>{"\u2713"}</Text>}
        </View>
      </TouchableOpacity>

      {/* Preview */}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          marginTop: 24,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
          Preview
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
          {form.title || form.destination}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>{form.destination}</Text>
        {form.startDate && (
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{form.startDate}</Text>
        )}
      </View>
    </View>
  );
}
