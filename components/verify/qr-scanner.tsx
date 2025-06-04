"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, RefreshCw } from "lucide-react";

interface QrScannerProps {
  onResult: (result: string) => void;
  isVerifying: boolean;
}

export function QrScanner({ onResult, isVerifying }: QrScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  
  // In a real app, we would use a library like 'react-qr-reader'
  // For this demo, we'll simulate scanning
  
  const startScanning = () => {
    setScanning(true);
    setCameraError(false);
    
    // Simulate camera access and scanning
    setTimeout(() => {
      // 20% chance of camera error to demonstrate error handling
      if (Math.random() > 0.8) {
        setCameraError(true);
        setScanning(false);
        return;
      }
      
      // Simulate successful scan
      const mockCertificateId = "cert-" + Math.random().toString(36).substring(2, 8);
      onResult(mockCertificateId);
      setScanning(false);
    }, 3000);
  };
  
  const simulateFileUpload = () => {
    // Simulate file processing
    setTimeout(() => {
      const mockCertificateId = "cert-" + Math.random().toString(36).substring(2, 8);
      onResult(mockCertificateId);
    }, 1000);
  };
  
  if (cameraError) {
    return (
      <div className="text-center p-8 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Could not access camera. Please allow camera access or use a different method.
        </p>
        <div className="flex justify-center space-x-2">
          <Button onClick={() => setCameraError(false)} variant="outline">
            Try Again
          </Button>
          <Button onClick={simulateFileUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload QR Image
          </Button>
        </div>
      </div>
    );
  }
  
  if (scanning) {
    return (
      <div className="relative max-w-md mx-auto">
        <div className="aspect-square bg-black rounded-lg overflow-hidden">
          {/* This would be a video feed in a real app */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-2 border-green-500 rounded-lg"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-1 bg-green-500 animate-pulse opacity-50"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <p className="bg-black/70 px-3 py-1 rounded text-sm">
              Scanning...
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="mt-4 mx-auto block"
          onClick={() => setScanning(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="space-y-4">
        <Button
          onClick={startScanning}
          disabled={isVerifying}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </>
          )}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={simulateFileUpload}
          disabled={isVerifying}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload QR Image
        </Button>
      </div>
    </div>
  );
}