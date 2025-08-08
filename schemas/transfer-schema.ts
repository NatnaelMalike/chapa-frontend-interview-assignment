import { z } from "zod";

export const transferSchema = z.object({
  amount: z
    .string(),
   

  account_number: z
    .string()
    .min(1, "Account number is required"),

  account_name: z
    .string()
    .min(1, "Account name is required"),

  bank_code: z
    .string()
    .min(1, "Bank code is required"),
});

export type TransferFormData = z.infer<typeof transferSchema>;
