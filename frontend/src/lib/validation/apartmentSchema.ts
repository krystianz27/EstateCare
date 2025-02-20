import * as z from "zod";

export const apartmentSchema = z.object({
  street: z.string().trim().min(1, "Street is required"),
  building_number: z.string().trim().nullable(),
  apartment_number: z.string().trim().nullable().optional(),
  city: z.string().trim().min(1, "City is required"),
  postal_code: z.string().trim().nullable().optional(),
  country: z.string().trim().min(1, "Country is required"),
});

export type ApartmentSchema = z.infer<typeof apartmentSchema>;

export const tenantUpdateSchema = z.object({
  add: z.array(z.string().uuid("Invalid UUID format")).optional(),
  remove: z.array(z.string().uuid("Invalid UUID format")).optional(),
});

export type TenantUpdateSchema = z.infer<typeof tenantUpdateSchema>;
