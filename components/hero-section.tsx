"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { useWeb3 } from "@/hooks/useWeb3"

export function HeroSection() {
  const { contract, address, connectWallet } = useWeb3();
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    if (!address) {
      await connectWallet();
      return;
    }
    if (!contract) {
      alert("Contrato no cargado. Verifica la dirección en useWeb3.ts");
      return;
    }
    try {
      setIsMinting(true);
      const tx = await contract.mintHero();
      await tx.wait();
      alert("¡Héroe minteado con éxito en la blockchain de Fuji!");
    } catch (err) {
      console.error(err);
      alert("Error al mintear. Revisa la consola o rechazo de billetera.");
    } finally {
      setIsMinting(false);
    }
  };
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-2xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Built on Avalanche Ecosystem
        </div>

        {/* Main Heading */}
        <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          The First RPG Powered by an{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Avalanche L1 Subnet
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Own your assets, rule the arena. Battle in a decentralized world with 
          instant finality and near-zero gas fees.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={handleMint} disabled={isMinting} size="lg" className="gap-2 bg-primary px-8 text-lg hover:bg-primary/90">
            <Sparkles className="h-5 w-5" />
            {isMinting ? "Minteando y firmando..." : "Mint Your First Hero NFT"}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 border-border/50 px-8 text-lg hover:border-primary/50 hover:bg-primary/10"
          >
            Explore Fuji Testnet Beta
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border/50 pt-8 md:grid-cols-4">
          {[
            { value: "10K+", label: "Heroes Minted" },
            { value: "50K+", label: "Battles Fought" },
            { value: "<0.01", label: "Avg Gas Fee" },
            { value: "500ms", label: "Finality" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
