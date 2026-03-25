"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Zap, Flame } from "lucide-react"
import { useWeb3 } from "@/hooks/useWeb3"
import { parseEther } from "ethers"

export function HeroSection() {
  const { contract, address, connectWallet } = useWeb3();
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async (isPremium: boolean) => {
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
      const value = isPremium ? parseEther("0.05") : parseEther("0.01");
      const tx = await contract.mintHero({ value });
      await tx.wait();
      alert("¡Héroe invocado con éxito de la blockchain de Fuji!");
    } catch (err: any) {
      console.error(err);
      if (err.reason && err.reason.includes("already own all")) {
         alert("¡Ya posees los 8 héroes únicos! No puedes invocar más.");
      } else {
         alert("Error al mintear. Verifica si tienes suficiente AVAX o si rechazaste la transacción.");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const handleDevMint = async () => {
    if (!address || !contract) return;
    try {
      setIsMinting(true);
      // Sylas (0), Ignis (1), Aethelgard (2), Thalassa (4)
      const tx = await contract.adminMintSpecific(address, [0, 1, 2, 4]);
      await tx.wait();
      alert("¡Dev Mint exitoso! Sylas, Ignis, Aethelgard y Thalassa añadidos a tu billetera.");
    } catch (err: any) {
      console.error(err);
      alert("Error en Dev Mint. Asegúrate de ser el Owner del contrato.");
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
        <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row">
          <Button 
            onClick={() => handleMint(false)} 
            disabled={isMinting} 
            size="lg" 
            className="gap-2 bg-slate-800 text-white hover:bg-slate-700 px-8 py-8 text-lg border border-slate-600 transition-all hover:scale-105"
          >
            <Zap className="h-6 w-6 text-sky-400" />
            <div className="flex flex-col items-start text-left">
              <span>Standard Summon</span>
              <span className="text-xs text-slate-400 font-normal">Normal Rates • 0.01 AVAX</span>
            </div>
          </Button>
          <Button 
            onClick={() => handleMint(true)} 
            disabled={isMinting} 
            size="lg" 
            className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-8 py-8 text-lg shadow-[0_0_30px_-5px_rgba(245,158,11,0.6)] border border-amber-400/50 transition-all hover:scale-105"
          >
            <Flame className="h-6 w-6 text-yellow-200" />
            <div className="flex flex-col items-start text-left">
              <span>Premium Summon</span>
              <span className="text-xs text-amber-200 font-normal">High Mythic Rate • 0.05 AVAX</span>
            </div>
          </Button>
        </div>
        {isMinting && <p className="mt-6 text-sm text-primary animate-pulse font-bold tracking-widest uppercase">Escribiendo invocación en el contrato inteligente...</p>}

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

        {/* Dev Tools */}
        {address && (
          <div className="mt-12 opacity-50 hover:opacity-100 transition-opacity">
            <Button onClick={handleDevMint} disabled={isMinting} variant="outline" size="sm" className="text-xs border-dashed border-red-500/50 text-red-400 hover:bg-red-500/10">
              🛠️ [DEV] Force Mint: Sylas, Ignis, Aethelgard, Thalassa
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
