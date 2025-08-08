import { z } from "zod";

export const addAdminSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  role: z
    .enum(["admin", "superadmin"], {
      message: "Please select a role",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export type AddAdminFormData = z.infer<typeof addAdminSchema>;