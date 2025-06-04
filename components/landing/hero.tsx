"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

export default function LandingHero() {
  const { connected } = useWallet();

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 dark:bg-blue-400/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/20 dark:bg-purple-400/10 rounded-full filter blur-3xl" />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Blockchain-Verified Academic Credentials
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              CertiChain empowers institutions to issue tamper-proof credentials, students to securely share them, and employers to instantly verify authenticity.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              {connected ? (
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <WalletMultiButton className="phantom-button-hero" />
              )}
              <Link href="/verify">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Verify a Certificate
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-lg"></div>
              <div className="relative bg-card rounded-lg shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <div className="text-blue-600 dark:text-blue-400">🎓</div>
                      </div>
                      <div>
                        <p className="font-medium">Stanford University</p>
                        <p className="text-xs text-muted-foreground">Verified Issuer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <div className="text-green-600 dark:text-green-400">✓</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold">Master of Computer Science</h3>
                        <p className="text-sm text-muted-foreground">Awarded to</p>
                        <p className="text-lg font-medium">Alex Johnson</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="w-24 h-24 bg-blue-50">
                          <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-2">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div key={i} className={`rounded-sm ${i % 3 === 0 ? 'bg-blue-900' : 'bg-transparent'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Issue Date</p>
                          <p className="font-medium">June 15, 2024</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Credential ID</p>
                          <p className="font-medium">CS-2024-8716</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div>🔗</div>
                        <span>Verified on Solana blockchain</span>
                        <span>•</span>
                        <span>0x7e5f...4a3b</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}