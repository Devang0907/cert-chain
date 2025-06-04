"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, User, Award, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RecipientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock recipients data
  const recipients = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      walletAddress: "7X8j...3Yfk",
      certificatesReceived: 3,
      lastActive: "2024-03-15",
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah@example.com",
      walletAddress: "9H2k...7Mnp",
      certificatesReceived: 2,
      lastActive: "2024-03-14",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      walletAddress: "4R9m...1Lqs",
      certificatesReceived: 4,
      lastActive: "2024-03-13",
    },
  ];
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Recipients</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Certificate Recipients</CardTitle>
            <CardDescription>
              Manage and track certificate recipients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search recipients..."
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
                    <TableHead>Recipient</TableHead>
                    <TableHead>Certificates</TableHead>
                    <TableHead className="hidden md:table-cell">Wallet Address</TableHead>
                    <TableHead className="hidden md:table-cell">Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{recipient.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {recipient.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>{recipient.certificatesReceived}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{recipient.walletAddress}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(recipient.lastActive).toLocaleDateString()}
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Issue Certificate</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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