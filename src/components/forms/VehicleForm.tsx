"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createVehicle } from "@/actions/vehicle-actions";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { VehicleStatus } from "@prisma/client";

export function VehicleForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      vin: "",
      status: VehicleStatus.ACTIVE,
      driverName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof vehicleSchema>) => {
    setLoading(true);
    const result = await createVehicle(data);
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
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input id="make" {...form.register("make")} placeholder="e.g. Ford" className="bg-background/50" />
              {form.formState.errors.make && (
                <p className="text-xs text-red-500">{form.formState.errors.make.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...form.register("model")} placeholder="e.g. Transit" className="bg-background/50" />
              {form.formState.errors.model && (
                <p className="text-xs text-red-500">{form.formState.errors.model.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" {...form.register("year", { valueAsNumber: true })} className="bg-background/50" />
              {form.formState.errors.year && (
                <p className="text-xs text-red-500">{form.formState.errors.year.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input id="licensePlate" {...form.register("licensePlate")} placeholder="ABC-1234" className="bg-background/50" />
              {form.formState.errors.licensePlate && (
                <p className="text-xs text-red-500">{form.formState.errors.licensePlate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input id="vin" {...form.register("vin")} placeholder="17-character VIN" className="bg-background/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverName">Assigned Driver (Optional)</Label>
            <Input id="driverName" {...form.register("driverName")} placeholder="John Doe" className="bg-background/50" />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              onValueChange={(value: VehicleStatus) => form.setValue("status", value)} 
              defaultValue={form.getValues("status")}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VehicleStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={VehicleStatus.MAINTENANCE}>Maintenance</SelectItem>
                <SelectItem value={VehicleStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Vehicle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
