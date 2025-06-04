"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CertificatesList } from "@/components/dashboard/certificates-list";
import { Share2, Mail, Link, Clock } from "lucide-react";
import { toast } from "sonner";

export default function SharePage() {
  const [email, setEmail] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [includePrivate, setIncludePrivate] = useState(false);
  
  const handleShare = async () => {
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          expiryDays: parseInt(expiryDays),
          includePrivate,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to share certificates");
      
      toast.success("Share link sent successfully!");
      setEmail("");
    } catch (error) {
      console.error("Error sharing certificates:", error);
      toast.error("Failed to share certificates");
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Share Certificates</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Selected Certificates</CardTitle>
            <CardDescription>Choose which certificates to share</CardDescription>
          </CardHeader>
          <CardContent>
            <CertificatesList />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Settings</CardTitle>
              <CardDescription>Configure how to share your certificates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Recipient Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="recipient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry">Link Expiry (Days)</Label>
                  <Input
                    id="expiry"
                    type="number"
                    min="1"
                    max="30"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="private">Include Private Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Share encrypted metadata
                    </p>
                  </div>
                  <Switch
                    id="private"
                    checked={includePrivate}
                    onCheckedChange={setIncludePrivate}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Button onClick={handleShare} className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Link className="mr-2 h-4 w-4" />
                  Generate Link
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Shares</CardTitle>
              <CardDescription>Previously shared certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Share2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Shared with TechCorp Inc.</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Share2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Shared with Global HR</p>
                    <p className="text-xs text-muted-foreground">5 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}