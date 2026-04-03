import { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeKey = "light" | "default" | "dark";

export interface ThemeColors {
  background: string;
  gradientTop: string;
  gradientMid: string;
  gradientBottom: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  tabBar: string;
  tabBarBorder: string;
  tabActive: string;
  tabInactive: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  skeleton: string;
  inputBg: string;
  inputBorder: string;
}

const THEMES: Record<ThemeKey, ThemeColors> = {
  light: {
    background: "#f0f4f8",
    gradientTop: "#e8eef5",
    gradientMid: "#ecf0f6",
    gradientBottom: "#f0f4f8",
    card: "rgba(255,255,255,0.85)",
    cardBorder: "rgba(0,0,0,0.08)",
    text: "#1a2332",
    textSecondary: "rgba(26,35,50,0.6)",
    textMuted: "rgba(26,35,50,0.35)",
    tabBar: "#ffffff",
    tabBarBorder: "rgba(0,0,0,0.08)",
    tabActive: "#0284c7",
    tabInactive: "#94a3b8",
    accent: "#0284c7",
    accentBg: "rgba(2,132,199,0.1)",
    accentBorder: "rgba(2,132,199,0.25)",
    buttonPrimary: "#0284c7",
    buttonPrimaryText: "#ffffff",
    skeleton: "rgba(0,0,0,0.06)",
    inputBg: "rgba(0,0,0,0.04)",
    inputBorder: "rgba(0,0,0,0.1)",
  },
  default: {
    background: "#1a2d44",
    gradientTop: "#213a54",
    gradientMid: "#1e344d",
    gradientBottom: "#1a2d44",
    card: "rgba(10,30,60,0.45)",
    cardBorder: "rgba(255,255,255,0.1)",
    text: "#ffffff",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.35)",
    tabBar: "#0f2338",
    tabBarBorder: "rgba(255,255,255,0.1)",
    tabActive: "#38bdf8",
    tabInactive: "rgba(255,255,255,0.35)",
    accent: "#38bdf8",
    accentBg: "rgba(56,189,248,0.15)",
    accentBorder: "rgba(56,189,248,0.3)",
    buttonPrimary: "#0ea5e9",
    buttonPrimaryText: "#ffffff",
    skeleton: "rgba(255,255,255,0.08)",
    inputBg: "rgba(255,255,255,0.08)",
    inputBorder: "rgba(255,255,255,0.12)",
  },
  dark: {
    background: "#0a1420",
    gradientTop: "#0e1c2e",
    gradientMid: "#0c1826",
    gradientBottom: "#0a1420",
    card: "rgba(8,20,40,0.6)",
    cardBorder: "rgba(255,255,255,0.07)",
    text: "#e2e8f0",
    textSecondary: "rgba(226,232,240,0.55)",
    textMuted: "rgba(226,232,240,0.3)",
    tabBar: "#080e18",
    tabBarBorder: "rgba(255,255,255,0.06)",
    tabActive: "#818cf8",
    tabInactive: "rgba(255,255,255,0.25)",
    accent: "#818cf8",
    accentBg: "rgba(129,140,248,0.12)",
    accentBorder: "rgba(129,140,248,0.25)",
    buttonPrimary: "#6366f1",
    buttonPrimaryText: "#ffffff",
    skeleton: "rgba(255,255,255,0.05)",
    inputBg: "rgba(255,255,255,0.06)",
    inputBorder: "rgba(255,255,255,0.08)",
  },
};

const STORAGE_KEY = "travel-checker-theme";

interface ThemeContextValue {
  themeKey: ThemeKey;
  colors: ThemeColors;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeKey: "default",
  colors: THEMES.default,
  setTheme: () => {},
});

export function useThemeStore() {
  return useContext(ThemeContext);
}

export function useThemeProvider() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("default");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved && saved in THEMES) {
          setThemeKey(saved as ThemeKey);
        }
      })
      .catch(() => {});
  }, []);

  const setTheme = useCallback((key: ThemeKey) => {
    setThemeKey(key);
    AsyncStorage.setItem(STORAGE_KEY, key).catch(() => {});
  }, []);

  return {
    themeKey,
    colors: THEMES[themeKey],
    setTheme,
  };
}

export { ThemeContext };

export const THEME_OPTIONS: { key: ThemeKey; label: string; preview: string }[] = [
  { key: "light", label: "Light", preview: "#f0f4f8" },
  { key: "default", label: "Blue", preview: "#1a2d44" },
  { key: "dark", label: "Dark", preview: "#0a1420" },
];

export function getTheme(key: ThemeKey): ThemeColors {
  return THEMES[key];
}
