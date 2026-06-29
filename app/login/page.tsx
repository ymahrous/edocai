"use client";

import Link from "next/link";
import { login } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../providers/ThemeContext";
import PasswordToggle from "@/components/ui/PasswordToggle";

export default function LoginPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockSecondsRemaining, setLockSecondsRemaining] = useState(0);

  useEffect(() => {
  if (lockedUntil === null) {
    setIsLocked(false);
    setLockSecondsRemaining(0);
    return;
  }

  const ticker = setInterval(() => {
    const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
    if (remaining <= 0) {
      setIsLocked(false);
      setLockSecondsRemaining(0);
      setLockedUntil(null);
      clearInterval(ticker);
    } else {
      setIsLocked(true);
      setLockSecondsRemaining(remaining);
    }
  }, 1000);

  const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
  setIsLocked(remaining > 0);
  setLockSecondsRemaining(Math.max(remaining, 0));

  return () => clearInterval(ticker);
}, [lockedUntil]);

  useEffect(() => {
    if (!isLocked) return;
    const ticker = setInterval(() => {
      if (Date.now() >= lockedUntil!) {
        setLockedUntil(null);
      }
    }, 1000);
    return () => clearInterval(ticker);
  }, [isLocked, lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError(`Too many attempts. Try again in ${lockSecondsRemaining} seconds.`);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/app");
    } catch (err: unknown) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        const unlockTime = Date.now() + 30_000;
        setLockedUntil(unlockTime);
        setAttempts(0);
        setError("Too many failed attempts. Please wait 30 seconds.");
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden ${
      isDark ? "bg-black" : "bg-gray-50"
    }`}>
      {/* Floating Card */}
      <div className={`relative w-full max-w-sm p-10 rounded-3xl shadow-2xl ${
        isDark ? "bg-slate-900/80 backdrop-blur-xl border border-white/10" : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
      }`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            Welcome back
          </h1>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Sign in to your edocAI account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-transparent text-sm pb-3 border-b-2 outline-none transition-colors placeholder:text-opacity-40 ${
                isDark 
                  ? "border-gray-700 text-white focus:border-indigo-500 placeholder-gray-500" 
                  : "border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-400"
              }`}
              placeholder="Email address"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-transparent text-sm pb-3 border-b-2 outline-none transition-colors placeholder:text-opacity-40 pr-10 ${
                isDark 
                  ? "border-gray-700 text-white focus:border-indigo-500 placeholder-gray-500" 
                  : "border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-400"
              }`}
              placeholder="Password"
              required
            />
            
            <PasswordToggle
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              isDark={isDark}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || isLocked || !email || !password}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white py-3.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 disabled:shadow-none"
          >
            {isLocked
              ? `Locked (${lockSecondsRemaining}s)`
              : isLoading
              ? "Signing in..."
              : "Continue"}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <p className={`relative mt-8 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        Don{"'"}t have an account?{" "}
        <Link href="/signup" className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
          Sign up
        </Link>
      </p>
    </section>
  );
}