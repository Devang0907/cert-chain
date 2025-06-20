"use client";

import { CheckCircle, XCircle, ExternalLink, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface VerificationResultProps {
  result: {
    valid: boolean;
    certificate: {
      id: string;
      title: string;
      type: string;
      mintAddress: string;
      issueDate: string;
      institution: {
        name: string;
        verified?: boolean;
      };
      recipient: {
        name: string;
        walletAddress: string;
      };
      issuer: {
        name: string;
        walletAddress: string;
      };
      metadata: any;
    };
  };
}

export function VerificationResult({ result }: VerificationResultProps) {
  const { valid, certificate } = result;
  
  return (
    <div>
      <div className="mb-8 text-center">
        {valid ? (
          <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
          </div>
        )}
        
        <h2 className="text-3xl font-bold mb-2">
          {valid ? "Certificate Verified" : "Invalid Certificate"}
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {valid
            ? "This academic credential has been verified on the blockchain and is authentic."
            : "We could not verify this certificate on the blockchain. It may be invalid or tampered with."}
        </p>
      </div>
      
      {valid && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{certificate.title}</CardTitle>
                <CardDescription>Issued to {certificate.recipient.name}</CardDescription>
              </div>
              <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Verified on blockchain</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Certificate Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Issuing Institution</p>
                  <p className="font-medium">{certificate.institution.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Certificate Type</p>
                  <p className="font-medium">{certificate.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Recipient Wallet</p>
                  <p className="font-medium font-mono text-sm">{certificate.recipient.walletAddress}</p>
                </div>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="metadata">
                <AccordionTrigger>Certificate Metadata</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificate.metadata?.attributes?.map((attr: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <p className="text-sm text-muted-foreground">{attr.trait_type}</p>
                        <p className="font-medium">{attr.value}</p>
                        {attr.encrypted && (
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            Encrypted
                          </span>
                        )}
                      </div>
                    ))}
                    {certificate.metadata?.description && (
                      <div className="md:col-span-2 space-y-1">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">{certificate.metadata.description}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="blockchain">
                <AccordionTrigger>Blockchain Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Mint Address (NFT)</p>
                      <p className="font-medium font-mono text-sm break-all">{certificate.mintAddress}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Network</p>
                      <p className="font-medium">{certificate.metadata?.network || 'Solana Devnet'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="font-medium font-mono text-sm break-all">
                        {certificate.metadata?.solanaTransaction || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Verification Status</p>
                      <p className="font-medium text-green-600">
                        {certificate.metadata?.blockchainVerified ? 'Verified on Blockchain' : 'Pending Verification'}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        const explorerUrl = `https://explorer.solana.com/address/${certificate.mintAddress}?cluster=devnet`;
                        window.open(explorerUrl, '_blank');
                      }}>
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        View on Solana Explorer
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button className="w-full sm:w-auto">
              Download Certificate
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Contact Issuer
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}