"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowRight, Plus } from "lucide-react";

// Form schema using zod
const formSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Valid email is required"),
  recipientWallet: z.string().min(1, "Recipient wallet address is required"),
  certificateTitle: z.string().min(1, "Certificate title is required"),
  certificateType: z.string().min(1, "Certificate type is required"),
  issueDate: z.date({
    required_error: "Issue date is required",
  }),
  expiryDate: z.date().optional(),
  description: z.string().optional(),
  additionalFields: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      isEncrypted: z.boolean().default(false),
    })
  ).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function IssueCertificatePage() {
  const { connected, publicKey } = useWallet();
  const [additionalFields, setAdditionalFields] = useState<Array<{ key: string; value: string; isEncrypted: boolean }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [institutionData, setInstitutionData] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      recipientEmail: "",
      recipientWallet: "",
      certificateTitle: "",
      certificateType: "",
      description: "",
      additionalFields: [],
    },
  });

  // Check user role and institution data
  useEffect(() => {
    const checkUserRole = async () => {
      if (!connected || !publicKey) return;

      try {
        const response = await fetch(`/api/users?wallet=${publicKey.toString()}`);
        if (response.ok) {
          const userData = await response.json();
          if (userData) {
            setUserRole(userData.role);
            setInstitutionData(userData.institution);
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkUserRole();
  }, [connected, publicKey]);
  
  const onSubmit = async (values: FormValues) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    if (userRole !== "INSTITUTION") {
      toast.error("Only institutions can issue certificates");
      return;
    }

    if (!institutionData) {
      toast.error("Institution data not found");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First, create or get the recipient user
      const recipientResponse = await fetch("/api/recipients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: values.recipientWallet,
          email: values.recipientEmail,
          name: values.recipientName,
        }),
      });

      if (!recipientResponse.ok) {
        throw new Error("Failed to create/update recipient");
      }

      // Prepare certificate data
      const certificateData = {
        title: values.certificateTitle,
        type: values.certificateType.toUpperCase(),
        recipientWallet: values.recipientWallet,
        issuerWallet: publicKey.toString(),
        institutionId: institutionData.id,
        metadata: {
          description: values.description || "",
          image: "", // You can add image upload functionality later
          attributes: additionalFields.map(field => ({
            trait_type: field.key,
            value: field.value,
            encrypted: field.isEncrypted
          })),
          issueDate: values.issueDate.toISOString(),
          ...(values.expiryDate && { expiryDate: values.expiryDate.toISOString() })
        },
        expiryDate: values.expiryDate?.toISOString(),
      };

      // Issue the certificate
      const certificateResponse = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certificateData),
      });

      if (!certificateResponse.ok) {
        const errorData = await certificateResponse.json();
        throw new Error(errorData.error || "Failed to issue certificate");
      }

      const certificate = await certificateResponse.json();
      
      toast.success("Certificate issued successfully!");
      form.reset();
      setAdditionalFields([]);
    } catch (error: any) {
      console.error("Error issuing certificate:", error);
      toast.error(error.message || "Failed to issue certificate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addField = () => {
    setAdditionalFields([
      ...additionalFields,
      { key: "", value: "", isEncrypted: false },
    ]);
  };
  
  const updateField = (index: number, field: string, value: any) => {
    const updatedFields = [...additionalFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setAdditionalFields(updatedFields);
  };
  
  const removeField = (index: number) => {
    setAdditionalFields(additionalFields.filter((_, i) => i !== index));
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Issue Certificate</h1>
        <p className="text-muted-foreground">Please connect your wallet to issue certificates.</p>
      </div>
    );
  }

  if (userRole && userRole !== "INSTITUTION") {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">Only institutions can issue certificates.</p>
      </div>
    );
  }

  if (!institutionData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Institution Not Found</h1>
        <p className="text-muted-foreground">You must be associated with an institution to issue certificates.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Issue Certificate</h1>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Certificate</CardTitle>
          <CardDescription>
            Issue a blockchain-verified certificate from {institutionData.name}.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recipient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recipientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Email</FormLabel>
                        <FormControl>
                          <Input placeholder="jane@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="recipientWallet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Solana wallet address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Certificate Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="certificateTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Bachelor of Science in Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="certificateType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="degree">Degree</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="certificate">Certificate</SelectItem>
                            <SelectItem value="course">Course Completion</SelectItem>
                            <SelectItem value="award">Award</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Issue Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormDescription>
                          Leave empty for permanent credentials
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter additional information about the certificate"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Additional Metadata</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addField}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>
                
                {additionalFields.map((field, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Field Name</FormLabel>
                      <Input
                        placeholder="e.g., GPA, Major, etc."
                        value={field.key}
                        onChange={(e) => updateField(index, "key", e.target.value)}
                      />
                    </div>
                    <div>
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Value</FormLabel>
                      <Input
                        placeholder="Field value"
                        value={field.value}
                        onChange={(e) => updateField(index, "value", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="checkbox"
                          id={`encrypt-${index}`}
                          checked={field.isEncrypted}
                          onChange={(e) => updateField(index, "isEncrypted", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`encrypt-${index}`} className="text-sm">
                          {index === 0 ? "Encrypt this field" : "Encrypt"}
                        </label>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeField(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                
                {additionalFields.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add custom fields to include additional information in the certificate.
                    Encrypted fields will only be visible to those with whom the recipient shares access.
                  </p>
                )}
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Issuing Certificate...
                    </>
                  ) : (
                    <>
                      Issue Certificate
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}