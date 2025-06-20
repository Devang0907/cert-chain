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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState({
    certificates: 0,
    views: 0,
    shares: 0,
    recipients: 0
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!connected || !publicKey) return;

      try {
        const response = await fetch(`/api/users?wallet=${publicKey.toString()}`);
        if (response.ok) {
          const userData = await response.json();
          if (userData) {
            setUserRole(userData.role);
            
            // Set mock stats based on role
            if (userData.role === 'STUDENT') {
              setStats({
                certificates: userData.receivedCertificates?.length || 0,
                views: Math.floor(Math.random() * 50) + 10,
                shares: Math.floor(Math.random() * 10) + 1,
                recipients: 0
              });
            } else if (userData.role === 'INSTITUTION') {
              setStats({
                certificates: userData.issuedCertificates?.length || 0,
                views: Math.floor(Math.random() * 500) + 100,
                shares: 0,
                recipients: userData.issuedCertificates?.length || 0
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [connected, publicKey]);
  
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
  
  if (userRole === 'STUDENT') {
    return (
      <>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.certificates}</div>
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
              <div className="text-2xl font-bold">{stats.views}</div>
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
              <div className="text-2xl font-bold">{stats.shares}</div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
  
  if (userRole === 'INSTITUTION') {
    return (
      <>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Issued Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.certificates}</div>
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
              <div className="text-2xl font-bold">{stats.views}</div>
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
              <div className="text-2xl font-bold">{stats.recipients}</div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
  
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Welcome to CertiChain</CardTitle>
        <CardDescription>
          Complete your profile to get started
        </CardDescription>
      </CardHeader>
    </Card>
  );
}