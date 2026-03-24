import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Swords, Trophy, Wallet, Sword, Shield, Wand2 } from "lucide-react"

export function DashboardMockup() {
  return (
    <section id="arena" className="relative py-24">
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Game Dashboard
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Your Battle Station
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Manage your heroes, track battles, and monitor your earnings
          </p>
        </div>

        {/* Dashboard Wireframe */}
        <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AVAX Logo" className="h-8 w-8 rounded-lg object-contain" />
              <span className="font-semibold">Player Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* My NFTs Panel */}
              <Card className="border-border/50 bg-muted/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Swords className="h-4 w-4 text-primary" />
                    My NFTs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: Sword, name: "Avax Warrior", level: "Lvl 12" },
                    { icon: Shield, name: "Chain Hunter", level: "Lvl 8" },
                    { icon: Wand2, name: "Subnet Wizard", level: "Lvl 5" },
                  ].map((nft) => {
                    const Icon = nft.icon
                    return (
                      <div 
                        key={nft.name}
                        className="flex items-center gap-3 rounded-lg bg-background/50 p-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{nft.name}</div>
                          <div className="text-xs text-muted-foreground">{nft.level}</div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Recent Battles Panel */}
              <Card className="border-border/50 bg-muted/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Trophy className="h-4 w-4 text-primary" />
                    Recent Battles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { result: "Victory", opponent: "vs DarkMage99", reward: "+15 $AVAX", win: true },
                    { result: "Victory", opponent: "vs ChainLord", reward: "+12 $AVAX", win: true },
                    { result: "Defeat", opponent: "vs SubnetKing", reward: "-5 $AVAX", win: false },
                  ].map((battle, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-background/50 p-3"
                    >
                      <div>
                        <div className={`text-sm font-medium ${battle.win ? "text-green-400" : "text-red-400"}`}>
                          {battle.result}
                        </div>
                        <div className="text-xs text-muted-foreground">{battle.opponent}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={battle.win 
                          ? "border-green-500/30 bg-green-500/10 text-green-400" 
                          : "border-red-500/30 bg-red-500/10 text-red-400"
                        }
                      >
                        {battle.reward}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Token Balance Panel */}
              <Card className="border-border/50 bg-muted/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wallet className="h-4 w-4 text-primary" />
                    Token Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-transparent p-6">
                    <div className="text-sm text-muted-foreground">$AVAX Balance</div>
                    <div className="text-3xl font-bold text-primary">2,450.00</div>
                    <div className="mt-1 text-xs text-muted-foreground">≈ $1,225 USD</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Staked</span>
                      <span className="font-medium">1,000 $AVAX</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rewards</span>
                      <span className="font-medium text-green-400">+45 $AVAX</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
