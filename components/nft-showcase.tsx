"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sword, Shield, Wand2, Activity, Lock } from "lucide-react"
import { useWeb3 } from "@/hooks/useWeb3"

const visualThemes = [
  {
    class: "Melee Fighter",
    rarity: "Legendary",
    rarityColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: Sword,
    color: "from-amber-500/20 to-transparent",
    accentColor: "text-amber-400",
  },
  {
    class: "Ranged Assassin",
    rarity: "Epic",
    rarityColor: "bg-primary/20 text-primary border-primary/30",
    icon: Shield,
    color: "from-primary/20 to-transparent",
    accentColor: "text-primary",
  },
  {
    class: "Magic Caster",
    rarity: "Rare",
    rarityColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    icon: Wand2,
    color: "from-sky-500/20 to-transparent",
    accentColor: "text-sky-400",
  },
]

const teaserHeroes = [
  { id: 1, class: "Melee Fighter", rarity: "Legendary", rarityColor: "text-amber-400 border-amber-500/30 bg-amber-500/10", icon: Sword, color: "from-amber-500/20 to-transparent", glowPattern: "shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)]" },
  { id: 2, class: "Ranged Assassin", rarity: "Epic", rarityColor: "text-red-400 border-red-500/30 bg-red-500/10", icon: Shield, color: "from-red-500/20 to-transparent", glowPattern: "shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]" },
  { id: 3, class: "Magic Caster", rarity: "Rare", rarityColor: "text-sky-400 border-sky-500/30 bg-sky-500/10", icon: Wand2, color: "from-sky-500/20 to-transparent", glowPattern: "shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)]" },
]

interface Hero {
  id: number;
  level: number;
  attack: number;
  defense: number;
}

