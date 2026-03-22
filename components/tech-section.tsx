import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layers, Zap, CheckCircle2 } from "lucide-react"

export function TechSection() {
  return (
    <section id="roadmap" className="relative py-24">
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Architecture
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Visualizing the Tech
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Our roadmap to full decentralization and dedicated infrastructure
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Current Stage */}
          <Card className="relative border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Layers className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Current Stage (MVP)</CardTitle>
                <Badge variant="secondary" className="text-xs">Live</Badge>
              </div>
              <CardDescription className="text-muted-foreground">
                Running on Avalanche C-Chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Fuji Testnet deployment",
                  "Standard gas fees",
                  "High EVM compatibility",
                  "Shared network resources"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Card 2: Next Phase (Highlighted) */}
          <Card className="relative border-primary/50 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm transition-all hover:border-primary/70">
            {/* Glow Effect */}
            <div className="pointer-events-none absolute -inset-px rounded-lg bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
            
            <CardHeader className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Next Phase (Roadmap)</CardTitle>
                <Badge className="bg-primary text-xs text-primary-foreground">Coming Soon</Badge>
              </div>
              <CardDescription className="text-foreground/80">
                Custom L1 Subnet Deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-3">
                {[
                  "Dedicated throughput",
                  "Gas paid in $AQ token",
                  "Isolated gaming traffic",
                  "Customizable parameters"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
