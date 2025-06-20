"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { VerificationResult } from "@/components/verify/verification-result";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SharedCertificatePage() {
  const params = useParams();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyShare = async () => {
      if (!token) return;

      try {
        const response = await fetch(`/api/verify/${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to verify certificate');
          return;
        }

        setResult(data);
      } catch (err) {
        console.error('Error verifying share:', err);
        setError('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    verifyShare();
  }, [token]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying certificate...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/verify">
              <Button variant="outline">Try Another Certificate</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This certificate was shared by {result.sharedBy?.name || 'a user'} on{' '}
            {new Date(result.shareInfo.createdAt).toLocaleDateString()}
            {result.shareInfo.accessedAt && (
              <span> • Last accessed: {new Date(result.shareInfo.accessedAt).toLocaleDateString()}</span>
            )}
          </p>
        </div>
        
        <VerificationResult result={result} />
        
        <div className="mt-8 text-center">
          <Link href="/verify">
            <Button variant="outline">Verify Another Certificate</Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}