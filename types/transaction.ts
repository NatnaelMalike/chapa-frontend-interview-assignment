interface Customer {
  id: number;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  mobile: string | null;
}

interface Transaction {
  status: "success" | "pending" | "failed";
  ref_id: string;
  type: string;
  created_at: string;
  currency: string;
  amount: string;
  charge: string;
  trans_id: string | null;
  payment_method: string;
  customer: Customer;
}
