import { z } from "zod";
import { VehicleStatus, InvoiceStatus } from "@prisma/client";

// Vehicles
export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(2, "License plate is required"),
  vin: z.string().optional(),
  status: z.nativeEnum(VehicleStatus).default(VehicleStatus.ACTIVE),
  driverName: z.string().optional(),
});

// Customers
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Expenses
export const expenseSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.date().default(new Date()),
  vehicleId: z.string().optional(),
  receiptUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  organizationId: z.string().min(1),
});

// Invoices
export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  gstPercent: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
});

export const invoiceSchema = z.object({
  number: z.string().min(1, "Invoice number is required"),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.PENDING),
  dueDate: z.date(),
  customerId: z.string().min(1, "Customer is required"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

// Fuel Logs
export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  liters: z.number().positive("Liters must be greater than 0"),
  cost: z.number().positive("Cost must be greater than 0"),
  odometer: z.number().positive("Odometer must be positive"),
  date: z.date().default(new Date()),
});

// Maintenance Records
export const maintenanceRecordSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  serviceType: z.string().min(1, "Service type is required"),
  description: z.string().optional(),
  cost: z.number().nonnegative(),
  date: z.date().default(new Date()),
  nextDueDate: z.date().optional(),
  organizationId: z.string().min(1),
});

// Vehicle Documents
export const vehicleDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  type: z.enum(["INSURANCE", "REGISTRATION", "POLLUTION", "SERVICE_INVOICE", "OTHER"]),
  url: z.string().url("Valid URL required"),
  size: z.number().optional(),
  expiryDate: z.date().optional(),
  vehicleId: z.string().min(1, "Vehicle ID required"),
  organizationId: z.string().min(1),
});
