"use client"

import dynamic from 'next/dynamic'

// Create a no-SSR version of UserButton
const UserButton = dynamic(
  () => import('@clerk/nextjs').then((mod) => ({ default: mod.UserButton })),
  { ssr: false }
)

export { UserButton }