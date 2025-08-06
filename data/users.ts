import { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    role: "user",
    isActive: true,
    walletBalance: 2500.0,
    transactions: [],
    password: "password",
  },
];
