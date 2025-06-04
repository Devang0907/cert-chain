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
      name: string;
      issuer: {
        name: string;
        verified: boolean;
      };
      recipient: string;
      issueDate: string;
      metadata: Record<string, string>;
      blockchain: {
        network: string;
        transactionId: string;
        timestamp: string;
      };
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
                <CardTitle className="text-2xl">{certificate.name}</CardTitle>
                <CardDescription>Issued to {certificate.recipient}</CardDescription>
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
                  <p className="font-medium">{certificate.issuer.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Certificate ID</p>
                  <p className="font-medium">{certificate.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Blockchain</p>
                  <p className="font-medium">{certificate.blockchain.network}</p>
                </div>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="metadata">
                <AccordionTrigger>Certificate Metadata</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(certificate.metadata).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="blockchain">
                <AccordionTrigger>Blockchain Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="font-medium font-mono text-sm break-all">{certificate.blockchain.transactionId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Timestamp</p>
                      <p className="font-medium">{new Date(certificate.blockchain.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm">
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