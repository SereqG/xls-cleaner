"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import { FileProvider } from "@/contexts/FileContext"
import { Navbar } from "@/components/navbar/Navbar"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FileProvider>
        <Navbar />
        {children}
      </FileProvider>
    </ThemeProvider>
  )
}
