import type { 
  IExpense, 
  ISubscription, 
  IInvestment, 
  SelectOption,
  UpdateInvestmentRequest 
} from '../types/types';
import type { AuthRequest, RegisterRequest, AuthResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An unknown API error occurred');
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

// --- AUTHENTICATION API ---
export const register = (data: RegisterRequest): Promise<AuthResponse> => {
  return fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const login = (data: AuthRequest): Promise<AuthResponse> => {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);
};

// --- SUBSCRIPTIONS API ---
export const getSubscriptions = (): Promise<ISubscription[]> => fetch(`${API_BASE_URL}/subscriptions`, { headers: getAuthHeaders() }).then(handleResponse);
export const addSubscription = (data: Omit<ISubscription, 'id' | 'user' | 'lastPaidCycle'>): Promise<ISubscription> => fetch(`${API_BASE_URL}/subscriptions`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse);
export const updateSubscription = (id: string, data: ISubscription): Promise<ISubscription> => fetch(`${API_BASE_URL}/subscriptions/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse);
export const deleteSubscription = (id: string): Promise<void> => fetch(`${API_BASE_URL}/subscriptions/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse);
export const toggleSubscription = (id: string): Promise<ISubscription> => fetch(`${API_BASE_URL}/subscriptions/${id}/toggle`, { method: 'PATCH', headers: getAuthHeaders() }).then(handleResponse);

// --- EXPENSES API ---
export const getExpenses = (): Promise<IExpense[]> => fetch(`${API_BASE_URL}/expenses`, { headers: getAuthHeaders() }).then(handleResponse);
export const addExpense = (data: Omit<IExpense, 'id' | 'user' | 'date'>): Promise<IExpense> => fetch(`${API_BASE_URL}/expenses`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse);
export const updateExpense = (id: string, data: IExpense): Promise<IExpense> => fetch(`${API_BASE_URL}/expenses/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse);
export const deleteExpense = (id: string): Promise<void> => fetch(`${API_BASE_URL}/expenses/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse);

// --- INVESTMENTS API ---
export const getInvestments = (): Promise<IInvestment[]> => fetch(`${API_BASE_URL}/investments`, { headers: getAuthHeaders() }).then(handleResponse);
export const addInvestment = (data: Omit<IInvestment, 'id' | 'user' | 'purchaseDate' | 'initialValue'> & { purchasePrice: number }): Promise<IInvestment> => fetch(`${API_BASE_URL}/investments`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse);
export const updateInvestment = (id: string, data: UpdateInvestmentRequest): Promise<IInvestment> => fetch(`${API_BASE_URL}/investments/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse);
export const deleteInvestment = (id: string): Promise<void> => fetch(`${API_BASE_URL}/investments/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse);

// --- EXTERNAL API SERVICES ---
export type PriceData = { [apiId: string]: number };

interface ExchangeRateResponse {
  result: string;
  'error-type'?: string;
  conversion_rates: {
    [currency_code: string]: number | string;
  };
}

const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

export const searchCoins = async (inputValue: string): Promise<SelectOption[]> => {
  if (!inputValue) return [];
  const url = `https://api.coingecko.com/api/v3/search?query=${inputValue}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('CoinGecko search request failed');
    const data = await response.json();
    if (data.coins) {
      return data.coins.map((coin: { id: string; name: string; symbol: string }) => ({
        value: coin.id,
        label: `${coin.name} (${coin.symbol.toUpperCase()})`,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error searching coins:", error);
    return [];
  }
};

async function fetchForexAndMetalsPrices(): Promise<PriceData> {
  if (!EXCHANGE_RATE_API_KEY) {
    console.error("ExchangeRate-API key is missing from .env.local file.");
    return {};
  }
  const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`ExchangeRate-API request failed: ${response.statusText}`);
    
    const data: ExchangeRateResponse = await response.json();
    if (data.result === 'error') throw new Error(`ExchangeRate-API returned an error: ${data['error-type']}`);
    
    const rates = data.conversion_rates;
    const forexPrices: PriceData = {};
    if (rates && rates.TRY) {
      const usdToTryRate = parseFloat(String(rates.TRY));
      if (!isNaN(usdToTryRate)) {
        forexPrices['dollar'] = usdToTryRate;
        const eurRate = parseFloat(String(rates.EUR));
        if (!isNaN(eurRate) && eurRate !== 0) {
          forexPrices['euro'] = (1 / eurRate) * usdToTryRate;
        }
        const OUNCE_TO_GRAM = 31.1035;
        const xauRate = parseFloat(String(rates.XAU));
        if (!isNaN(xauRate) && xauRate !== 0) {
          forexPrices['gold'] = (1 / xauRate) * usdToTryRate / OUNCE_TO_GRAM;
        }
        const xagRate = parseFloat(String(rates.XAG));
        if (!isNaN(xagRate) && xagRate !== 0) {
          forexPrices['silver'] = (1 / xagRate) * usdToTryRate / OUNCE_TO_GRAM;
        }
      }
    }
    forexPrices['interest'] = 1.0;
    return forexPrices;
  } catch (error) {
    console.error("Error fetching or processing forex/metal prices:", error);
    return {};
  }
}

async function fetchCryptoPrices(investments: IInvestment[]): Promise<PriceData> {
  const cryptoInvestments = investments.filter(inv => inv.type === 'coin' && inv.apiId);
  if (cryptoInvestments.length === 0) return {};
  const uniqueApiIds = [...new Set(cryptoInvestments.map(inv => inv.apiId!))];
  const idsString = uniqueApiIds.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=try`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('CoinGecko API request failed');
    const data = await response.json();
    const cryptoPrices: PriceData = {};
    for (const id in data) {
      const price = parseFloat(String(data[id]?.try));
      if (!isNaN(price)) {
        cryptoPrices[id] = price;
      }
    }
    return cryptoPrices;
  } catch (error) {
    console.error("Error fetching CoinGecko data:", error);
    return {};
  }
}

export const fetchCurrentPrices = async (investments: IInvestment[]): Promise<PriceData> => {
  const [forexPrices, cryptoPrices] = await Promise.all([
    fetchForexAndMetalsPrices(),
    fetchCryptoPrices(investments)
  ]);
  const finalPrices = { ...forexPrices, ...cryptoPrices };
  return finalPrices;
};