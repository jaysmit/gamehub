"use client";

import { useState, useEffect, useCallback } from "react";

// Combined themes - each has its own color palette for both light and dark
export type ThemeId = "starlight" | "aurora" | "ember" | "forest";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string; // emoji for simple display
  colors: {
    light: { accent: string; accentLight: string; accentGlow: string };
    dark: { accent: string; accentLight: string; accentGlow: string };
  };
}

export const themes: ThemeConfig[] = [
  {
    id: "starlight",
    name: "Starlight",
    icon: "✦",
    colors: {
      light: { accent: "#0ea5e9", accentLight: "#e0f2fe", accentGlow: "rgba(14, 165, 233, 0.3)" },
      dark: { accent: "#38bdf8", accentLight: "#1e293b", accentGlow: "rgba(56, 189, 248, 0.2)" },
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    icon: "❈",
    colors: {
      light: { accent: "#a855f7", accentLight: "#f3e8ff", accentGlow: "rgba(168, 85, 247, 0.3)" },
      dark: { accent: "#c084fc", accentLight: "#1e1b4b", accentGlow: "rgba(192, 132, 252, 0.2)" },
    },
  },
  {
    id: "ember",
    name: "Ember",
    icon: "◈",
    colors: {
      light: { accent: "#f97316", accentLight: "#fff7ed", accentGlow: "rgba(249, 115, 22, 0.3)" },
      dark: { accent: "#fb923c", accentLight: "#292524", accentGlow: "rgba(251, 146, 60, 0.2)" },
    },
  },
  {
    id: "forest",
    name: "Forest",
    icon: "❖",
    colors: {
      light: { accent: "#10b981", accentLight: "#ecfdf5", accentGlow: "rgba(16, 185, 129, 0.3)" },
      dark: { accent: "#34d399", accentLight: "#14532d", accentGlow: "rgba(52, 211, 153, 0.2)" },
    },
  },
];

export function useTheme() {
  const [isDark, setIsDark] = useState(true);
  const [themeId, setThemeId] = useState<ThemeId>("starlight");
  const [mounted, setMounted] = useState(false);

  const currentTheme = themes.find((t) => t.id === themeId) || themes[0];
  const currentColors = isDark ? currentTheme.colors.dark : currentTheme.colors.light;

  // Apply CSS variables directly to document
  const applyTheme = useCallback((theme: ThemeConfig, dark: boolean) => {
    const colors = dark ? theme.colors.dark : theme.colors.light;
    const root = document.documentElement;

    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-light", colors.accentLight);
    root.style.setProperty("--accent-glow", colors.accentGlow);

    // Toggle dark class
    root.classList.toggle("dark", dark);
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const storedDark = localStorage.getItem("iv_dark");
    const storedTheme = localStorage.getItem("iv_theme_id") as ThemeId | null;

    const dark = storedDark !== "false"; // Default to dark
    const theme = storedTheme && themes.find((t) => t.id === storedTheme) ? storedTheme : "starlight";

    setIsDark(dark);
    setThemeId(theme);
    applyTheme(themes.find((t) => t.id === theme) || themes[0], dark);
  }, [applyTheme]);

  // Update when theme changes
  useEffect(() => {
    if (!mounted) return;
    applyTheme(currentTheme, isDark);
    localStorage.setItem("iv_dark", String(isDark));
    localStorage.setItem("iv_theme_id", themeId);
  }, [isDark, themeId, currentTheme, mounted, applyTheme]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeId((prev) => {
      const currentIndex = themes.findIndex((t) => t.id === prev);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex].id;
    });
  }, []);

  return {
    isDark,
    themeId,
    currentTheme,
    currentColors,
    toggleDarkMode,
    cycleTheme,
    setThemeId,
    setIsDark,
    mounted,
    themes,
  };
}
