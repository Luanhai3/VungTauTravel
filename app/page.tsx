import HeroSection from "@/components/sections/HeroSection"
import FeatureSection from "@/components/sections/FeatureSection"
import DiscoverSection from "@/components/sections/DiscoverSection"
import ExperienceSection from "@/components/sections/ExperienceSection"
import SignatureSection from "@/components/sections/SignatureSection"

export default function Home() {
  return (
    <main className="bg-white text-black">

      {/* HERO FULL WIDTH */}
      <HeroSection />

      <FeatureSection />

      <DiscoverSection />

      <ExperienceSection />

      <SignatureSection />

    </main>
  )
}