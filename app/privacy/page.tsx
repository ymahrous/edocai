"use client";

import { useTheme } from "@/app/providers/ThemeContext";

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`min-h-screen pt-32 pb-24 px-6 ${
      isDark ? "bg-black text-gray-300" : "bg-white text-gray-700"
    }`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-4xl font-bold tracking-tight mb-4 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          Privacy Policy
        </h1>
        <p className={`text-sm mb-12 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Last updated: June 2026
        </p>

        <div className="space-y-8">
          <p>
            This Privacy Policy describes how edocAI collects, uses, and protects information
            when you use our web application and API. We are committed to minimizing data
            collection and maximizing transparency.
          </p>

          {/* Section 1 */}
          <div id="1" className={`rounded-2xl border p-6 ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <h2 className={`text-base font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              1. Information We Collect
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p><strong className={isDark ? "text-white" : "text-gray-900"}>Account Data:</strong> When you sign up, we store your email address and a cryptographically hashed version of your password. We do not store your password in plain text.</p>
              <p><strong className={isDark ? "text-white" : "text-gray-900"}>Document Data:</strong> When you upload a file, it is temporarily stored in our secure cloud storage to be processed. Once processed, the raw file is retained for your viewing purposes but is not used by us for any other reason.</p>
              <p><strong className={isDark ? "text-white" : "text-gray-900"}>System Logs:</strong> Our hosting providers may automatically collect standard server logs such as IP address and browser type to prevent spam and ensure security.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div id="2" className={`rounded-2xl border p-6 ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <h2 className={`text-base font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              2. How We Use Your Information
            </h2>
            <p className="text-sm leading-relaxed">
              We use your email address solely for account identification and JWT payload generation.
              We use your uploaded documents solely to pass them to our AI inference pipeline. We do
              not sell, rent, or share your personal data with third parties for marketing purposes.
            </p>
          </div>

          {/* Section 3 */}
          <div id="3" className={`rounded-2xl border p-6 ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <h2 className={`text-base font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              3. Data Storage and Security
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              Your data is stored securely using industry-standard practices:
            </p>
            <div className="space-y-2">
              {[
                { label: "Database", detail: "User metadata is stored in a managed PostgreSQL database with strict row-level isolation." },
                { label: "Files", detail: "Documents are stored in a secure object storage bucket." },
                { label: "Authentication", detail: "Passwords are hashed using the Bcrypt algorithm. Sessions are managed via short-lived JWTs." },
                { label: "AI Processing", detail: "Documents are sent to Google Gemini API for processing. We do not retain rights to your data to train their models." },
              ].map(({ label, detail }) => (
                <div key={label} className={`flex gap-3 text-sm rounded-xl px-4 py-3 ${
                  isDark ? "bg-black/40" : "bg-white border border-gray-200"
                }`}>
                  <strong className={`shrink-0 ${isDark ? "text-white" : "text-gray-900"}`}>{label}:</strong>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 */}
          <div id="4" className={`rounded-2xl border p-6 ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <h2 className={`text-base font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              4. Data Retention and Deletion
            </h2>
            <p className="text-sm leading-relaxed">
              Because this is a portfolio project, we do not currently offer an automated
              self-service data deletion portal. If you wish to have your account and all associated
              documents permanently deleted, you can contact the developer directly via the GitHub
              repository, and the data will be manually purged within 48 hours.
            </p>
          </div>

          {/* Section 5 */}
          <div id="5" className={`rounded-2xl border p-6 ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}>
            <h2 className={`text-base font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              5. Third-Party Services
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              The Service relies on the following third-party infrastructure providers, who have
              their own privacy policies:
            </p>
            <div className="space-y-2">
              {[
                { label: "Supabase", detail: "File storage and database hosting." },
                { label: "Google Cloud (Gemini API)", detail: "AI document inference." },
                { label: "Upstash", detail: "Message brokering for background tasks." },
                { label: "Railway & Vercel", detail: "Application hosting." },
              ].map(({ label, detail }) => (
                <div key={label} className={`flex gap-3 text-sm rounded-xl px-4 py-3 ${
                  isDark ? "bg-black/40" : "bg-white border border-gray-200"
                }`}>
                  <strong className={`shrink-0 ${isDark ? "text-white" : "text-gray-900"}`}>{label}:</strong>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections 6-8 */}
          {[
            {
              id: "6",
              title: "6. Cookies and Local Storage",
              content: "We do not use traditional tracking cookies. We use your browser's localStorage to store your JWT access token so you remain logged in. Clearing your browser data will log you out but will not delete your account or documents from our servers.",
            },
            {
              id: "7",
              title: "7. Changes to This Policy",
              content: "We may update this Privacy Policy from time to time. Changes will be reflected by the last updated date at the top of this page.",
            },
            {
              id: "8",
              title: "8. Contact",
              content: "For privacy-related inquiries, please open an issue in the project's public GitHub repository.",
            },
          ].map(({ id, title, content }) => (
            <div key={id} id={id} className={`rounded-2xl border p-6 ${
              isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
            }`}>
              <h2 className={`text-base font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                {title}
              </h2>
              <p className="text-sm leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}