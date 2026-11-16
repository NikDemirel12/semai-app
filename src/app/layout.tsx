import type { Metadata, Viewport } from "next"
import { Lora, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
})

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "SEMAI — Tumbuh Bersama | Pengurusan Kebun & Kewangan Tani",
  description:
    "Platform pengurusan kebun, kos tersembunyi, almanak cuaca, dan unjuran hasil tanaman untuk petani Malaysia.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SEMAI",
  },
}

export const viewport: Viewport = {
  themeColor: "#163020",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms">
      <body
        className={`${plusJakarta.variable} ${lora.variable} font-sans antialiased bg-[#F5F2EB] text-[#1C251E]`}
      >
        {children}
      </body>
    </html>
  )
}
