"use client"

import React, { useState } from 'react'
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
      <div className="text-lg font-semibold">
        Excel Cleaner
      </div>
      
      <div className="flex items-center gap-2">
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
