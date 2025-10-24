import Link from 'next/link'

export function HeroCallToAction() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg text-muted-foreground">
        Sign in to start cleaning your Excel files
      </p>
      <Link 
        href="/sign-in"
        className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-violet-700 hover:scale-105"
      >
        Let&apos;s Start
      </Link>
    </div>
  )
}