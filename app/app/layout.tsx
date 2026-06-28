import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Upload and manage your documents.",
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}