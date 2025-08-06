import { Transaction } from "./transaction";

export interface User{
    id : number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    walletBalance: number;
    transactions: Transaction[];
}



export type UserRole = "admin" | "super-admin" | "user";