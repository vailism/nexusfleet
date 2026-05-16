"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceRecordSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createMaintenanceRecord } from "@/actions/maintenance-actions";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Vehicle } from "@prisma/client";

interface MaintenanceRecordFormProps {
  vehicles: Vehicle[];
}

export function MaintenanceRecordForm({ vehicles }: MaintenanceRecordFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof maintenanceRecordSchema>>({
    resolver: zodResolver(maintenanceRecordSchema),
    defaultValues: {
      vehicleId: "",
      serviceType: "",
      description: "",
      cost: 0,
      date: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof maintenanceRecordSchema>) => {
    setLoading(true);
    const result = await createMaintenanceRecord(data);
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
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Log Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle>Log Maintenance / Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehicle</Label>
            <Select onValueChange={(val) => form.setValue("vehicleId", val)} defaultValue={form.getValues("vehicleId")}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.licensePlate} ({v.make})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.vehicleId && (
              <p className="text-xs text-red-500">{form.formState.errors.vehicleId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select onValueChange={(val) => form.setValue("serviceType", val)} defaultValue={form.getValues("serviceType")}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="e.g. Oil Change" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oil Change">Oil Change</SelectItem>
                <SelectItem value="Tire Rotation">Tire Rotation</SelectItem>
                <SelectItem value="Brake Service">Brake Service</SelectItem>
                <SelectItem value="Engine Repair">Engine Repair</SelectItem>
                <SelectItem value="General Inspection">General Inspection</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.serviceType && (
              <p className="text-xs text-red-500">{form.formState.errors.serviceType.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Service Cost ($)</Label>
              <Input id="cost" type="number" step="0.01" {...form.register("cost", { valueAsNumber: true })} className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Service Date</Label>
              <Input id="date" type="date" {...form.register("date", { valueAsDate: true })} className="bg-background/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextDueDate">Next Due Date (Optional Reminder)</Label>
            <Input id="nextDueDate" type="date" {...form.register("nextDueDate", { valueAsDate: true })} className="bg-background/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notes / Details</Label>
            <textarea 
              id="description" 
              {...form.register("description")} 
              className="w-full min-h-[80px] rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
