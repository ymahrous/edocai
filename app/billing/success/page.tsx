"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/providers/ThemeContext";
import { getUsage } from "@/lib/api";

export default function BillingSuccess() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Wait 2 seconds to ensure Stripe Webhook has time to hit the DB
    const timer = setTimeout(async () => {
      try {
        const usageData = await getUsage();
        
        if (usageData.plan === "pro") {
          setStatus("success");
          // The DB knows we are Pro. We need a new JWT.
          // Easiest way: force logout and redirect to login so they get a fresh token.
          setTimeout(() => {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("storage")); // Sync navbar
            router.push("/login");
          }, 2000);
        } else {
          // Webhook might be delayed
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={`min-h-screen flex items-center justify-center font-sans antialiased ${
      isDark ? "bg-black text-white" : "bg-white text-gray-900"
    }`}>
      <div className="text-center max-w-md">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-3">Confirming Subscription...</h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Please wait while we verify your payment.
            </p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-3">Welcome to Pro!</h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Redirecting you to log in with your new benefits...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-3">Payment Processing</h1>
            <p className={`text-sm mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Your payment is processing. Please log out and log back in a few moments to see your Pro features.
            </p>
            <button
              onClick={() => router.push("/app")}
              className={`text-sm font-medium px-6 py-3 rounded-full transition-all ${
                isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}