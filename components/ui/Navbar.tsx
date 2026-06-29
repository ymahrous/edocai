"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/app/providers/ThemeContext";
import { logout } from "@/lib/api";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Re-check auth on every route change AND on storage events
  // (covers both navigation and same-tab logout)
  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href
        ? isDark
          ? "text-white"
          : "text-gray-900"
        : isDark
        ? "text-gray-500 hover:text-white"
        : "text-gray-400 hover:text-gray-900"
    }`;

  return (
    <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-xl ${
      isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200"
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/logo.svg"
            alt="edocAI"
            width={24}
            height={24}
            className={`h-6 w-auto ${isDark ? "invert-0" : "invert"}`}
          />
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/10 text-gray-900"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Auth Links */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {pathname !== "/app" && (
                <button onClick={() => router.push("/app")} className={navLinkClass("/app")}>
                  Dashboard
                </button>
              )}
              {pathname !== "/profile" && (
                <button onClick={() => router.push("/profile")} className={navLinkClass("/profile")}>
                  Profile
                </button>
              )}
              <button onClick={handleLogout} className={navLinkClass("")}>
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => router.push("/login")} className={navLinkClass("/login")}>
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

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-2">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/10 text-gray-900"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`p-2 rounded-full transition-colors ${
              isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/10 text-gray-900"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className={`md:hidden border-t px-6 py-4 flex flex-col gap-4 ${
          isDark ? "bg-black/90 border-white/10" : "bg-white/90 border-gray-200"
        }`}>
          {isLoggedIn ? (
            <>
              <button
                onClick={() => router.push("/app")}
                className={navLinkClass("/app")}
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push("/profile")}
                className={navLinkClass("/profile")}
              >
                Profile
              </button>
              <button onClick={handleLogout} className={navLinkClass("")}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className={navLinkClass("/login")}
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors text-left"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}