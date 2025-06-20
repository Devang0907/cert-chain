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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Share2, MoreVertical, QrCode, Copy } from "lucide-react";
import { CertificateQrDialog } from "@/components/certificate/qr-dialog";
import { toast } from "sonner";

type Certificate = {
  id: string;
  title: string;
  type: string;
  issueDate: string;
  mintAddress: string;
  institution: {
    name: string;
  };
  recipient?: {
    name: string;
    walletAddress: string;
  };
  issuer?: {
    name: string;
    walletAddress: string;
  };
};

export function CertificatesList() {
  const { connected, publicKey } = useWallet();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching certificates for wallet:', publicKey.toString());
        
        const response = await fetch(`/api/certificates?wallet=${publicKey.toString()}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch certificates: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Certificates data:', data);
        
        setCertificates(data.certificates || []);
        
        // Also fetch user role
        const userResponse = await fetch(`/api/users?wallet=${publicKey.toString()}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserRole(userData?.role);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
        toast.error('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [connected, publicKey]);

  const handleShare = async (certificate: Certificate) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      // Get user ID first
      const userResponse = await fetch(`/api/users?wallet=${publicKey.toString()}`);
      if (!userResponse.ok) {
        throw new Error("Failed to get user data");
      }
      const userData = await userResponse.json();

      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
          certificateId: certificate.id,
          expiryDays: 30,
          includePrivate: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create share link");
      }

      const shareData = await response.json();
      
      // Copy share URL to clipboard
      await navigator.clipboard.writeText(shareData.shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      console.error("Error creating share:", error);
      toast.error("Failed to create share link");
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <CardDescription>Connect your wallet to view your certificates</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <CardDescription>Loading your certificates...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading certificates...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <CardDescription>
            {userRole === 'STUDENT' 
              ? "You haven't received any certificates yet" 
              : "You haven't issued any certificates yet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {userRole === 'STUDENT' 
                ? "When institutions issue certificates to your wallet address, they will appear here."
                : "Start issuing certificates to students to see them listed here."}
            </p>
            {userRole === 'INSTITUTION' && (
              <Button asChild>
                <a href="/dashboard/issue">Issue Your First Certificate</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <CardDescription>
            {userRole === 'STUDENT' 
              ? "Manage and share your academic achievements" 
              : "Certificates you have issued"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate</TableHead>
                <TableHead>{userRole === 'STUDENT' ? 'Issuer' : 'Recipient'}</TableHead>
                <TableHead className="hidden md:table-cell">Issue Date</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.title}</TableCell>
                  <TableCell>
                    {userRole === 'STUDENT' 
                      ? cert.institution.name 
                      : cert.recipient?.name || cert.recipient?.walletAddress}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{cert.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-300 dark:border-green-800">
                      Valid
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedCertificate(cert);
                          setShowQrDialog(true);
                        }}>
                          <QrCode className="mr-2 h-4 w-4" />
                          <span>Show QR Code</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(cert)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>Create Share Link</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          navigator.clipboard.writeText(cert.mintAddress);
                          toast.success("Mint address copied to clipboard!");
                        }}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Copy Mint Address</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedCertificate && (
        <CertificateQrDialog 
          open={showQrDialog}
          onOpenChange={setShowQrDialog}
          certificate={{
            id: selectedCertificate.id,
            name: selectedCertificate.title,
            issuer: selectedCertificate.institution.name,
          }}
        />
      )}
    </>
  );
}