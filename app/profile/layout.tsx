import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your edocAI account settings.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}