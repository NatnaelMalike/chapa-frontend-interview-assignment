import { z } from "zod";

export const paymentSchema = z.object({
  amount: z
    .number()
    .min(1, "Amount must be greater than 0")
    .max(1000000, "Amount must be less than or equal to 1,000,000"),

  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone_number: z.string().regex(/^0[79]\d{8}$/, "Invalid phone number"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
