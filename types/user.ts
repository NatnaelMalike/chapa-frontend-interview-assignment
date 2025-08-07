interface User {
    id: number;
    username: string;
    email: string;
    role: "user" | "admin" | "superadmin";
    isActive: boolean;
    walletBalance?: number;
    password?: string;
  }
