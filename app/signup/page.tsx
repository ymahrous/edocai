"use client";

import Link from "next/link";
import { signup } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/providers/ThemeContext";
import PasswordToggle from "@/components/ui/PasswordToggle";

export default function SignupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [passwordError, setPasswordError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockSecondsRemaining, setLockSecondsRemaining] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({ score: 0, label: "", color: "" });

  const validateEmail = (value: string): string => {
    if (!value) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
    return "";
  };

  const getPasswordStrength = (value: string): {
    score: number;
    label: string;
    color: string;
  } => {
    if (!value) return { score: 0, label: "", color: "" };

    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 1) return { score, label: "Very weak",  color: "bg-red-500" };
    if (score === 2) return { score, label: "Weak",       color: "bg-orange-500" };
    if (score === 3) return { score, label: "Fair",       color: "bg-yellow-500" };
    if (score === 4) return { score, label: "Strong",     color: "bg-blue-500" };
    return              { score,     label: "Very strong", color: "bg-emerald-500" };
  };
  
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

  const validatePassword = (value: string): string => {
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError(`Too many attempts. Try again in ${lockSecondsRemaining} seconds.`);
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signup(email, password);
      setTimeout(() => router.push("/app"), 100);
    } catch (err: unknown) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLockedUntil(Date.now() + 30_000);
        setAttempts(0);
        setError("Too many failed attempts. Please wait 30 seconds.");
      } else {
        setError(err instanceof Error ? err.message : "Signup failed");
      }
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
            Create your account
          </h1>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Start extracting documents today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(validateEmail(e.target.value));
              }}
              className={`w-full bg-transparent text-sm pb-3 border-b-2 outline-none transition-colors placeholder:text-opacity-40 ${
                isDark 
                  ? "border-gray-700 text-white focus:border-indigo-500 placeholder-gray-500" 
                  : "border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-400"
              }`}
              placeholder="Email address"
              required
            />

            {emailError && (
              <p className="text-xs text-amber-500 mt-1">{emailError}</p>
            )}
          </div>

          {/* Password Input Block */}
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
                setPasswordStrength(getPasswordStrength(e.target.value));
              }}
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

          {/* Strength Bar */}
          {password && (
            <div className="mt-3 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((segment) => (
                  <div
                    key={segment}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      segment <= passwordStrength.score
                        ? passwordStrength.color
                        : isDark
                        ? "bg-white/10"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs transition-colors ${
                passwordStrength.score <= 1 ? "text-red-500" :
                passwordStrength.score === 2 ? "text-orange-500" :
                passwordStrength.score === 3 ? "text-yellow-500" :
                passwordStrength.score === 4 ? "text-blue-500" :
                "text-emerald-500"
              }`}>
                {passwordStrength.label}
              </p>
            </div>
          )}

          {/* Password validation error */}
          {passwordError && (
            <p className="text-xs text-amber-500 mt-1">{passwordError}</p>
          )}

          {/* Confirm Password Input Block */}
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-transparent text-sm pb-3 border-b-2 outline-none transition-colors placeholder:text-opacity-40 ${
                isDark
                  ? "border-gray-700 text-white focus:border-indigo-500 placeholder-gray-500"
                  : "border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-400"
              }`}
              placeholder="Confirm password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 accent-indigo-600 cursor-pointer"
            />
            <label htmlFor="terms" className={`text-xs leading-relaxed cursor-pointer ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              I agree to the{" "}
              <a href="/terms" target="_blank" className="text-indigo-500 hover:text-indigo-400 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-indigo-500 hover:text-indigo-400 transition-colors">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || isLocked || !email || !password || !confirmPassword || password!=confirmPassword  || !!emailError || !!passwordError || !agreedToTerms}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white py-3.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 disabled:shadow-none"
          >
            {isLocked
              ? `Locked (${lockSecondsRemaining}s)`
              : isLoading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <p className={`relative mt-8 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
          Login
        </Link>
      </p>
    </section>
  );
}