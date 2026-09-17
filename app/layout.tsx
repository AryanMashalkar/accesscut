import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccessCut — Campus access planner",
  description: "Find the single repair that restores the most accessible campus destinations with transparent graph analysis.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
