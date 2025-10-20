import { Navbar } from "@/components/navbar/Navbar"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "App", description: "…" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        {children}
        </body>
    </html>
  )
}