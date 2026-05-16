"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/forms/FileUpload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function OrganizationSettingsForm({ organization }: { organization?: any }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: organization?.name || "",
      logoUrl: organization?.logoUrl || "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    // Mock action call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Organization settings updated successfully");
    setLoading(false);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>Manage your company branding and basic details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input {...form.register("name")} className="bg-background/50 max-w-md" />
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Company Logo</Label>
              <p className="text-sm text-muted-foreground mb-4">
                This logo will appear on your dashboard, client portals, and generated invoice PDFs.
              </p>
              <FileUpload 
                endpoint="receiptUploader" 
                value={form.watch("logoUrl")} 
                onChange={(url) => form.setValue("logoUrl", url || "")} 
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
