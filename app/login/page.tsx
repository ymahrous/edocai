"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useTheme } from "../providers/ThemeContext";
import Link from "next/link";

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
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-6 shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-lg">E</span>
          </div> */}
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
            
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-0 top-1/2 -translate-y-1/2 p-1 transition-colors ${
                isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
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