import type { Metadata, Viewport } from "next";
import {
  Plus_Jakarta_Sans,
  Playfair_Display,
  JetBrains_Mono,
} from "next/font/google";

import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";
import WaveDivider from "@/components/WaveDivider";
import ScrollProgress from "@/components/ScrollProgress";
import SectionLight from "@/components/SectionLight";
import AtmosphereFog from "@/components/AtmosphereFog";
import FilmGrain from "@/components/FilmGrain";
import AmbientCursor from "@/components/AmbientCursor";
import OceanOutro from "@/components/OceanOutro";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden font-sans bg-[#020617] text-white">
        <LenisProvider>
          <AmbientCursor />
          <SectionLight />
          <AtmosphereFog />
          <FilmGrain />
          <ScrollProgress />
          <Navbar />

          <main>{children}</main>

          <WaveDivider />
          <OceanOutro />
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
