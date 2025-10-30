"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import { FileProvider } from "@/contexts/FileContext"
import { AISessionProvider } from "@/contexts/AISessionContext"
import { Navbar } from "@/components/navbar/Navbar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FileProvider>
          <AISessionProvider>
            <Navbar />
            {children}
            <Toaster position="top-center" richColors />
          </AISessionProvider>
        </FileProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
