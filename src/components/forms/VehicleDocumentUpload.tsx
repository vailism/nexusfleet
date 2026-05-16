"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleDocumentSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { FileUpload } from "@/components/forms/FileUpload";

// This action would be in src/actions/document-actions.ts ideally
const createVehicleDocument = async (data: any) => {
  // Mock action for prototype
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, message: "Document uploaded" }), 1000));
};

interface VehicleDocumentUploadProps {
  vehicleId: string;
}

export function VehicleDocumentUpload({ vehicleId }: VehicleDocumentUploadProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof vehicleDocumentSchema>>({
    resolver: zodResolver(vehicleDocumentSchema),
    defaultValues: {
      name: "",
      type: "INSURANCE",
      url: "",
      vehicleId,
      organizationId: "dummy-org-id", // mock org id for prototype
    },
  });

  const onSubmit = async (data: z.infer<typeof vehicleDocumentSchema>) => {
    setLoading(true);
    const result = await createVehicleDocument(data) as any;
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      form.reset();
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle>Upload Vehicle Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input id="name" {...form.register("name")} placeholder="e.g. Geico Policy 2026" className="bg-background/50" />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Document Type</Label>
            <Select onValueChange={(val) => form.setValue("type", val as any)} defaultValue={form.getValues("type")}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INSURANCE">Insurance</SelectItem>
                <SelectItem value="REGISTRATION">Registration</SelectItem>
                <SelectItem value="POLLUTION">Pollution Certificate</SelectItem>
                <SelectItem value="SERVICE_INVOICE">Service Invoice</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input id="expiryDate" type="date" {...form.register("expiryDate", { valueAsDate: true })} className="bg-background/50" />
          </div>

          <div className="space-y-2">
            <Label>File Upload</Label>
            <FileUpload 
              endpoint="documentUploader" 
              value={form.watch("url")} 
              onChange={(url) => form.setValue("url", url || "")} 
            />
            {form.formState.errors.url && (
              <p className="text-xs text-red-500">{form.formState.errors.url.message}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !form.watch("url")}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Document
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
