import type { 
  IAsset,
  IExpense, 
  ISubscription, 
  IInvestment, 
  SelectOption, 
  UpdateInvestmentRequest 
} from '../types/types';
import type { AuthRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { transformBackendResponse, transformFrontendRequest } from '../utils/dataTransformers';

export interface MonthlySummaryDto {
  month: string;
  totalSpending: number;
}

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

interface ApiErrorResponse {
  message: string;
  status: number;
  error: string;
  timestamp: string;
  path: string;
  details?: string[];
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData: ApiErrorResponse = await response.json();
      let errorMessage = errorData.message || 'An unknown API error occurred';
      
      // Add validation details if available
      if (errorData.details && errorData.details.length > 0) {
        errorMessage += '\n' + errorData.details.join('\n');
      }
      
      throw new Error(errorMessage);
    } catch (parseError) {
      // If we can't parse the error response, use status text
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
  }
  if (response.status === 204) {
    return null;
  }
  const data = await response.json();
  return transformBackendData(data);
};

const transformBackendData = (data: any): any => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(transformBackendData);
  }
  
  if (typeof data === 'object') {
    const transformed: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'id' && value) {
        transformed[key] = transformBackendResponse.uuid(value);
      } else if ((key === 'amount' || key === 'initialValue' || key === 'currentValue' || key === 'totalSpending') && value !== null) {
        transformed[key] = transformBackendResponse.bigDecimal(value);
      } else if ((key === 'date' || key === 'purchaseDate') && value) {
        transformed[key] = transformBackendResponse.dateString(value);
      } else if (typeof value === 'object' && value !== null) {
        transformed[key] = transformBackendData(value);
      } else {
        transformed[key] = value;
      }
    }
    return transformed;
  }
  
  return data;
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

// --- ASSETS API ---
export const getAssets = (): Promise<IAsset[]> => fetch(`${API_BASE_URL}/assets`, { headers: getAuthHeaders() }).then(handleResponse);
export const addAsset = (data: Omit<IAsset, 'id' | 'user'>): Promise<IAsset> => fetch(`${API_BASE_URL}/assets`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse);
export const deleteAsset = (id: string): Promise<void> => fetch(`${API_BASE_URL}/assets/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse);

// --- EXTERNAL API SERVICES ---
export type PriceData = { [apiId: string]: number };

// --- REPORTS API ---
export const getMonthlySummary = (): Promise<MonthlySummaryDto[]> => {
  return fetch(`${API_BASE_URL}/reports/monthly-summary`, { headers: getAuthHeaders() }).then(handleResponse);
};

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
  const forexPrices: PriceData = {};
  
  // For precious metals, get USD prices
  try {
    const metalResponse = await fetch('https://api.metals.live/v1/spot');
    if (metalResponse.ok) {
      const metalData = await metalResponse.json();
      if (metalData && metalData.length > 0) {
        const goldData = metalData.find((item: { metal: string; price: number }) => item.metal === 'gold');
        const silverData = metalData.find((item: { metal: string; price: number }) => item.metal === 'silver');
        
        if (goldData && goldData.price) {
          const OUNCE_TO_GRAM = 31.1035;
          forexPrices['gold'] = goldData.price / OUNCE_TO_GRAM; // USD per gram
        }
        
        if (silverData && silverData.price) {
          const OUNCE_TO_GRAM = 31.1035;
          forexPrices['silver'] = silverData.price / OUNCE_TO_GRAM; // USD per gram
        }
      }
    }
  } catch (error) {
    console.error("Error fetching metal prices:", error);
    // Fallback prices in USD per gram
    forexPrices['gold'] = 65; // Approximate gold price per gram in USD
    forexPrices['silver'] = 0.8; // Approximate silver price per gram in USD
  }
  
  return forexPrices;
}

async function fetchCryptoPrices(investments: IInvestment[]): Promise<PriceData> {
  const cryptoInvestments = investments.filter(inv => inv.type === 'coin' && inv.apiId);
  if (cryptoInvestments.length === 0) return {};
  const uniqueApiIds = [...new Set(cryptoInvestments.map(inv => inv.apiId!))];
  const idsString = uniqueApiIds.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('CoinGecko API request failed');
    const data = await response.json();
    const cryptoPrices: PriceData = {};
    for (const id in data) {
      const price = parseFloat(String(data[id]?.usd));
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
