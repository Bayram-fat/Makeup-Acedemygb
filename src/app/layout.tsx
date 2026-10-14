import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Makeup Academy — Master Professional Techniques from Scratch",
  description:
    "Professional makeup education: natural & everyday artistry, a strictly isolated creative & stage atelier, and an interactive brush guide — with step-by-step video and senior-artist written guides in 50 languages.",
};

// Blocking theme script to avoid flash-of-wrong-theme.
const themeScript = `(function(){try{var t=localStorage.getItem('ma-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} bg-bg text-ink antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
