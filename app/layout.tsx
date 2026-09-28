import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Najem Flow — umowy pod kontrolą",
  description: "Mieszkania, umowy najmu i obieg podpisów w jednym miejscu.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
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
    <html lang="pl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
