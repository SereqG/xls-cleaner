"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import { FileProvider } from "@/contexts/FileContext"
import { AISessionProvider } from "@/contexts/AISessionContext"
import { Navbar } from "@/components/navbar/Navbar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
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
          </AISessionProvider>
        </FileProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
