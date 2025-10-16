import React from 'react'
import { Button } from './ui/button'

//test component

export const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-4">
        <Button variant="outline" size="default">
            Strona główna
        </Button>
    </nav>
  )
}
