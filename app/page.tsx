import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TechSection } from "@/components/tech-section"
import { NFTShowcase } from "@/components/nft-showcase"
import { DashboardMockup } from "@/components/dashboard-mockup"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <NFTShowcase />
      <TechSection />
      <DashboardMockup />
      <Footer />
    </main>
  )
}
