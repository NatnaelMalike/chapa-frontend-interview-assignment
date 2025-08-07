interface BankTransfer {
    account_name: string;
    account_number: string;
    currency: "ETB";
    amount: number;
    charge: number;
    transfer_type: "bank";
    chapa_reference: string;
    bank_code: number;
    bank_name: string;
    bank_reference: string | null;
    status: "failed/cancelled" | "success" | "pending"; 
    reference: string | null;
    created_at: string;
  }
  interface Bank {
    id: number;
    slug: string;
    swift: string;
    name: string;
    acct_length: number;
  }

