import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "./providers/ThemeContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

// GLOBAL SEO METADATA
export const metadata: Metadata = {
  title: {
    default: "edocAI - Enterprise AI Document Extraction",
    template: "%s | edocAI"
  },
  description: "Instantly transform unstructured invoices and receipts into structured JSON using AI. Built with FastAPI, Celery, and Google Gemini.",
  keywords: ["AI", "Machine Learning", "Document Extraction", "OCR", "FastAPI", "Next.js"],
  openGraph: {
    type: "website",
    locale: "en_US",
    // url: "https://edocAI.app", // Replace with your real domain later
    siteName: "edocAI",
    title: "edocAI - Enterprise AI Document Extraction",
    description: "Instantly transform unstructured invoices and receipts into structured JSON.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${jetbrainsMono.className} antialiased dark`}>
        <ThemeProvider>
          <header>
            <Navbar />
          </header>
          
          {/* min-h-screen ensures the footer is pushed to the bottom even if content is short */}
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}