"use client";

import { useState } from "react";
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
  const [additionalFields, setAdditionalFields] = useState<Array<{ key: string; value: string; isEncrypted: boolean }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      recipientWallet: "",
      certificateTitle: "",
      certificateType: "",
      description: "",
      additionalFields: [],
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Prepare complete form data with additional fields
    const completeData = {
      ...values,
      additionalFields,
    };
    
    console.log("Submitting certificate data:", completeData);
    
    // Simulate API call to mint NFT
    try {
      // In a real app, this would call a function to mint the NFT on Solana
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Certificate issued successfully!");
      form.reset();
      setAdditionalFields([]);
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Failed to issue certificate. Please try again.");
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
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Issue Certificate</h1>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Certificate</CardTitle>
          <CardDescription>
            Issue a blockchain-verified certificate to a student or recipient.
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