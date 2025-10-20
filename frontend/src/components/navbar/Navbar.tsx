"use client"

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Navbar = () => {
  const [language, setLanguage] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || "en";
    }
    return "en";
  });

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", value);
    }
  };

  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[90vw] h-16 px-4">
      <div className="text-lg font-semibold">
        Excel Cleaner
      </div>
      
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
    </nav>
  )
}
