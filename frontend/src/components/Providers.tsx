"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import { Navbar } from "@/components/navbar/Navbar"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      {children}
    </ThemeProvider>
  )
}
