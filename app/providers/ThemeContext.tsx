"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem("theme");
      var preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var theme = stored || preferred;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    } catch (e) {}
  })();
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize to undefined so we know we haven't read the real value yet
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    // Read the class already applied by the inline script above —
    // this keeps the React state in sync with what's already on the DOM
    const applied = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(applied);

    // Sync theme across tabs via the native storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) {
        setTheme(e.newValue);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(e.newValue);
      }
    };

    // Sync theme if OS preference changes while the tab is open
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const hasSavedPreference = !!localStorage.getItem("theme");
      if (!hasSavedPreference) {
        const next: Theme = e.matches ? "dark" : "light";
        setTheme(next);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(next);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    window.addEventListener("storage", handleStorage);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Don't render children until theme is resolved —
  // but use CSS to hide rather than returning null,
  // so the DOM is present and the inline script has already
  // set the correct class before React paints
  return (
    <ThemeContext.Provider value={{ theme: theme ?? "dark", toggleTheme }}>
      <div style={{ visibility: theme ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);