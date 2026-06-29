"use client";

import { useTheme } from "@/app/providers/ThemeContext";

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className={`text-sm mb-12 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Last updated: June 2026
        </p>

        <div className="space-y-8">
          <p>
            Welcome to edocAI. These Terms of Service apply to your use of the edocAI web
            application, API, and associated documentation. By accessing or using the Service,
            you agree to be bound by these Terms.
          </p>

          {[
            {
              id: "1",
              title: "1. Acceptance of Terms",
              content: "By creating an account or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to all of these Terms, you are not authorized to use the Service.",
            },
            {
              id: "2",
              title: "2. Description of Service",
              content: "edocAI provides an AI-powered API that allows users to upload documents such as invoices and receipts and receive structured JSON data extracted from those documents. The Service is provided as-is and is intended for educational and portfolio demonstration purposes.",
            },
            {
              id: "3",
              title: "3. User Accounts and Security",
              content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. edocAI uses JSON Web Tokens for session management. Tokens are issued for a limited duration and must be stored securely by the client.",
            },
            {
              id: "4",
              title: "4. User Content",
              content: "You retain all rights to the documents you upload. By uploading content, you grant edocAI a limited, non-exclusive license to process the document strictly for the purpose of generating the requested extraction output. We do not use your documents to train our underlying AI models.",
            },
            {
              id: "5",
              title: "5. Fair Use and Rate Limits",
              content: "To ensure platform stability, edocAI enforces rate limits on API endpoints. You agree not to abuse the Service by circumventing these limits, attempting to overload the infrastructure, or using automated scripts to mass-extract data without authorization.",
            },
            {
              id: "6",
              title: "6. Intellectual Property",
              content: "The edocAI name, logo, underlying code, and UI design are the intellectual property of edocAI. You may not copy, modify, or distribute any part of the Service without prior written consent.",
            },
            {
              id: "7",
              title: "7. Disclaimer of Warranties",
              content: "The Service is provided on an as-is and as-available basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. AI extraction results may contain inaccuracies. You should verify all extracted data before using it in production environments.",
            },
            {
              id: "8",
              title: "8. Limitation of Liability",
              content: "In no event shall edocAI, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.",
            },
            {
              id: "9",
              title: "9. Changes to Terms",
              content: "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting within the Service. Your continued use of the Service constitutes acceptance of the modified Terms.",
            },
            {
              id: "10",
              title: "10. Contact Information",
              content: "For questions about these Terms, please open an issue in the project's public GitHub repository.",
            },
          ].map(({ id, title, content }) => (
            <div key={id} id={id} className={`rounded-2xl border p-6 ${
              isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
            }`}>
              <h2 className={`text-base font-semibold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
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