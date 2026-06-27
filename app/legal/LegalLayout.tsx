"use client";
import { useTheme } from "@/app/providers/ThemeContext";

// ADD title: string HERE
export default function LegalLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`min-h-screen pt-32 pb-24 px-6 ${isDark ? "bg-black text-gray-300" : "bg-white text-gray-700"}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-4xl font-bold tracking-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          {title}
        </h1>
        <p className={`text-sm mb-12 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Last updated: June 2026
        </p>
        
        <div className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}>
          {children}
        </div>
      </div>
    </section>
  );
}