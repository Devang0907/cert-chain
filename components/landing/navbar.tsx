"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { GraduationCap } from "lucide-react";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">CertiChain</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="/verify"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Verify Certificate
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <ModeToggle />
          {connected ? (
            <Link href="/dashboard">
              <Button variant="default">Dashboard</Button>
            </Link>
          ) : (
            <WalletMultiButton className="phantom-button" />
          )}
        </div>
      </div>
    </header>
  );
}