"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrScanner } from "@/components/verify/qr-scanner";
import { VerificationResult } from "@/components/verify/verification-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Search, Wallet } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const [addressInput, setAddressInput] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleVerify = () => {
    if (!addressInput) return;
    
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      // For demo purposes, we'll return a mock result
      // In a real app, this would check the blockchain for the certificate
      setResult({
        valid: true,
        certificate: {
          id: "cert-demo-123",
          name: "Bachelor of Computer Science",
          issuer: {
            name: "Stanford University",
            verified: true,
          },
          recipient: "Alex Johnson",
          issueDate: "2024-05-15",
          metadata: {
            degree: "Bachelor of Science",
            major: "Computer Science",
            gpa: "3.8",
            honors: "Cum Laude"
          },
          blockchain: {
            network: "Solana",
            transactionId: "5rjr7zGTG9hQP3UY7iX5sMhWQJf1XEwT6kyTKK5JgUZxdYjM36smXBG6nLr8Y6ZMc",
            timestamp: "2024-05-15T10:30:00Z"
          }
        }
      });
      setIsVerifying(false);
    }, 2000);
  };
  
  const handleQrResult = (result: string) => {
    // In a real app, this would parse the result from the QR code
    // and extract a verification ID or certificate ID
    setVerificationId(result);
    
    // Then proceed with verification
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setResult({
        valid: true,
        certificate: {
          id: "cert-qr-456",
          name: "Master of Data Science",
          issuer: {
            name: "MIT",
            verified: true,
          },
          recipient: "Jamie Smith",
          issueDate: "2024-02-28",
          metadata: {
            degree: "Master of Science",
            major: "Data Science",
            gpa: "3.9",
            honors: "Magna Cum Laude"
          },
          blockchain: {
            network: "Solana",
            transactionId: "3sNw3RnEWvYyb9Deo8RhkZUj2jV9X3ZfTkE6T1K1JgP2eYxE57smXBG6nLr8Y6Z",
            timestamp: "2024-02-28T14:15:00Z"
          }
        }
      });
      setIsVerifying(false);
    }, 2000);
  };
  
  if (result) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <VerificationResult result={result} />
        
        <div className="mt-8 text-center">
          <Button onClick={() => {
            setResult(null);
            setAddressInput("");
            setVerificationId(null);
          }}>
            Verify Another Certificate
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Verify Academic Credentials</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Instantly verify the authenticity of academic credentials using blockchain technology.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="wallet">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Verify by Wallet Address
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Enter Wallet Address</h2>
            <p className="text-muted-foreground mb-6">
              Enter the Solana wallet address of the certificate holder to verify their credentials.
            </p>
            
            <div className="flex w-full max-w-lg mx-auto space-x-2">
              <Input
                type="text"
                placeholder="Solana wallet address or certificate ID"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleVerify} 
                disabled={!addressInput.length || isVerifying}
                className="w-24"
              >
                {isVerifying ? (
                  <div className="h-4 w-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="qr" className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Scan QR Code</h2>
            <p className="text-muted-foreground mb-6">
              Scan the QR code on the certificate to instantly verify its authenticity.
            </p>
            
            <QrScanner onResult={handleQrResult} isVerifying={isVerifying} />
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-2">
          Are you an institution looking to issue certificates?
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}