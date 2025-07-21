// src/types/types.tsx

// Harcama kategorilerini tanımlıyoruz
export type ExpenseCategory = 'food' | 'transport' | 'bills' | 'shopping' | 'entertainment' | 'education' | 'travel' | 'other';

export interface IExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

// Abonelik kategorilerini tanımlıyoruz
export type SubscriptionCategory = 'streaming' | 'software' | 'gaming' | 'utilities' | 'health' | 'other';

export interface ISubscription {
  id: string;
  name: string;
  amount: number;
  paymentDay: number;
  lastPaidCycle?: string;
  category: SubscriptionCategory;
}

// Yatırım türlerini sabit bir liste olarak tanımlıyoruz.
export type InvestmentType = 'interest' | 'dollar' | 'coin' | 'euro' | 'gold' | 'silver';

// Bir yatırım objesinin yapısını tanımlıyoruz.
export interface IInvestment {
  id: string;
  type: InvestmentType;
  name: string;
  amount: number;
  purchaseDate: string;
  initialValue: number;
  apiId?: string;
}

// YENİ: Bir yatırımı güncellerken gönderilecek verinin tipini tanımlar.
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