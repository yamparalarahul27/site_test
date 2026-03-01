import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Primary body font - clean, modern, highly legible
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Display font - elegant serif for headings
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
});

// Monospace font - for numbers and code
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Saturn Animation",
  description: "Minimal Saturn ring background animation on black.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased bg-black text-slate-200`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <div className="relative min-h-screen z-[2]">{children}</div>
      </body>
    </html>
  );
}
