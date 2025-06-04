"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Building2, CheckCircle, XCircle } from "lucide-react";

export default function InstitutionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock institutions data
  const institutions = [
    {
      id: "1",
      name: "Stanford University",
      website: "stanford.edu",
      verified: true,
      certificatesIssued: 1234,
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "MIT",
      website: "mit.edu",
      verified: true,
      certificatesIssued: 987,
      joinedDate: "2024-02-01",
    },
    {
      id: "3",
      name: "Harvard University",
      website: "harvard.edu",
      verified: true,
      certificatesIssued: 856,
      joinedDate: "2024-02-15",
    },
  ];
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Institutions</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Verified Institutions</CardTitle>
            <CardDescription>
              Browse and verify certificates from these trusted institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Certificates Issued</TableHead>
                    <TableHead className="hidden md:table-cell">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institutions.map((institution) => (
                    <TableRow key={institution.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{institution.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {institution.website}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {institution.verified ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">
                            <XCircle className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {institution.certificatesIssued.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(institution.joinedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}