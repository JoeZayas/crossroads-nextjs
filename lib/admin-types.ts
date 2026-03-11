export type ResidentStatus = "Active" | "Inactive";
export type PaymentType = "Weekly" | "Monthly";
export type EntryType = "charge" | "payment" | "adjustment";

export type House = {
  id: string;
  name: string;
  address: string | null;
  is_active: boolean;
};

export type Resident = {
  id: string;
  house_id: string | null;
  full_name: string;
  contract_signed_date: string | null;
  move_in_date: string | null;
  move_out_date: string | null;
  payment_type: PaymentType | null;
  move_in_fee_due: number;
  status: ResidentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ResidentBalanceRow = {
  resident_id: string;
  full_name: string;
  house_id: string | null;
  house_name: string | null;
  status: ResidentStatus;
  payment_type: PaymentType | null;
  move_in_date: string | null;
  move_out_date: string | null;
  balance: number;
  raw_balance?: number;
  scheduled_due_missing?: number;
};

export type OverdueResidentRow = {
  resident_id: string;
  full_name: string;
  house_name: string | null;
  balance: number;
  due_now?: number;
  last_payment_date: string | null;
};

export type LedgerEntry = {
  id: string;
  resident_id: string;
  house_id: string | null;
  entry_date: string;
  entry_type: EntryType;
  description: string;
  amount: number;
  created_at: string;
  updated_at: string;
};
