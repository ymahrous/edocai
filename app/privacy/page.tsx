"use client";
import LegalLayout from "@/app/legal/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="mb-6">
        This Privacy Policy describes how edocAI ("we", "us", or "our") collects, uses, and protects information when you use our web application and API (the "Service"). We are committed to minimizing data collection and maximizing transparency.
      </p>

      <h2 id="1">1. Information We Collect</h2>
      <p><strong>Account Data:</strong> When you sign up, we store your email address and a cryptographically hashed version of your password. We do not store your password in plain text.</p>
      <p><strong>Document Data:</strong> When you upload a file, it is temporarily stored in our secure cloud storage (Supabase) to be processed. Once processed, the raw file is retained for your viewing purposes but is not used by us for any other reason.</p>
      <p><strong>System Logs:</strong> Like all web applications, our hosting providers (Vercel, Railway) may automatically collect standard server logs (IP address, browser type) to prevent spam and ensure security.</p>

      <h2 id="2">2. How We Use Your Information</h2>
      <p>We use your email address solely for account identification and JWT payload generation. We use your uploaded documents solely to pass them to our AI inference pipeline. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

      <h2 id="3">3. Data Storage and Security</h2>
      <p>Your data is stored securely using industry-standard practices:</p>
      <ul>
        <li><strong>Database:</strong> User metadata is stored in a managed PostgreSQL database (Neon) with strict user-id based row-level isolation.</li>
        <li><strong>Files:</strong> Documents are stored in a secure object storage bucket (Supabase Storage).</li>
        <li><strong>Authentication:</strong> Passwords are hashed using the Bcrypt algorithm. Sessions are managed via short-lived JWTs.</li>
        <li><strong>AI Processing:</strong> Documents are sent to Google Gemini API for processing. We do not retain rights to your data to train their models.</li>
      </ul>

      <h2 id="4">4. Data Retention and Deletion</h2>
      <p>Because this is a portfolio project, we do not currently offer an automated self-service data deletion portal. However, if you wish to have your account and all associated documents permanently deleted, you can contact the developer directly via the GitHub repository, and the data will be manually purged from the database and storage buckets within 48 hours.</p>

      <h2 id="5">5. Third-Party Services</h2>
      <p>The Service relies on the following third-party infrastructure providers, who have their own privacy policies:</p>
      <ul>
        <li><strong>Supabase:</strong> File Storage and Database hosting.</li>
        <li><strong>Google Cloud (Gemini API):</strong> AI document inference.</li>
        <li><strong>Upstash:</strong> Message brokering for background tasks.</li>
        <li><strong>Railway & Vercel:</strong> Application hosting.</li>
      </ul>

      <h2 id="6">6. Cookies and Local Storage</h2>
      <p>We do not use traditional tracking cookies. We use your browser's `localStorage` to store your JWT access token so you remain logged in. Clearing your browser data will log you out but will not delete your account or documents from our servers.</p>

      <h2 id="7">7. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. Changes will be reflected by the "Last updated" date at the top of this page.</p>

      <h2 id="8">8. Contact</h2>
      <p>For privacy-related inquiries, please open an issue in the project's public GitHub repository.</p>
    </LegalLayout>
  );
}