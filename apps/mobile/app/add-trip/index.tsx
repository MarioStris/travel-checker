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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCreateTrip } from "@/hooks/useTrips";
import { PlacesAutocomplete } from "@/components/PlacesAutocomplete";
import { CategoryPicker } from "@/components/CategoryPicker";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type {
  TravelerCategory,
  PlaceDetails,
} from "@travel-checker/shared/src/types";

const TOTAL_STEPS = 7;

const SEASONS = [
  { value: "spring", label: "Spring", emoji: "🌸" },
  { value: "summer", label: "Summer", emoji: "☀️" },
  { value: "autumn", label: "Autumn", emoji: "🍂" },
  { value: "winter", label: "Winter", emoji: "❄️" },
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

  const handleSubmit = () => {
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
          Alert.alert("Trip saved!", "Your trip has been added to your map.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: (err) => Alert.alert("Error", err.message),
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => (step > 1 ? setStep(step - 1) : router.back())}>
          <Text className="text-sky-500 font-semibold">
            {step > 1 ? "Back" : "Cancel"}
          </Text>
        </TouchableOpacity>
        <Text className="text-base font-bold text-gray-900">New Trip</Text>
        <View className="w-14" />
      </View>

      {/* Progress dots */}
      <View className="flex-row justify-center py-3 gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full ${i < step ? "bg-sky-500" : "bg-gray-300"}`}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4"
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
          <View className="h-24" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View className="px-4 pb-4 bg-gray-50">
        {step < TOTAL_STEPS ? (
          <Button
            title={`Next (${step}/${TOTAL_STEPS})`}
            onPress={() => setStep(step + 1)}
            disabled={!canGoNext()}
            fullWidth
          />
        ) : (
          <Button
            title={createTrip.isPending ? "Saving..." : "Save Trip"}
            onPress={handleSubmit}
            disabled={createTrip.isPending}
            fullWidth
          />
        )}
      </View>
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
  return (
    <View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">Where did you go?</Text>
      <Text className="text-sm text-gray-500 mb-4">Search for a city or destination</Text>
      <PlacesAutocomplete onSelectPlace={onPlaceSelect} />
      {form.destination ? (
        <View className="mt-4 bg-white rounded-xl p-4 border border-sky-200">
          <Text className="text-base font-semibold text-gray-900">
            {form.destination}
          </Text>
          <Input
            label="Trip title"
            value={form.title}
            onChangeText={(v) => update("title", v)}
            placeholder={form.destination}
            className="mt-3"
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
  return (
    <View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">When was it?</Text>
      <Text className="text-sm text-gray-500 mb-4">Enter your travel dates</Text>
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
        className="mt-3"
      />
      <Text className="text-sm font-medium text-gray-700 mt-4 mb-2">Season</Text>
      <View className="flex-row flex-wrap gap-2">
        {SEASONS.map((s) => (
          <TouchableOpacity
            key={s.value}
            onPress={() => update("season", form.season === s.value ? "" : s.value)}
            className={`px-4 py-2 rounded-xl border ${
              form.season === s.value
                ? "border-sky-500 bg-sky-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <Text className="text-sm">
              {s.emoji} {s.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  return (
    <View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">Who traveled?</Text>
      <Text className="text-sm text-gray-500 mb-4">What kind of trip was this?</Text>
      <CategoryPicker
        selected={form.travelerCategory}
        onSelect={(v) => update("travelerCategory", v)}
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
  return (
    <View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">Where did you stay?</Text>
      <Text className="text-sm text-gray-500 mb-4">Optional - add accommodation details</Text>
      <Input
        label="Accommodation name"
        value={form.accommodationName}
        onChangeText={(v) => update("accommodationName", v)}
        placeholder="e.g. Casa Central Airbnb"
      />
      <Text className="text-sm font-medium text-gray-700 mt-3 mb-2">Type</Text>
      <View className="flex-row flex-wrap gap-2">
        {ACCOMMODATION_TYPES.map((t) => (
          <TouchableOpacity
            key={t.value}
            onPress={() => update("accommodationType", t.value)}
            className={`px-3 py-2 rounded-xl border ${
              form.accommodationType === t.value
                ? "border-sky-500 bg-sky-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <Text className="text-sm">{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Input
        label="Booking link (optional)"
        value={form.accommodationUrl}
        onChangeText={(v) => update("accommodationUrl", v)}
        placeholder="https://..."
        className="mt-3"
        keyboardType="url"
      />
      <Text className="text-sm font-medium text-gray-700 mt-3 mb-2">Rating</Text>
      <View className="flex-row gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => update("accommodationRating", String(n))}
            className={`w-10 h-10 rounded-full items-center justify-center border ${
              Number(form.accommodationRating) >= n
                ? "border-yellow-400 bg-yellow-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <Text>{Number(form.accommodationRating) >= n ? "★" : "☆"}</Text>
          </TouchableOpacity>
        ))}
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
  const total =
    (Number(form.budgetAccommodation) || 0) +
    (Number(form.budgetFood) || 0) +
    (Number(form.budgetTransport) || 0) +
    (Number(form.budgetActivities) || 0) +
    (Number(form.budgetOther) || 0);

  return (
    <View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">How much did it cost?</Text>
      <Text className="text-sm text-gray-500 mb-4">Optional - track your spending</Text>

      <BudgetInput emoji="🏨" label="Accommodation" value={form.budgetAccommodation} onChange={(v) => update("budgetAccommodation", v)} />
      <BudgetInput emoji="🍽️" label="Food & Dining" value={form.budgetFood} onChange={(v) => update("budgetFood", v)} />
      <BudgetInput emoji="🚗" label="Transport" value={form.budgetTransport} onChange={(v) => update("budgetTransport", v)} />
      <BudgetInput emoji="🎯" label="Activities" value={form.budgetActivities} onChange={(v) => update("budgetActivities", v)} />
      <BudgetInput emoji="📦" label="Other" value={form.budgetOther} onChange={(v) => update("budgetOther", v)} />

      <View className="bg-sky-50 rounded-xl p-4 mt-3 flex-row justify-between items-center">
        <Text className="text-base font-bold text-sky-900">Total</Text>
        <Text className="text-xl font-bold text-sky-600">
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
  return (
    <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-3 py-2.5 mb-2">
      <Text className="text-lg mr-2">{emoji}</Text>
      <Text className="text-sm text-gray-600 flex-1">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="0"
        keyboardType="numeric"
        className="text-right text-base font-semibold text-gray-900 w-24"
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
  return (
    <View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">Tell your story</Text>
      <Text className="text-sm text-gray-500 mb-4">Write about your experience</Text>
      <TextInput
        value={form.description}
        onChangeText={(v) => update("description", v)}
        placeholder="What made this trip special? Share tips, highlights, and memories..."
        multiline
        className="bg-white rounded-xl p-4 text-gray-700 min-h-[200px] border border-gray-200 text-base"
        textAlignVertical="top"
      />
      <Text className="text-xs text-gray-400 mt-2">
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
  return (
    <View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">Almost done!</Text>
      <Text className="text-sm text-gray-500 mb-4">Choose who can see this trip</Text>

      <TouchableOpacity
        onPress={() => update("isPublic", false)}
        className={`p-4 rounded-xl border mb-3 ${
          !form.isPublic ? "border-sky-500 bg-sky-50" : "border-gray-200 bg-white"
        }`}
      >
        <View className="flex-row items-center">
          <Text className="text-2xl mr-3">🔒</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">Private</Text>
            <Text className="text-sm text-gray-500">Only you can see this trip</Text>
          </View>
          {!form.isPublic && <Text className="text-sky-500 text-lg">{">"}</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => update("isPublic", true)}
        className={`p-4 rounded-xl border ${
          form.isPublic ? "border-sky-500 bg-sky-50" : "border-gray-200 bg-white"
        }`}
      >
        <View className="flex-row items-center">
          <Text className="text-2xl mr-3">🌍</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">Public</Text>
            <Text className="text-sm text-gray-500">
              Other travelers can discover this trip
            </Text>
          </View>
          {form.isPublic && <Text className="text-sky-500 text-lg">{">"}</Text>}
        </View>
      </TouchableOpacity>

      {/* Preview */}
      <View className="bg-white rounded-2xl p-4 mt-6 border border-gray-100">
        <Text className="text-sm font-semibold text-gray-400 uppercase mb-2">
          Preview
        </Text>
        <Text className="text-lg font-bold text-gray-900">
          {form.title || form.destination}
        </Text>
        <Text className="text-sm text-gray-500">{form.destination}</Text>
        {form.startDate && (
          <Text className="text-xs text-gray-400 mt-1">{form.startDate}</Text>
        )}
      </View>
    </View>
  );
}
