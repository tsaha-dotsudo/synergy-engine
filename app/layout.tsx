import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "reactflow/dist/style.css";
import { Sidebar } from "@/components/Sidebar";
import { ChatDrawer } from "@/components/ChatDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Synergy Engine — Meridian Capital Partners",
  description:
    "AI portfolio intelligence for private equity. Surface hidden risks and opportunities across your investments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 lg:pl-64">{children}</main>
        </div>
        <ChatDrawer />
      </body>
    </html>
  );
}
