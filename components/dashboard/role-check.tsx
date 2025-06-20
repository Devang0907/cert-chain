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
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RoleCheck() {
  const { connected, publicKey } = useWallet();
  const [hasRole, setHasRole] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [institutionId, setInstitutionId] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionWebsite, setInstitutionWebsite] = useState("");

  useEffect(() => {
    const checkRole = async () => {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users?wallet=${publicKey.toString()}`);
        const data = await response.json();
        setHasRole(!!data?.role);
      } catch (error) {
        console.error("Error checking role:", error);
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [connected, publicKey]);

  const handleRoleSelection = async (role: string) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const body: any = {
        walletAddress: publicKey.toString(),
        role,
      };

      // For institution role, we need to create the institution first
      if (role === "INSTITUTION") {
        if (!institutionName.trim()) {
          toast.error("Institution name is required");
          return;
        }

        // Create institution first
        const institutionResponse = await fetch("/api/institutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: institutionName,
            website: institutionWebsite || undefined,
            adminWalletAddress: publicKey.toString(),
          }),
        });

        if (!institutionResponse.ok) {
          const errorData = await institutionResponse.json();
          throw new Error(errorData.error || "Failed to create institution");
        }

        const institution = await institutionResponse.json();
        body.institutionId = institution.id;
        body.name = institutionName;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to set role");
      }

      setHasRole(true);
      setIsDialogOpen(false);
      setInstitutionId("");
      setInstitutionName("");
      setInstitutionWebsite("");
      toast.success("Profile created successfully!");
    } catch (error: any) {
      console.error("Error setting role:", error);
      toast.error(error.message || "Failed to update role");
    }
  };

  if (!connected || loading || hasRole) {
    return null;
  }

  return (
    <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <CardTitle>Complete Your Profile</CardTitle>
        </div>
        <CardDescription>
          You need to select your role to fully use CertiChain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Are you an educational institution issuing certificates, a student
          receiving certificates, or an employer verifying certificates?
        </p>
        <div className="flex flex-wrap gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">I'm an Institution</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register Institution</DialogTitle>
                <DialogDescription>
                  Please provide your institution details to register.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="institutionName" className="text-right">
                    Institution Name *
                  </Label>
                  <Input
                    id="institutionName"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Stanford University"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="institutionWebsite" className="text-right">
                    Website
                  </Label>
                  <Input
                    id="institutionWebsite"
                    value={institutionWebsite}
                    onChange={(e) => setInstitutionWebsite(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., stanford.edu"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => handleRoleSelection("INSTITUTION")}
                  disabled={!institutionName.trim()}
                >
                  Register Institution
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={() => handleRoleSelection("STUDENT")}
          >
            I'm a Student
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRoleSelection("EMPLOYER")}
          >
            I'm an Employer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}