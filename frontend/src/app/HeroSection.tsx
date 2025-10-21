import { FileUpload } from "@/components/FileUpload"
import { FileActions } from "@/components/FileActions"

export function HeroSection() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-4xl w-full text-center space-y-8">
        <div className="space-y-6">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
            Fast and easy to use
            <br />
            <span className="bg-gradient-to-r from-violet-800 to-violet-400 bg-clip-text text-6xl text-transparent md:text-7xl lg:text-8xl">
              Excel Cleaner
            </span>
          </h1>
          <p className="mb-8 text-lg text-gray-400 md:text-xl">
            Use this Excel cleaner to make your Excel files cleaner and more readable
          </p>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <FileUpload />
          <FileActions />
        </div>
      </div>
    </section>
  )
}
