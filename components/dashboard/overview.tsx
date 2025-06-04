"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Eye, Share2, Users } from "lucide-react";

export function DashboardOverview() {
  const { connected, publicKey } = useWallet();
  const [isStudent, setIsStudent] = useState(true);
  const [isInstitution, setIsInstitution] = useState(false);
  
  // In a real app, we would fetch role data from an API based on the wallet address
  useEffect(() => {
    if (publicKey) {
      // Mock check for demonstration purposes
      const address = publicKey.toString();
      // This would be replaced with actual role detection logic
      setIsInstitution(address.endsWith('1') || address.endsWith('3') || address.endsWith('5'));
    }
  }, [publicKey]);
  
  if (!connected) {
    return (
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your Solana wallet to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              You need to connect your Solana wallet to access your certificates and manage your identity.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isStudent) {
    return (
      <>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">3</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certificate Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">12</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Shares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Share2 className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">2</div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
  
  if (isInstitution) {
    return (
      <>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Issued Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">156</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certificate Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">892</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">124</div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
  
  return null;
}