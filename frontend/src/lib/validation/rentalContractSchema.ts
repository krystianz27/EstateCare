import * as z from "zod";

export const rentalContractCreateSchema = z.object({
  apartment_id: z.string().uuid("Invalid UUID format").optional(),
  tenant: z.string().trim().min(1, "Tenant name is required"),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  rent_amount: z.string().optional(),
  deposit: z.string().optional(),
  status: z.enum(["active", "expired", "terminated"]).default("active"),
});

export type RentalContractCreateSchema = z.infer<
  typeof rentalContractCreateSchema
>;

export const rentalContractUpdateSchema = rentalContractCreateSchema.partial();

export type RentalContractUpdateSchema = z.infer<
  typeof rentalContractUpdateSchema
>;
