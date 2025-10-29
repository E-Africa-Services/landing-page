import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./client-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "E-Africa Services",
  description: "Delivering innovative digital solutions across Africa.",
  metadataBase: new URL("https://www.eafricaservices.com"),
  openGraph: {
    type: "website",
    url: "https://www.eafricaservices.com",
    title: "E-Africa Services",
    description: "Delivering innovative digital solutions across Africa.",
    images: [
      {
        url: "https://www.eafricaservices.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "E-Africa Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://yourdomain.com",
    title: "E-Africa Services",
    description: "Delivering innovative digital solutions across Africa.",
    images: ["https://www.eafricaservices.com/og-image.png"],
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ClientLayout />
        {children}
      </body>
    </html>
  )
}
