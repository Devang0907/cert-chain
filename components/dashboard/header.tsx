"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const { connected, publicKey } = useWallet();
  const [shortAddress, setShortAddress] = useState("");

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toString();
      setShortAddress(`${address.slice(0, 4)}...${address.slice(-4)}`);
    }
  }, [publicKey]);

  return (
    <header className="h-16 border-b bg-card flex items-center px-6">
      <div className="flex-1 flex items-center">
        <div className="relative w-64 mr-4 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 bg-muted/50 border-none"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">New Certificate Issued</span>
                  <span className="text-xs text-muted-foreground">Stanford University has issued you a new certificate</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">Certificate Viewed</span>
                  <span className="text-xs text-muted-foreground">Your CS Degree certificate was viewed by TechCorp Inc.</span>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ModeToggle />
        
        <WalletMultiButton className="phantom-button" />
      </div>
    </header>
  );
}