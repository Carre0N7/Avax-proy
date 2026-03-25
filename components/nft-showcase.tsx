"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sword, Shield, Wand2, Activity, Lock, Flame, Droplet, Mountain, Zap, Moon, Sun, Trees } from "lucide-react"
import { useWeb3 } from "@/hooks/useWeb3"

const gachaHeroes = [
  { heroType: 0, name: "Sylas", class: "Wood Golem", rarity: "Mythic", rarityColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", videoSrc: "/heroes/Sylas.mp4", icon: Trees, color: "from-emerald-500/40 to-emerald-900/20", glowPattern: "shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]", animation: "animate-breathe-heavy", accentColor: "text-emerald-400" },
  { heroType: 1, name: "Ignis", class: "Fire Demon", rarity: "Mythic", rarityColor: "text-orange-400 border-orange-500/30 bg-orange-500/10", videoSrc: "/heroes/Ignis.mp4", icon: Flame, color: "from-orange-500/40 to-orange-900/20", glowPattern: "shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]", animation: "animate-breathe-fast", accentColor: "text-orange-400" },
  { heroType: 2, name: "Aethelgard", class: "Radiant Wing", rarity: "Legendary", rarityColor: "text-amber-300 border-amber-400/30 bg-amber-400/10", videoSrc: "/heroes/Aethelgard.mp4", icon: Sun, color: "from-yellow-400/40 to-yellow-900/20", glowPattern: "shadow-[0_0_50px_-5px_rgba(250,204,21,0.6)]", animation: "animate-float-hero", accentColor: "text-amber-300" },
  { heroType: 3, name: "Noctis", class: "Shadow Reaper", rarity: "Legendary", rarityColor: "text-red-600 border-red-600/30 bg-red-600/10", videoSrc: "/heroes/Noctis.mp4", icon: Moon, color: "from-purple-900/50 to-black/50", glowPattern: "shadow-[0_0_40px_-10px_rgba(153,27,27,0.5)]", animation: "animate-float-hero", accentColor: "text-red-600" },
  { heroType: 4, name: "Thalassa", class: "Tidecaller", rarity: "Epic", rarityColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", videoSrc: "/heroes/Thalassa.mp4", icon: Droplet, color: "from-cyan-500/40 to-cyan-900/20", glowPattern: "shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]", animation: "animate-float-hero", accentColor: "text-cyan-400" },
  { heroType: 5, name: "Voltz", class: "Volt-Knight", rarity: "Epic", rarityColor: "text-blue-400 border-blue-500/30 bg-blue-500/10", videoSrc: "/heroes/Voltz.mp4", icon: Zap, color: "from-blue-500/40 to-blue-900/20", glowPattern: "shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]", animation: "animate-breathe-fast", accentColor: "text-blue-400" },
  { heroType: 6, name: "Krag", class: "Stone Monolith", rarity: "Rare", rarityColor: "text-slate-400 border-slate-500/30 bg-slate-500/10", videoSrc: "/heroes/Krag.mp4", icon: Mountain, color: "from-slate-500/40 to-slate-900/20", glowPattern: "shadow-[0_0_40px_-10px_rgba(100,116,139,0.5)]", animation: "animate-breathe-heavy", accentColor: "text-slate-400" },
  { heroType: 7, name: "Zyra", class: "Voidweaver", rarity: "Mythic", rarityColor: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10", videoSrc: "/heroes/Zyra.mp4", icon: Wand2, color: "from-fuchsia-500/40 to-fuchsia-900/20", glowPattern: "shadow-[0_0_40px_-10px_rgba(217,70,239,0.5)]", animation: "animate-float-hero", accentColor: "text-fuchsia-400" },
];

interface Hero {
  id: number;
  level: number;
  attack: number;
  defense: number;
  heroType: number;
  exp: number;
  name: string;
}

export function NFTShowcase() {
  const { address, contract, isWrongNetwork, connectWallet } = useWeb3();
  const [myHeroes, setMyHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trainingId, setTrainingId] = useState<number | null>(null);

  // Teaser Carousel State
  const [activeIndex, setActiveIndex] = useState(1);

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
              heroType: Number(stats.heroType),
              exp: Number(stats.exp),
              name: stats.name
            });
          }
        } catch (e) {
          // Token doesn't exist, we can stop iterating
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
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % gachaHeroes.length);
      }, 4000);
      return () => clearInterval(interval);
    }
    fetchHeroes();
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
      alert("Hubo un error al entrenar el héroe. Puede que te falte saldo o rechazaste la tx.");
    }
    setTrainingId(null);
  };

  return (
    <section id="inventory" className="relative py-24 bg-background overflow-hidden">
      <style>{`
        @keyframes float-hero {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes breathe-heavy {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02) translateY(-2px); }
        }
        @keyframes breathe-fast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03) translateY(-4px); }
        }
        .animate-float-hero {
          animation: float-hero 5s ease-in-out infinite;
        }
        .animate-breathe-heavy {
          animation: breathe-heavy 6s ease-in-out infinite;
        }
        .animate-breathe-fast {
          animation: breathe-fast 3s ease-in-out infinite;
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
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {!address 
              ? "Prueba conectando tu billetera para revelar los héroes que has minteado."
              : isLoading 
                ? "Buscando tus héroes en la Fuji Testnet..."
                : myHeroes.length === 0
                  ? "Aún no tienes héroes. ¡Sube y mintea el primero mediante el botón principal!"
                  : `¡Gran colección! Tienes ${myHeroes.length} héroes a tu nombre.`}
          </p>
        </div>

        {!address ? (
          /* AAA Premium Teaser State (Unconnected) */
          <div className="relative mt-12 flex flex-col items-center">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

            {/* Carousel Container */}
            <div style={{ perspective: '1200px' }} className="relative flex h-[500px] w-full max-w-5xl items-center justify-center">
              {gachaHeroes.map((hero, idx) => {
                const total = gachaHeroes.length;
                const isCenter = idx === activeIndex;
                const dist = (idx - activeIndex + total) % total;
                const isLeft = dist === total - 1;
                const isRight = dist === 1;

                let transform = 'scale(0.5) translateY(40px) translateZ(-200px)';
                let opacity = 0;
                let zIndex = 0;
                let filter = 'blur(10px) brightness(0.2)';

                if (isCenter) {
                  transform = 'scale(1.0) translateX(0) translateZ(80px)';
                  opacity = 1;
                  zIndex = 20;
                  filter = 'blur(0px) brightness(1.1)';
                } else if (isLeft) {
                  transform = 'scale(0.7) translateX(-90%) rotateY(20deg) translateZ(-60px)';
                  opacity = 0.5;
                  zIndex = 10;
                  filter = 'blur(4px) brightness(0.5)';
                } else if (isRight) {
                  transform = 'scale(0.7) translateX(90%) rotateY(-20deg) translateZ(-60px)';
                  opacity = 0.5;
                  zIndex = 10;
                  filter = 'blur(4px) brightness(0.5)';
                }

                const Icon = hero.icon;

                return (
                  <div
                    key={hero.heroType}
                    style={{ transform, opacity, zIndex, filter }}
                    className="absolute transition-all duration-1000 ease-out w-[260px]"
                  >
                    <div className={hero.animation}>
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
                              <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                              
                              {/* Fallback Icon */}
                              <Icon className="absolute z-10 h-32 w-32 text-white/10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-1000" />
                              
                              {/* Video Layer */}
                              {hero.videoSrc && (
                                <video
                                  src={hero.videoSrc}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="absolute inset-0 z-20 h-full w-full object-cover opacity-90 transition-opacity duration-1000 hover:opacity-100"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              
                              <div className="absolute bottom-0 z-30 h-1/3 w-full bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                           </div>
                           <h3 className="text-center text-2xl font-black uppercase tracking-tighter text-white drop-shadow-md">{hero.name}</h3>
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
                Connect wallet to reveal your heroes
              </Button>
            </div>
          </div>
        ) : (
          /* Real Owned Heroes State (Connected) */
          <div className="grid gap-6 md:grid-cols-3">
            {myHeroes.map((hero) => {
              const theme = gachaHeroes[hero.heroType] || gachaHeroes[0];
              const Icon = theme.icon;

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
                    <div className="mb-6 flex aspect-[3/4] items-center justify-center rounded-xl border border-border/50 bg-black/50 overflow-hidden relative group-hover:border-primary/50 transition-colors">
                      {/* Particles / Atmosphere Hint */}
                      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                      
                      {/* Fallback Icon */}
                      <Icon className={`absolute z-10 h-32 w-32 ${theme.accentColor} opacity-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-1000`} />

                      {/* Video Layer */}
                      {theme.videoSrc && (
                        <video
                          src={theme.videoSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 z-20 h-full w-full object-cover opacity-90 transition-opacity duration-1000 hover:opacity-100"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      
                      <div className="absolute bottom-0 z-30 h-1/3 w-full bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Character Info */}
                    <div className="space-y-2">
                       <h3 className="text-xl font-bold">{hero.name || `Avax Hero #${hero.id}`}</h3>
                       <p className="text-sm text-muted-foreground">{theme.class}</p>
                    </div>

                    {/* Experience Bar */}
                    <div className="my-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>XP</span>
                        <span>{hero.exp}/100</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${hero.exp}%` }}></div>
                      </div>
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
                        <span className="animate-pulse">Training... (Wait)</span>
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
