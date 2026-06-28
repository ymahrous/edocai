"use client";
import { logout } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/app/providers/ThemeContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]); // Re-check auth state when route changes

  const isDark = theme === "dark";

  return (
    <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-xl ${
      isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200"
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          {/* <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div> */}
          <span className={`text-xl font-semibold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>edocAI</span>
        </div>
        
        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/10 text-gray-900"}`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {pathname !== "/app" && (
                <button 
                  onClick={() => router.push("/app")}
                  className={`text-sm font-medium transition-colors ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Dashboard
                </button>
              )}
              
              {pathname !== "/profile" && (
                <button
                  onClick={() => router.push("/profile")}
                  className={`text-sm font-medium transition-colors ${
                    isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Profile
                </button>
              )}

              {(
                <button 
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className={`text-sm font-medium transition-colors ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/login")}
                className={`text-sm font-medium transition-colors ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                Login
              </button>
              <button 
                onClick={() => router.push("/signup")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}