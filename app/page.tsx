"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/ThemeContext";

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-300 ${
      isDark ? "bg-black text-white" : "bg-white text-gray-900"
    }`}>
      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm mb-8 ${
            isDark ? "border-white/10 bg-white/5 text-gray-400" : "border-gray-200 bg-gray-50 text-gray-600"
          }`}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            Now generally available
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-8">
            Data extraction,<br />
            <span className={isDark ? "text-gray-500" : "text-gray-400"}>
              reimagined.
            </span>
          </h1>
          
          <p className={`text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Stop manually entering data from invoices and receipts. Upload a document, and let our asynchronous AI pipeline return structured JSON in seconds.
          </p>

          <div className="flex items-center justify-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => router.push("/app")}
                className={`text-lg font-medium px-8 py-4 rounded-full transition-all ${
                  isDark 
                    ? "bg-white text-black hover:bg-gray-200" 
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Open Dashboard
              </button>
            ) : (
              <button 
                onClick={() => router.push("/signup")}
                className={`text-lg font-medium px-8 py-4 rounded-full transition-all ${
                  isDark 
                    ? "bg-white text-black hover:bg-gray-200" 
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Start for free
              </button>
            )}
          </div>
        </div>
      </section>

      {/* UI Visual - Frosted Glass Card */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div className={`rounded-3xl p-1 shadow-2xl border backdrop-blur-xl ${
          isDark 
            ? "bg-white/5 border-white/10 shadow-black/50" 
            : "bg-gray-100 border-gray-200 shadow-gray-300/50"
        }`}>
          <div className={`rounded-[20px] p-6 md:p-8 ${
            isDark ? "bg-black/40" : "bg-white"
          }`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className={`ml-4 text-xs font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                edocAI
              </span>
            </div>
            
            <div className={`rounded-xl p-6 font-mono text-sm border ${
              isDark ? "bg-black/60 border-white/5" : "bg-gray-50 border-gray-200"
            }`}>
              <div className={`flex items-center justify-between mb-4 pb-4 border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>POST /api/v1/upload/</span>
                <span className="text-emerald-400 text-xs font-sans font-medium">202 ACCEPTED</span>
              </div>
              <div className={`text-xs mb-6 leading-loose ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                <span className="text-purple-400">{"{"}</span><br/>
                <span className="ml-4 text-slate-400">{`"filename"`}</span>: <span className="text-emerald-300">{`"invoice_q3.pdf"`}</span>,<br/>
                <span className="ml-4 text-slate-400">{`"status"`}</span>: <span className="text-yellow-300">{`"PROCESSING"`}</span><br/>
                <span className="text-purple-400">{"}"}</span>
              </div>
              
              <div className={`flex items-center justify-between mt-6 pt-4 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>GET /extraction/...</span>
                <span className="text-emerald-400 text-xs font-sans font-medium">200 OK</span>
              </div>
              <div className={`rounded-lg p-4 mt-4 text-xs border ${isDark ? "bg-black border-white/5" : "bg-gray-100 border-gray-200"}`}>
                <pre className="text-emerald-400">
{`{
  "vendor": "Acme Corp",
  "total_amount": "$1,250.00",
  "date": "2023-10-27"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`md:col-span-2 rounded-3xl p-8 border backdrop-blur-sm ${
            isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
          }`}>
            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Asynchronous by design.</h3>
            <p className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Powered by Celery and Redis. Your API responds in milliseconds while heavy AI inference happens safely in the background. No more gateway timeouts.
            </p>
          </div>
          <div className={`rounded-3xl p-8 border backdrop-blur-sm ${
            isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
          }`}>
            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Secure.</h3>
            <p className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              JWT authentication with strict user isolation. Your data never crosses boundaries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}