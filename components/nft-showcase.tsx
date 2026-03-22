"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sword, Shield, Wand2, Activity } from "lucide-react"
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

interface Hero {
  id: number;
  level: number;
  attack: number;
  defense: number;
}

export function NFTShowcase() {
  const { address, contract, isWrongNetwork } = useWeb3();
  const [myHeroes, setMyHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trainingId, setTrainingId] = useState<number | null>(null);

  const fetchHeroes = async () => {
    if (!contract || !address || isWrongNetwork) return;
    setIsLoading(true);
    try {
      const ownedHeroes = [];
      // Buscar iterando (estrategia sencilla de lectura para MVP sin extension Enumerable)
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
          // El contrato revertirá si el token no existe, así que paramos el loop
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
    fetchHeroes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract, isWrongNetwork]);

  const trainHero = async (tokenId: number) => {
    if (!contract) return;
    setTrainingId(tokenId);
    try {
      const tx = await contract.entrenarHeroe(tokenId);
      await tx.wait(); // Esperar confirmación
      alert("¡Héroe entrenado exitosamente! Sus stats han subido on-chain.");
      fetchHeroes(); // Refrescar los stats para ver los cambios
    } catch (err) {
      console.error("Error entrenando:", err);
      alert("Hubo un error al entrenar el héroe. Puede que te falte saldo en la C-Chain para el gas o rechasaste la transacción.");
    }
    setTrainingId(null);
  };

  return (
    <section id="inventory" className="relative py-24">
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Tu Inventario
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Tus Héroes Coleccionados
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {!address 
              ? "Prueba conectando tu billetera para revelar los héroes que has minteado."
              : isLoading 
                ? "Buscando tus héroes en la Fuji Testnet..."
                : myHeroes.length === 0
                  ? "Aún no tienes héroes. ¡Sube y mintea el primero mediante el botón principal!"
                  : `Gran colección! Tienes ${myHeroes.length} héroes a tu nombre.`}
          </p>
        </div>

        {/* NFT Cards Grid */}
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
      </div>
    </section>
  )
}
