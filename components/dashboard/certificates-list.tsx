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
import { Eye, Download, Share2, MoreVertical, QrCode } from "lucide-react";
import { CertificateQrDialog } from "@/components/certificate/qr-dialog";
import { toast } from "sonner";

type Certificate = {
  id: string;
  title: string;
  institution: {
    name: string;
  };
  issueDate: string;
  type: string;
  // Add other fields as needed
};

export function CertificatesList() {
  const { connected, publicKey } = useWallet();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showQrDialog, setShowQrDialog] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!connected || !publicKey) return;

      try {
        const response = await fetch(`/api/certificates?wallet=${publicKey.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch certificates');
        const data = await response.json();
        setCertificates(data.certificates);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        toast.error('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [connected, publicKey]);

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
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <CardDescription>
            Manage and share your academic achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate</TableHead>
                <TableHead>Issuer</TableHead>
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
                  <TableCell>{cert.institution.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{cert.type}</TableCell>
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
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>Share</span>
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