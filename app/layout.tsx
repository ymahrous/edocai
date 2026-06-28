import "./globals.css";
import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, themeScript } from "./providers/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: {
    default: "edocAI",
    template: "%s | edocAI"
  },
  description: "Instantly transform unstructured invoices and receipts into structured JSON using AI. Built with FastAPI, Celery, and Google Gemini.",
  keywords: ["AI", "Machine Learning", "Document Extraction", "OCR", "FastAPI", "Next.js"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edocai.vercel.app",
    siteName: "edocAI",
    title: "edocAI | AI-powered Document Processing",
    description: "Instantly transform unstructured invoices and receipts into structured JSON.",
  },
  robots: { index: true, follow: true },
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} ${jetbrainsMono.className} antialiased`}>
        <ThemeProvider>
          <header>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
          </header>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </main>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}