import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useSignIn, useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@/components/Button";

type Mode = "sign-in" | "sign-up";

export default function SignInScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple" });

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      if (mode === "sign-in") {
        const result = await signIn?.create({
          identifier: email,
          password,
        });
        if (result?.status === "complete") {
          await setSignInActive?.({ session: result.createdSessionId });
          router.replace("/(tabs)");
        }
      } else {
        const result = await signUp?.create({ emailAddress: email, password });
        if (result?.status === "complete") {
          await setSignUpActive?.({ session: result.createdSessionId });
          router.replace("/(auth)/onboarding");
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Apple sign in failed";
      Alert.alert("Error", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient
        colors={["#0c4a6e", "#0284c7", "#38bdf8"]}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-12">
            <View className="items-center mb-10">
              <Text className="text-6xl mb-3">✈️</Text>
              <Text className="text-3xl font-bold text-white">Travel Checker</Text>
              <Text className="text-sky-200 mt-1 text-center">
                Track your adventures around the world
              </Text>
            </View>

            <View className="bg-white rounded-3xl p-6 shadow-xl">
              <View className="flex-row bg-gray-100 rounded-xl p-1 mb-6">
                {(["sign-in", "sign-up"] as Mode[]).map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setMode(m)}
                    className={`flex-1 py-2 rounded-lg items-center ${
                      mode === m ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        mode === m ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {m === "sign-in" ? "Sign In" : "Sign Up"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="gap-3 mb-4">
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-12 text-base text-gray-900"
                  placeholder="Email address"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-12 text-base text-gray-900"
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Button
                title={mode === "sign-in" ? "Sign In" : "Create Account"}
                onPress={() => void handleEmailAuth()}
                loading={isLoading}
                fullWidth
                size="lg"
              />

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-3 text-gray-400 text-sm">or</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={() => void handleAppleSignIn()}
                  className="flex-row items-center justify-center bg-black rounded-2xl py-3 gap-2"
                >
                  <Text className="text-white text-base font-semibold">
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
