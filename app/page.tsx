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
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-300 ${
      isDark ? "bg-black text-white" : "bg-white text-gray-900"
    }`}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm mb-8 ${
            isDark ? "border-white/10 bg-white/5 text-gray-400" : "border-gray-200 bg-gray-50 text-gray-600"
          }`}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now generally available
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-8">
            Data extraction,<br />
            <span className={isDark ? "text-gray-500" : "text-gray-400"}>reimagined.</span>
          </h1>

          <p className={`text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Stop manually entering data from invoices and receipts. Upload a document, and let our AI pipeline return structured JSON in seconds.
          </p>

          <div className="flex items-center justify-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => router.push("/app")}
                className={`text-lg font-medium px-8 py-4 rounded-full transition-all ${
                  isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Open Dashboard
              </button>
            ) : (
              <button
                onClick={() => router.push("/signup")}
                className={`text-lg font-medium px-8 py-4 rounded-full transition-all ${
                  isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Start for free
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── UI Mock ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div className={`rounded-3xl p-1 shadow-2xl border backdrop-blur-xl ${
          isDark ? "bg-white/5 border-white/10 shadow-black/50" : "bg-gray-100 border-gray-200 shadow-gray-300/50"
        }`}>
          <div className={`rounded-[20px] p-6 md:p-8 ${isDark ? "bg-black/40" : "bg-white"}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className={`ml-4 text-xs font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                edocAI
              </span>
            </div>

            <div className={`rounded-xl p-6 font-mono text-sm border ${
              isDark ? "bg-black/60 border-white/5" : "bg-gray-50 border-gray-200"
            }`}>
              <div className={`flex items-center justify-between mb-4 pb-4 border-b ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}>
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  POST /api/v1/upload/
                </span>
                <span className="text-emerald-400 text-xs font-sans font-medium">202 ACCEPTED</span>
              </div>

              <div className={`text-xs mb-6 leading-loose ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                <span className="text-purple-400">{"{"}</span><br />
                <span className="ml-4 text-slate-400">{`"filename"`}</span>: <span className="text-emerald-300">{`"invoice_q3.pdf"`}</span>,<br />
                <span className="ml-4 text-slate-400">{`"status"`}</span>: <span className="text-yellow-300">{`"PROCESSING"`}</span><br />
                <span className="text-purple-400">{"}"}</span>
              </div>

              <div className={`flex items-center justify-between mt-6 pt-4 border-t ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}>
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  GET /extraction/...
                </span>
                <span className="text-emerald-400 text-xs font-sans font-medium">200 OK</span>
              </div>

              <div className={`rounded-lg p-4 mt-4 text-xs border ${
                isDark ? "bg-black border-white/5" : "bg-gray-100 border-gray-200"
              }`}>
                <pre className="text-emerald-400">{`{
  "vendor": "Acme Corp",
  "total_amount": "$1,250.00",
  "date": "2023-10-27"
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className="max-w-5xl mx-auto px-6 pb-32 scroll-mt-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Built for reliability.</h2>
          <p className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Every architectural decision was made to ensure documents are processed efficiently, every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 — large */}
          <div className={`md:col-span-2 rounded-3xl p-8 border ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight">Asynchronous by design.</h3>
            <p className={`leading-relaxed text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Powered by Celery and Redis. Your API responds in milliseconds while heavy AI inference runs safely in the background via a producer-consumer message queue. No more gateway timeouts.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`rounded-3xl p-8 border ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight">Secure.</h3>
            <p className={`leading-relaxed text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              JWT authentication with row-level security enforced at the database layer. Your documents never cross tenant boundaries.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`rounded-3xl p-8 border ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.248-1.379 2.248H4.177c-1.41 0-2.38-1.248-1.379-2.248L5 14.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight">AI with fallback.</h3>
            <p className={`leading-relaxed text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Gemini 1.5 Flash handles vision extraction. If rate-limited, the pipeline automatically falls back to PyMuPDF text extraction — zero downtime.
            </p>
          </div>

          {/* Card 4 — large */}
          <div className={`md:col-span-2 rounded-3xl p-8 border ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight">Strictly typed output.</h3>
            <p className={`leading-relaxed text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Every extraction returns a validated JSON object. Vendor, amount, date, and line items are structured and consistent — ready to pipe directly into your downstream systems without manual parsing.
            </p>
          </div>

        </div>
      </section>

      {/* ── API Docs ─────────────────────────────────────────────── */}
      <section id="api" className="max-w-5xl mx-auto px-6 pb-32 scroll-mt-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Simple API. Powerful results.</h2>
          <p className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Three endpoints. That is all you need.
          </p>
        </div>

        <div className="space-y-4">

          {/* Endpoint 1 */}
          {[
            {
              method: "POST",
              methodColor: "text-blue-400",
              path: "/auth/signup",
              description: "Create a new account. Returns a JWT access token.",
              request: `{
  "username": "you@example.com",
  "password": "your_password"
}`,
              response: `{
  "access_token": "eyJhbGci...",
  "token_type": "bearer"
}`,
            },
            {
              method: "POST",
              methodColor: "text-blue-400",
              path: "/upload/",
              description: "Upload an invoice or receipt. Returns immediately with a job ID while processing happens in the background.",
              request: `Content-Type: multipart/form-data
Authorization: Bearer <token>

file: invoice.pdf`,
              response: `{
  "id": "doc_abc123",
  "filename": "invoice.pdf",
  "status": "PENDING"
}`,
            },
            {
              method: "GET",
              methodColor: "text-emerald-400",
              path: "/extraction/{document_id}",
              description: "Retrieve structured JSON extraction for a completed document.",
              request: `Authorization: Bearer <token>`,
              response: `{
  "document_id": "doc_abc123",
  "extracted_data": {
    "vendor": "Acme Corp",
    "total_amount": "$1,250.00",
    "date": "2023-10-27"
  },
  "confidence_score": 0.97
}`,
            },
          ].map(({ method, methodColor, path, description, request, response }) => (
            <div
              key={path}
              className={`rounded-2xl border overflow-hidden ${
                isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Header */}
              <div className={`px-6 py-4 flex items-center gap-4 border-b ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}>
                <span className={`text-xs font-bold font-mono ${methodColor}`}>{method}</span>
                <span className={`text-sm font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {path}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}>Description</p>
                  <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {description}
                  </p>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}>Request</p>
                  <pre className={`text-xs rounded-xl p-4 border leading-relaxed ${
                    isDark ? "bg-black/60 border-white/5 text-gray-300" : "bg-white border-gray-200 text-gray-700"
                  }`}>
                    {request}
                  </pre>
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}>Response</p>
                  <pre className={`text-xs rounded-xl p-4 border leading-relaxed ${
                    isDark ? "bg-black/60 border-white/5 text-emerald-400" : "bg-white border-gray-200 text-emerald-600"
                  }`}>
                    {response}
                  </pre>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div className={`rounded-3xl p-12 text-center border ${
          isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
        }`}>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to extract?</h2>
          <p className={`text-base mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Free to use. No credit card required.
          </p>
          {isLoggedIn ? (
            <button
              onClick={() => router.push("/app")}
              className={`text-base font-medium px-8 py-4 rounded-full transition-all ${
                isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Open Dashboard
            </button>
          ) : (
            <button
              onClick={() => router.push("/signup")}
              className={`text-base font-medium px-8 py-4 rounded-full transition-all ${
                isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Get started for free
            </button>
          )}
        </div>
      </section>

    </div>
  );
}