export function NFTShowcase() {
  const { address, contract, isWrongNetwork, connectWallet } = useWeb3();
  const [myHeroes, setMyHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trainingId, setTrainingId] = useState<number | null>(null);
  
  // Teaser Carousel State
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    if (address) return; // Only auto-rotate if wallet is disconnected
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teaserHeroes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [address]);

  const fetchHeroes = async () => {
    if (!contract || !address || isWrongNetwork) return;
    setIsLoading(true);
    try {
      const ownedHeroes = [];
      for (let i = 0; i < 50; i++) {
        try {
          const owner = await contract.ownerOf(i);
          if (owner.toLowerCase() === address.toLowerCase()) {
            const stats = await contract.heroes(i);
            ownedHeroes.push({
              id: i,
              level: Number(stats.level),
              attack: Number(stats.attack),
              defense: Number(stats.defense),
            });
          }
        } catch (e) {
          break;
        }
      }
      setMyHeroes(ownedHeroes);
    } catch (err) {
      console.error("Error fetching heroes:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!address || !contract) {
      setMyHeroes([]);
      return;
    }
    fetchHeroes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract, isWrongNetwork]);

  const trainHero = async (tokenId: number) => {
    if (!contract) return;
    setTrainingId(tokenId);
    try {
      const tx = await contract.entrenarHeroe(tokenId);
      await tx.wait();
      alert("¡Héroe entrenado exitosamente! Sus stats han subido on-chain.");
      fetchHeroes();
    } catch (err) {
      console.error("Error entrenando:", err);
      alert("Hubo un error al entrenar el héroe. Puede que te falte saldo en la C-Chain o rechazaste la transacción.");
    }
    setTrainingId(null);
  };

  return (
    <section id="inventory" className="relative py-24 bg-background">
      <style>{`
        @keyframes float-hero {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-hero {
          animation: float-hero 5s ease-in-out infinite;
        }
      `}</style>
      
      {/* Universal Background Gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Tu Inventario
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Tus Héroes Coleccionados
          </h2>
          {address && (
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {isLoading
                ? "Buscando tus héroes en la Fuji Testnet..."
                : myHeroes.length === 0
                  ? "Aún no tienes héroes. ¡Sube y mintea el primero mediante el botón principal!"
                  : `¡Gran colección! Tienes ${myHeroes.length} héroes a tu nombre.`}
            </p>
          )}
        </div>

        {!address ? (
          /* AAA Premium Teaser State (Unconnected) */
          <div className="relative mt-12 flex flex-col items-center">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-primary/15 blur-[100px] rounded-full pointer-events-none" />

            {/* Carousel Container */}
            <div style={{ perspective: '1200px' }} className="relative flex h-[500px] w-full max-w-5xl items-center justify-center">
              {teaserHeroes.map((hero, idx) => {
                const isCenter = idx === activeIndex;
                const isLeft = idx === (activeIndex - 1 + teaserHeroes.length) % teaserHeroes.length;
                const isRight = idx === (activeIndex + 1) % teaserHeroes.length;

                let transform = 'scale(0.7) translateY(20px) translateZ(-100px)';
                let opacity = 0;
                let zIndex = 0;
                let filter = 'blur(10px) brightness(0.5)';
        {/* NFT Cards Grid */}
        {address && (
          <div className="grid gap-6 md:grid-cols-3">
          {myHeroes.map((hero) => {
            const theme = visualThemes[hero.id % visualThemes.length]
            const Icon = theme.icon
            return (
              <Card 
                key={hero.id}
                className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Card Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                
                <CardHeader className="relative flex-row items-center justify-between pb-2">
                  <Badge variant="outline" className={`w-fit ${theme.rarityColor}`}>
                    {theme.rarity}
                  </Badge>
                  <Badge variant="secondary" className="w-fit border-border/50 bg-primary/20 text-primary">
                    Lvl {hero.level}
                  </Badge>
                </CardHeader>

                <CardContent className="relative">
                  {/* Character Icon/Placeholder */}
                  <div className="mb-6 flex aspect-square items-center justify-center rounded-xl border border-border/50 bg-muted/50">
                    <Icon className={`h-24 w-24 ${theme.accentColor} opacity-80`} />
                  </div>

                if (isCenter) {
                  transform = 'scale(1.0) translateX(0) translateZ(80px)';
                  opacity = 1;
                  zIndex = 20;
                  filter = 'blur(0px) brightness(1.1)';
                } else if (isLeft) {
                  transform = 'scale(0.8) translateX(-75%) rotateY(20deg) translateZ(-60px)';
                  opacity = 0.5;
                  zIndex = 10;
                  filter = 'blur(4px) brightness(0.6)';
                } else if (isRight) {
                  transform = 'scale(0.8) translateX(75%) rotateY(-20deg) translateZ(-60px)';
                  opacity = 0.5;
                  zIndex = 10;
                  filter = 'blur(4px) brightness(0.6)';
                }

                const Icon = hero.icon;

                return (
                  <div
                    key={hero.id}
                    style={{ transform, opacity, zIndex, filter }}
                    className="absolute transition-all duration-1000 ease-out w-[260px]"
                  >
                    <div className="animate-float-hero">
                      <Card className={`relative overflow-hidden border-border/20 bg-[#0a0a0a]/90 backdrop-blur-2xl ${isCenter ? hero.glowPattern : ''} border shadow-2xl transition-all duration-1000`}>
                        {/* Inner Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-b ${hero.color} opacity-30`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        
                        {/* Lock Overlay for Teaser */}
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] transition-opacity">
                          <div className="flex flex-col items-center rounded-2xl bg-black/40 border border-white/10 p-6 backdrop-blur-md shadow-2xl">
                            <Lock className="mb-3 h-10 w-10 text-white/40 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                            <span className="text-xs font-bold tracking-[0.3em] text-white/60 uppercase">Unrevealed</span>
                          </div>
                        </div>
                        
                        <CardHeader className="relative z-10 pb-2 pt-6">
                           <Badge variant="outline" className={`w-fit uppercase tracking-wider text-[10px] font-bold ${hero.rarityColor}`}>
                             {hero.rarity}
                           </Badge>
                        </CardHeader>
                        
                        <CardContent className="relative z-10 pb-10">
                           <div className="mb-6 flex aspect-[3/4] items-center justify-center rounded-xl border border-white/10 bg-black/50 overflow-hidden shadow-inner relative group-hover:border-white/20 transition-colors">
                              {/* Particles / Atmosphere Hint */}
                              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                              <Icon className="relative z-10 h-32 w-32 text-white/10 drop-shadow-2xl" />
                              <div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-black/80 to-transparent"></div>
                           </div>
                           <h3 className="text-center text-2xl font-black uppercase tracking-tighter text-white drop-shadow-md">Unknown Hero</h3>
                           <p className="mt-2 text-center text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">{hero.class}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Teaser CTA */}
            <div className="mt-14 relative z-30">
              <Button onClick={connectWallet} size="lg" className="h-16 px-12 text-lg font-bold uppercase tracking-[0.15em] bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_-10px_rgba(220,38,38,0.7)] border border-primary/50 transition-all hover:scale-105 hover:shadow-[0_0_50px_-5px_rgba(220,38,38,0.9)]">
                Conectar wallet para revelar tus héroes
              </Button>
            </div>
          </div>
        ) : (
          /* Real Owned Heroes State (Connected) */
          <div className="grid gap-6 md:grid-cols-3">
            {myHeroes.map((hero) => {
              const theme = visualThemes[hero.id % visualThemes.length]
              const Icon = theme.icon
              return (
                <Card
                  key={hero.id}
                  className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* Card Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-0 transition-opacity group-hover:opacity-100`} />

                  <CardHeader className="relative flex-row items-center justify-between pb-2">
                    <Badge variant="outline" className={`w-fit ${theme.rarityColor}`}>
                      {theme.rarity}
                    </Badge>
                    <Badge variant="secondary" className="w-fit border-border/50 bg-primary/20 text-primary">
                      Lvl {hero.level}
                    </Badge>
                  </CardHeader>

                  <CardContent className="relative">
                    {/* Character Icon/Placeholder */}
                    <div className="mb-6 flex aspect-square items-center justify-center rounded-xl border border-border/50 bg-muted/50">
                      <Icon className={`h-24 w-24 ${theme.accentColor} opacity-80`} />
                    </div>

                    {/* Character Info */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Avax Hero #{hero.id}</h3>
                      <p className="text-sm text-muted-foreground">{theme.class}</p>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="text-xs text-muted-foreground">Attack</div>
                        <div className={`text-lg font-bold ${theme.accentColor}`}>
                          {hero.attack}
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="text-xs text-muted-foreground">Defense</div>
                        <div className={`text-lg font-bold ${theme.accentColor}`}>
                          {hero.defense}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="relative">
                    <Button
                      onClick={() => trainHero(hero.id)}
                      disabled={trainingId === hero.id}
                      className="w-full gap-2 transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {trainingId === hero.id ? (
                        <span className="animate-pulse">Entrenando... (Espera)</span>
                      ) : (
                        <>
                          Entrenar Héroe (+Stats)
                          <Activity className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
                <CardFooter className="relative">
                  <Button 
                    onClick={() => trainHero(hero.id)}
                    disabled={trainingId === hero.id}
                    className="w-full gap-2 transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {trainingId === hero.id ? (
                      <span className="animate-pulse">Entrenando... (Espera)</span>
                    ) : (
                      <>
                        Entrenar Héroe (+Stats)
                        <Activity className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
        )}
      </div>
    </section>
  )
}
