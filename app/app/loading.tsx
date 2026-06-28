"use client";

import { useTheme } from "@/app/providers/ThemeContext";

export default function Loading() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen pb-20 ${isDark ? "bg-black" : "bg-gray-50"}`}>
      <div className="max-w-5xl mx-auto px-6 pt-24">

        {/* Header skeleton */}
        <div className="mb-12">
          <div className={`h-8 w-36 rounded-lg mb-3 animate-pulse ${
            isDark ? "bg-white/10" : "bg-gray-200"
          }`} />
          <div className={`h-4 w-64 rounded-lg animate-pulse ${
            isDark ? "bg-white/5" : "bg-gray-100"
          }`} />
        </div>

        {/* Upload zone skeleton */}
        <div className={`rounded-2xl p-12 mb-12 border-2 border-dashed animate-pulse ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
        }`} />

        {/* Results table skeleton */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        }`}>
          <div className={`px-8 py-5 border-b ${
            isDark ? "border-white/10" : "border-gray-200"
          }`}>
            <div className={`h-4 w-24 rounded-lg animate-pulse ${
              isDark ? "bg-white/10" : "bg-gray-200"
            }`} />
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`p-8 border-b last:border-0 ${
                isDark ? "border-white/10" : "border-gray-100"
              }`}
            >
              <div className="flex gap-8">
                <div className="w-1/3 space-y-3">
                  <div className={`h-4 w-full rounded-lg animate-pulse ${
                    isDark ? "bg-white/10" : "bg-gray-200"
                  }`} />
                  <div className={`h-3 w-16 rounded-full animate-pulse ${
                    isDark ? "bg-white/5" : "bg-gray-100"
                  }`} />
                </div>
                <div className={`w-2/3 h-24 rounded-xl animate-pulse ${
                  isDark ? "bg-white/5" : "bg-gray-100"
                }`} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}