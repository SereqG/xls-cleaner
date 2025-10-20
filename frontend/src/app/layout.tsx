import { Providers } from "@/components/Providers"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "App", description: "…" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}