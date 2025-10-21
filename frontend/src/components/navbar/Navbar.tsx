"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from "@/components/navbar/ThemeToggle"

export const Navbar = () => {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", value);
    }
  };

  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[90vw] h-16 px-4 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-semibold">
          Excel Cleaner
        </Link>
        
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link 
              href="/sign-in" 
              className="text-sm font-medium hover:text-violet-400 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/sign-up" 
              className="text-sm font-medium hover:text-violet-400 transition-colors"
            >
              Register
            </Link>
          </SignedOut>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9"
              }
            }}
          />
        </SignedIn>
        <ThemeToggle />
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pl">Polski</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </nav>
  )
}
