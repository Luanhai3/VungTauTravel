import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";
import WaveDivider from "@/components/WaveDivider";
import ScrollProgress from "@/components/ScrollProgress";
import GlobalParallaxBackground from "@/components/GlobalParallaxBackground";
import GlobalParallaxBg from "@/components/GlobalParallaxBg";
import SectionLight from "@/components/SectionLight";
import AtmosphereFog from "@/components/AtmosphereFog";
import FilmGrain from "@/components/FilmGrain";
import AmbientCursor from "@/components/AmbientCursor";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://vungtautravel.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#023329",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "VungTauTravel — Discover Vũng Tàu",
    template: "%s | VungTauTravel",
  },
  description:
    "Discover Vũng Tàu: beaches, food, coffee, and the best check-in photo spots. Your guide to Vietnam's coastal gem.",
  keywords: [
    "Vũng Tàu",
    "Vung Tau",
    "travel",
    "Vietnam",
    "beach",
    "food",
    "coffee",
    "check-in",
  ],
  authors: [{ name: "VungTauTravel" }],
  creator: "VungTauTravel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "VungTauTravel",
    title: "VungTauTravel — Discover Vũng Tàu",
    description:
      "Discover Vũng Tàu: beaches, food, coffee, and the best check-in photo spots.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "VungTauTravel — Discover Vũng Tàu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VungTauTravel — Discover Vũng Tàu",
    description: "Discover Vũng Tàu: beaches, food, coffee, and photo spots.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans overflow-x-hidden">
    <GlobalParallaxBg />
    <GlobalParallaxBackground />
    <AmbientCursor />
    <SectionLight />
    <AtmosphereFog />
    <FilmGrain />
    <LenisProvider>
    <ScrollProgress />
    <Navbar />
    <main>{children}</main>
    <WaveDivider />
    <Footer />
  </LenisProvider>
</body>

    </html>
  );
}
