import { HeroSection } from "@/app/HeroSection"
import { HowItWorksSection } from "@/app/HowItWorksSection"

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
    </div>
  );
}
