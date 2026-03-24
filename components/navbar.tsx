"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Wallet } from "lucide-react"
import { useState } from "react"
import { useWeb3 } from "@/hooks/useWeb3"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { address, connectWallet, isWrongNetwork, switchToFuji } = useWeb3()

  const navLinks = [
    { name: "My Inventory", href: "#inventory" },
    { name: "Battle Arena", href: "#arena" },
    { name: "Subnet Roadmap", href: "#roadmap" },
    { name: "Docs", href: "#docs" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="AVAX Logo" className="h-10 w-auto object-contain rounded-lg" />
          <span className="text-lg font-bold tracking-tight">AVAX Battle</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Connect Wallet Button */}
        <div className="hidden md:flex">
          {isWrongNetwork ? (
            <Button onClick={switchToFuji} variant="destructive" className="gap-2">
              Switch to Fuji
            </Button>
          ) : address ? (
            <Button variant="outline" className="gap-2 font-mono">
              <Wallet className="h-4 w-4" />
              {address.slice(0, 6)}...{address.slice(-4)}
            </Button>
          ) : (
            <Button onClick={connectWallet} className="gap-2 bg-primary hover:bg-primary/90">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isWrongNetwork ? (
              <Button onClick={switchToFuji} variant="destructive" className="mt-2 w-full gap-2">
                Switch to Fuji
              </Button>
            ) : address ? (
              <Button variant="outline" className="mt-2 w-full gap-2 font-mono">
                <Wallet className="h-4 w-4" />
                {address.slice(0, 6)}...{address.slice(-4)}
              </Button>
            ) : (
              <Button onClick={() => { connectWallet(); setMobileMenuOpen(false); }} className="mt-2 w-full gap-2 bg-primary hover:bg-primary/90">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
