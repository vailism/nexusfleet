"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fuelLogSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createFuelLog } from "@/actions/fuel-actions";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Vehicle } from "@prisma/client";

interface FuelLogFormProps {
  vehicles: Vehicle[];
}

export function FuelLogForm({ vehicles }: FuelLogFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof fuelLogSchema>>({
    resolver: zodResolver(fuelLogSchema),
    defaultValues: {
      vehicleId: "",
      liters: 0,
      cost: 0,
      odometer: 0,
      date: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof fuelLogSchema>) => {
    setLoading(true);
    const result = await createFuelLog(data);
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
          <Plus className="mr-2 h-4 w-4" /> Log Fuel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle>Log Fuel Fill-Up</DialogTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liters">Quantity (Liters)</Label>
              <Input id="liters" type="number" step="0.1" {...form.register("liters", { valueAsNumber: true })} className="bg-background/50" />
              {form.formState.errors.liters && (
                <p className="text-xs text-red-500">{form.formState.errors.liters.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Total Cost ($)</Label>
              <Input id="cost" type="number" step="0.01" {...form.register("cost", { valueAsNumber: true })} className="bg-background/50" />
              {form.formState.errors.cost && (
                <p className="text-xs text-red-500">{form.formState.errors.cost.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odometer">Current Odometer (km)</Label>
              <Input id="odometer" type="number" {...form.register("odometer", { valueAsNumber: true })} className="bg-background/50" />
              {form.formState.errors.odometer && (
                <p className="text-xs text-red-500">{form.formState.errors.odometer.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...form.register("date", { valueAsDate: true })} className="bg-background/50" />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Fuel Log
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
