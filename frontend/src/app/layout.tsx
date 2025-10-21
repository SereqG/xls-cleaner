import { ClerkProvider } from "@clerk/nextjs"
import { Providers } from "@/components/Providers"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "App", description: "…" }
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}