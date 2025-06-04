"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, Link2 } from "lucide-react";
import { toast } from "sonner";

interface CertificateQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: {
    id: string;
    name: string;
    issuer: string;
  };
}

export function CertificateQrDialog({
  open,
  onOpenChange,
  certificate,
}: CertificateQrDialogProps) {
  const [copied, setCopied] = useState(false);
  
  // In a real app, this would be a real verification URL with the certificate ID
  const verificationUrl = `https://certichain.app/verify/${certificate.id}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    toast.success("Verification link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  
  const downloadQRCode = () => {
    const canvas = document.getElementById('certificate-qr-code');
    if (canvas) {
      // @ts-ignore - canvas is a SVG element in this case
      const svgData = new XMLSerializer().serializeToString(canvas);
      const canvas2 = document.createElement('canvas');
      const ctx = canvas2.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas2.width = img.width;
        canvas2.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas2.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${certificate.name}-QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
    
    toast.success("QR Code downloaded successfully");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Certificate QR Code</DialogTitle>
          <DialogDescription>
            Share this QR code to allow others to verify your {certificate.name} certificate from {certificate.issuer}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center p-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <QRCodeSVG
              id="certificate-qr-code"
              value={verificationUrl}
              size={200}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/logo.png",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <label htmlFor="link" className="sr-only">
              Verification Link
            </label>
            <input
              id="link"
              defaultValue={verificationUrl}
              readOnly
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button
            size="sm"
            type="button"
            onClick={copyToClipboard}
            variant="outline"
            className={copied ? "text-green-500" : ""}
          >
            {copied ? "Copied" : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={downloadQRCode}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
          <Button 
            type="button" 
            className="w-full sm:w-auto"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Create Shareable Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}