"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function RoleCheck() {
  const { connected, publicKey } = useWallet();
  const [hasRole, setHasRole] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkRole = async () => {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/users?wallet=${publicKey.toString()}`);
        const data = await response.json();
        setHasRole(!!data?.role);
      } catch (error) {
        console.error("Error checking role:", error);
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkRole();
  }, [connected, publicKey]);

  const handleRoleSelection = async (role: string) => {
    if (!connected || !publicKey) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          role,
        }),
      });

      if (!response.ok) throw new Error('Failed to set role');

      setHasRole(true);
      toast.success('Role updated successfully');
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Failed to update role');
    }
  };
  
  if (!connected || loading || hasRole) {
    return null;
  }
  
  return (
    <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <CardTitle>Complete Your Profile</CardTitle>
        </div>
        <CardDescription>
          You need to select your role to fully use CertiChain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Are you an educational institution issuing certificates, a student receiving certificates, or an employer verifying certificates?
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => handleRoleSelection('INSTITUTION')}>
            I'm an Institution
          </Button>
          <Button variant="outline" onClick={() => handleRoleSelection('STUDENT')}>
            I'm a Student
          </Button>
          <Button variant="outline" onClick={() => handleRoleSelection('EMPLOYER')}>
            I'm an Employer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}