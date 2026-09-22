import { Geist, Geist_Mono } from "next/font/google";

// next/font descarga las fuentes en el build y las sirve desde el propio sitio.
export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable}`;
