export interface Account {
  account_id: string;
  balances: AccountBalance;
  mask: string;
  name: string;
  official_name: string;
  persistent_account_id: string;
  subtype: string;
  type: string;
}
  
export interface ResponseData{
  override_accounts: Account[];
}

  export interface PlaidData {
    balance: number; // Assuming you sum up balances
    //transactions: Transaction[]; // Ensure you define a Transaction interface
    BankIncome: number;
  }
  
  export interface Transaction {
    account_id: string;
    amount: number;
    iso_currency_code: string;
    category: string[];
    date: string;
    name: string;
    // Additional properties as needed
  }

  export interface TransactionsResponse {
    transactions: Array<{ /* Transaction details */ }>;
  }
  
 export interface BankIncomeSource {
    total_amount: number;
  }
  
  export interface BankIncomeEntry {
    bank_income_sources: BankIncomeSource[];
  }
  
 export interface IncomeInfoResponse {
    bank_income: BankIncomeEntry[];
  }
  
 export interface AccountBalance {
  available: number;
  current: number;
  iso_currency_code: string;
  limit: number | null;
  unofficial_currency_code: string | null;
  }
  
  
  export interface PlaidResponse {
    accounts: Account[];
    // Other Plaid response fields...
}