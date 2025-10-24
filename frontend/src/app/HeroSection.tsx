"use client"

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { FileUpload } from "@/components/FileUpload"
import { FileActions } from "@/components/FileActions"
import { HeroTitle } from "./HeroTitle"
import { HeroCallToAction } from "./HeroCallToAction"

export function HeroSection() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-4xl w-full text-center space-y-8">
        <HeroTitle />

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <SignedIn>
            <FileUpload />
            <FileActions />
          </SignedIn>
          
          <SignedOut>
            <HeroCallToAction />
          </SignedOut>
        </div>
      </div>
    </section>
  )
}
