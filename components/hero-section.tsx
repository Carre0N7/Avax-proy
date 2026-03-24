"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, ArrowRight } from "lucide-react"
import { useWeb3 } from "@/hooks/useWeb3"
import { parseEther } from "ethers"



export function HeroSection() {
  const { contract, address, connectWallet, triggerRefresh } = useWeb3();
  const [isMinting, setIsMinting] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false);
  const [heroName, setHeroName] = useState("");
  const [heroClass, setHeroClass] = useState("0");

  const handleMint = async () => {
    if (!address) {
      await connectWallet();
      return;
    }
    if (!contract) {
      alert("Contract not loaded. Please verify the network.");
      return;
    }
    if (!heroName) {
       alert("You must name your hero");
       return;
    }
    try {
      setIsMinting(true);
      const tx = await contract.mintHero(heroName, Number(heroClass), { value: parseEther("0.01") });
      await tx.wait();
      triggerRefresh();
      alert("Hero minted successfully on the Fuji blockchain!");
      setIsMintDialogOpen(false);
      setHeroName("");
    } catch (err) {
      console.error(err);
      alert("Error minting. Check if you have enough test balance or if you rejected the transaction.");
    } finally {
      setIsMinting(false);
    }
  };
  return (
    <>
      {/* Intro Video Overlay */}
      <div 
        className={ixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-1000 }
        onClick={() => setIntroFinished(true)}
      >
        <video 
          src="/video.mp4" 
          autoPlay 
          muted 
          playsInline 
          onEnded={() => setIntroFinished(true)}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-8 text-white/50 text-sm tracking-widest hover:text-white cursor-pointer transition-colors z-20">
          Click window to skip
        </div>
        
        {/* Fallback pattern if video isn't loaded or ready */}
        <div className="-z-10 absolute inset-0 flex flex-col items-center justify-center bg-background p-6 text-center text-sm text-muted-foreground">
          <span className="mb-2 font-medium">Video Placeholder</span>
          <span>For your video to appear here, rename it to <strong>video.mp4</strong> and place it in the <strong>public</strong> folder of your project.</span>
        </div>
      </div>

      <section className={elative flex min-h-screen items-center justify-center overflow-hidden pt-20 transition-all duration-1000 }>
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
          backgroundImage: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
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
          <Dialog open={isMintDialogOpen} onOpenChange={setIsMintDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 bg-primary px-8 text-lg hover:bg-primary/90">
                <Sparkles className="h-5 w-5" />
                Mint Your First Hero NFT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Forge a New Hero</DialogTitle>
                <DialogDescription>
                  Name your NFT and choose its base class. Minting costs 0.01 AVAX to be inscribed in history.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Hero Name</Label>
                  <Input id="name" value={heroName} onChange={(e) => setHeroName(e.target.value)} placeholder="Ex: Legendary Warrior" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="class">Base Class</Label>
                  <Select value={heroClass} onValueChange={setHeroClass}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Warrior (+DEF)</SelectItem>
                      <SelectItem value="1">Archer (Balanced)</SelectItem>
                      <SelectItem value="2">Mage (+ATK)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button disabled={isMinting || !heroName} onClick={handleMint} className="w-full">
                {isMinting ? "Signing Transcendental Contract..." : "Mint and Discover Rarity (0.01 AVAX)"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>


      </div>
    </section>
    </>
  )
}
