import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSignIn, useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { fetchCurrentUser } from "@/api/users";

type Mode = "sign-in" | "sign-up";
type Step = "credentials" | "second-factor" | "email-verify";

export default function SignInScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: "oauth_google" });

  const navigateAfterAuth = async () => {
    try {
      await fetchCurrentUser();
      router.replace("/(tabs)");
    } catch {
      router.replace("/(auth)/onboarding");
    }
  };

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleEmailAuth = async () => {
    if (!isFormValid) return;
    setErrorMessage("");
    setIsLoading(true);
    try {
      if (mode === "sign-in") {
        const result = await signIn?.create({
          identifier: email,
          password,
        });
        if (result?.status === "complete") {
          await setSignInActive?.({ session: result.createdSessionId });
          await navigateAfterAuth();
        } else if (result?.status === "needs_second_factor") {
          await signIn?.prepareSecondFactor({ strategy: "email_code" });
          setStep("second-factor");
        }
      } else {
        const result = await signUp?.create({ emailAddress: email, password });
        if (result?.status === "complete") {
          await setSignUpActive?.({ session: result.createdSessionId });
          router.replace("/(auth)/onboarding");
        } else if (result?.status === "missing_requirements") {
          await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
          setStep("email-verify");
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return;
    setVerifyError("");
    setIsLoading(true);
    try {
      if (step === "second-factor") {
        const result = await signIn?.attemptSecondFactor({
          strategy: "email_code",
          code,
        });
        if (result?.status === "complete") {
          await setSignInActive?.({ session: result.createdSessionId });
          await navigateAfterAuth();
        }
      } else {
        const result = await signUp?.attemptEmailAddressVerification({ code });
        if (result?.status === "complete") {
          await setSignUpActive?.({ session: result.createdSessionId });
          router.replace("/(auth)/onboarding");
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setVerifyError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "apple" | "google") => {
    try {
      const flow = provider === "apple" ? startAppleOAuth : startGoogleOAuth;
      const { createdSessionId, setActive } = await flow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        await navigateAfterAuth();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `${provider} sign in failed`;
      Alert.alert("Error", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: "#0c1a2e" }}>
        {/* Video background */}
        <Video
          source={require("../../assets/login-bg.mp4")}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          style={StyleSheet.absoluteFill}
        />

        {/* Dark overlay for contrast and readability */}
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(12,26,46,0.55)", "rgba(12,26,46,0.7)"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 48, maxWidth: 480, width: "100%", alignSelf: "center" }}>
            <View className="items-center mb-10">
              <Text className="text-3xl font-bold text-white">Travel Checker</Text>
              <Text className="text-sky-200 mt-1 text-center">
                Track your adventures around the world
              </Text>
            </View>

            <BlurView
              intensity={30}
              tint="dark"
              style={{
                borderRadius: 24,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <View style={{ padding: 24, backgroundColor: "rgba(10,30,60,0.45)" }}>
              {step === "credentials" ? (
                <>
                  <View style={{ flexDirection: "row", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
                    {(["sign-in", "sign-up"] as Mode[]).map((m) => (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setMode(m)}
                        style={{
                          flex: 1,
                          paddingVertical: 8,
                          borderRadius: 8,
                          alignItems: "center",
                          backgroundColor: mode === m ? "rgba(255,255,255,0.15)" : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: mode === m ? "#fff" : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {m === "sign-in" ? "Sign In" : "Sign Up"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {errorMessage !== "" && (
                    <View style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "rgba(239,68,68,0.15)",
                      borderWidth: 1,
                      borderColor: "rgba(239,68,68,0.3)",
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 12,
                      gap: 8,
                    }}>
                      <Ionicons name="alert-circle" size={18} color="#f87171" />
                      <Text style={{ color: "#fca5a5", fontSize: 13, flex: 1 }}>
                        {errorMessage}
                      </Text>
                    </View>
                  )}

                  <View style={{ gap: 12, marginBottom: 16 }}>
                    <TextInput
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.12)",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        height: 48,
                        fontSize: 16,
                        color: "#fff",
                      }}
                      placeholder="Email address"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={(t) => { setEmail(t); setErrorMessage(""); }}
                    />
                    <TextInput
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.12)",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        height: 48,
                        fontSize: 16,
                        color: "#fff",
                      }}
                      placeholder="Password"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      secureTextEntry
                      value={password}
                      onChangeText={(t) => { setPassword(t); setErrorMessage(""); }}
                    />
                  </View>

                  <Pressable
                    onPress={() => void handleEmailAuth()}
                    disabled={!isFormValid || isLoading}
                    style={({ pressed }) => ({
                      backgroundColor: !isFormValid
                        ? "rgba(255,255,255,0.06)"
                        : pressed
                          ? "#1e3a5f"
                          : "#0f2b4a",
                      borderWidth: 1,
                      borderColor: !isFormValid
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(56,189,248,0.3)",
                      borderRadius: 16,
                      paddingVertical: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 52,
                      opacity: isLoading ? 0.6 : 1,
                    })}
                  >
                    <Text style={{
                      color: isFormValid ? "#fff" : "rgba(255,255,255,0.3)",
                      fontSize: 17,
                      fontWeight: "700",
                    }}>
                      {isLoading ? "..." : mode === "sign-in" ? "Sign In" : "Create Account"}
                    </Text>
                  </Pressable>

                  <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 16 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.12)" }} />
                    <Text style={{ marginHorizontal: 12, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>or</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.12)" }} />
                  </View>

                  <Pressable
                    onPress={() => void handleOAuthSignIn("google")}
                    accessibilityLabel="Continue with Google"
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: pressed ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: 16,
                      paddingVertical: 14,
                      gap: 8,
                      minHeight: 48,
                    })}
                  >
                    <Ionicons name="logo-google" size={20} color="#4285F4" />
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                      Continue with Google
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => void handleOAuthSignIn("apple")}
                    accessibilityLabel="Continue with Apple"
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: pressed ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.75)",
                      borderRadius: 16,
                      paddingVertical: 14,
                      gap: 8,
                      marginTop: 8,
                      minHeight: 48,
                    })}
                  >
                    <Ionicons name="logo-apple" size={20} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                      Continue with Apple
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 8, textAlign: "center" }}>
                    Verify your email
                  </Text>
                  <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 16, textAlign: "center" }}>
                    Enter the code sent to {email}
                  </Text>

                  {verifyError !== "" && (
                    <View style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "rgba(239,68,68,0.15)",
                      borderWidth: 1,
                      borderColor: "rgba(239,68,68,0.3)",
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 12,
                      gap: 8,
                    }}>
                      <Ionicons name="alert-circle" size={18} color="#f87171" />
                      <Text style={{ color: "#fca5a5", fontSize: 13, flex: 1 }}>
                        {verifyError}
                      </Text>
                    </View>
                  )}

                  <TextInput
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      height: 48,
                      fontSize: 16,
                      color: "#fff",
                      textAlign: "center",
                      letterSpacing: 4,
                      marginBottom: 16,
                    }}
                    placeholder="Enter code"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    value={code}
                    onChangeText={(t) => { setCode(t); setVerifyError(""); }}
                    maxLength={6}
                  />

                  <Pressable
                    onPress={() => void handleVerifyCode()}
                    disabled={isLoading}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.18)",
                      borderRadius: 16,
                      paddingVertical: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 52,
                      opacity: isLoading ? 0.6 : 1,
                    })}
                  >
                    <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
                      {isLoading ? "..." : "Verify"}
                    </Text>
                  </Pressable>

                  <TouchableOpacity
                    onPress={() => {
                      setStep("credentials");
                      setCode("");
                    }}
                    className="mt-3 items-center"
                  >
                    <Text className="text-sky-600 text-sm font-medium">
                      Back to login
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
