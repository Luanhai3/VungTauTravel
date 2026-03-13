import type { Metadata } from "next"
import "./globals.css"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

import { Montserrat, Playfair_Display } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  variable: "--font-body"
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400","600","700"],
  variable: "--font-display"
})

export const metadata: Metadata = {
  title: "VungTauTravel",
  description: "Luxury travel experience in Vung Tau",
}

export default function RootLayout({
  children,
}:{
  children: React.ReactNode
}) {

  return (

    <html lang="vi">

      <body
        className={`${montserrat.variable} ${playfair.variable} font-sans bg-white text-gray-800`}
      >

        {/* wrapper toàn trang */}
        <div className="relative min-h-screen">

          {/* background animation */}
          <div className="fixed inset-0 z-0 pointer-events-none">
          </div>

          {/* UI layer */}
          <div className="relative z-10">

            <Navbar />

            <main className="min-h-screen overflow-x-hidden pt-[72px]">
              {children}
            </main>

            <Footer />

          </div>

        </div>

      </body>

    </html>

  )
}