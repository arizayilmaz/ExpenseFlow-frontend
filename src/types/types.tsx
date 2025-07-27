export type ExpenseCategory = 'food' | 'transport' | 'bills' | 'shopping' | 'entertainment' | 'education' | 'travel' | 'other';

export interface IExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

export type SubscriptionCategory = 'streaming' | 'software' | 'gaming' | 'utilities' | 'health' | 'other';

export interface ISubscription {
  id: string;
  name: string;
  amount: number;
  paymentDay: number;
  lastPaidCycle?: string;
  category: SubscriptionCategory;
}

export type InvestmentType = 'coin' | 'gold' | 'silver';

export interface IInvestment {
  id: string;
  type: InvestmentType;
  name: string;
  amount: number;
  purchaseDate: string;
  initialValue: number;
  apiId?: string;
}

export interface UpdateInvestmentRequest {
  name: string;
  amount: number;
  purchasePrice: number;
  apiId?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface IAsset {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  iban?: string;
}

export interface IBankAccount {
  id: string;
  bankName: string;
  iban: string;
}