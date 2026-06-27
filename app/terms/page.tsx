"use client";
import LegalLayout from "@/app/legal/LegalLayout";

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="mb-6">
        Welcome to edocAI. These Terms of Service ("Terms") apply to your use of the edocAI web application, API, and associated documentation (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
      </p>

      <h2 id="1">1. Acceptance of Terms</h2>
      <p>By creating an account or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to all of these Terms, you are not authorized to use the Service.</p>

      <h2 id="2">2. Description of Service</h2>
      <p>edocAI provides an AI-powered application programming interface (API) that allows users to upload documents (such as invoices and receipts) and receive structured JSON data extracted from those documents. The Service is provided "as is" and is intended for educational and portfolio demonstration purposes.</p>

      <h2 id="3">3. User Accounts and Security</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. edocAI uses JSON Web Tokens (JWT) for session management. Tokens are issued for a limited duration and must be stored securely by the client.</p>

      <h2 id="4">4. User Content</h2>
      <p>You retain all rights to the documents you upload ("User Content"). By uploading User Content, you grant edocAI a limited, non-exclusive license to process the document strictly for the purpose of generating the requested extraction output. We do not use your documents to train our underlying AI models.</p>

      <h2 id="5">5. Fair Use and Rate Limits</h2>
      <p>To ensure platform stability, edocAI enforces rate limits on API endpoints. You agree not to abuse the Service by circumventing these limits, attempting to overload the infrastructure, or using automated scripts to mass-extract data without authorization.</p>

      <h2 id="6">6. Intellectual Property</h2>
      <p>The edocAI name, logo, underlying code, and UI design are the intellectual property of edocAI. You may not copy, modify, or distribute any part of the Service without prior written consent.</p>

      <h2 id="7">7. Disclaimer of Warranties</h2>
      <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. AI EXTRACTION RESULTS MAY CONTAIN INACCURACIES. YOU SHOULD VERIFY ALL EXTRACTED DATA BEFORE USING IT IN PRODUCTION ENVIRONMENTS.</p>

      <h2 id="8">8. Limitation of Liability</h2>
      <p>IN NO EVENT SHALL EDOCAI, ITS DEVELOPERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.</p>

      <h2 id="9">9. Changes to Terms</h2>
      <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting within the Service. Your continued use of the Service constitutes acceptance of the modified Terms.</p>

      <h2 id="10">10. Contact Information</h2>
      <p>For questions about these Terms, please open an issue in the project's public GitHub repository.</p>
    </LegalLayout>
  );
}