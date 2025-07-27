import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IExpense, ISubscription, IInvestment, IAsset, UpdateInvestmentRequest, InvestmentType } from '../types/types';
import type { AuthRequest, RegisterRequest } from '../types/auth';
import * as api from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';

interface IDataContext {
  subscriptions: ISubscription[];
  expenses: IExpense[];
  investments: IInvestment[];
  assets: IAsset[];
  prices: api.PriceData | null;
  spendingLimit: number;
  isLoading: boolean;
  isLoadingPrices: boolean;
  authToken: string | null;
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => void;
  addSubscription: (data: Omit<ISubscription, 'id' | 'user' | 'lastPaidCycle'>) => Promise<void>;
  updateSubscription: (id: string, data: ISubscription) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  toggleSubscription: (id: string) => Promise<void>;
  addExpense: (data: Omit<IExpense, 'id' | 'user' | 'date'>) => Promise<void>;
  updateExpense: (id: string, data: IExpense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addInvestment: (data: { type: InvestmentType; name: string; amount: number; purchasePrice: number; apiId?: string; }) => Promise<void>;
  updateInvestment: (id: string, data: UpdateInvestmentRequest) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  addAsset: (data: Omit<IAsset, 'id' | 'user'>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  setSpendingLimit: (limit: number) => void;
  monthlySummary: api.MonthlySummaryDto[];
  fetchMonthlySummary: () => Promise<void>;
}

const DataContext = createContext<IDataContext | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [investments, setInvestments] = useState<IInvestment[]>([]);
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [spendingLimit, setSpendingLimit] = useLocalStorage<number>('spendingLimit', 0);
  const [prices, setPrices] = useState<api.PriceData | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState<api.MonthlySummaryDto[]>([]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setSubscriptions([]);
    setExpenses([]);
    setInvestments([]);
    setAssets([]);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      if (authToken) {
        setIsLoading(true);
        try {
          const [subs, exps, invs, asts] = await Promise.all([
            api.getSubscriptions(),
            api.getExpenses(),
            api.getInvestments(),
            api.getAssets(),
          ]);
          setSubscriptions(subs || []);
          setExpenses(exps || []);
          setInvestments(invs || []);
          setAssets(asts || []);
        } catch (error) {
          console.error("Failed to load data, token might be invalid.", error);
          toast.error("Session expired. Please log in again.");
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [authToken, logout]);

  useEffect(() => {
    const getPrices = async () => {
      if (investments.length === 0) {
        setIsLoadingPrices(false);
        setPrices({});
        return;
      }
      setIsLoadingPrices(true);
      try {
        const fetchedPrices = await api.fetchCurrentPrices(investments);
        setPrices(fetchedPrices);
      } catch (error) {
        console.error("Failed to fetch prices", error);
        setPrices({});
      } finally {
        setIsLoadingPrices(false);
      }
    };
    if(authToken) getPrices();
  }, [investments, authToken]);

  const login = async (credentials: AuthRequest) => {
    const response = await api.login(credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      setAuthToken(response.token);
    } else {
      throw new Error(response.message || 'Login failed: No token received.');
    }
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.register(data);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      setAuthToken(response.token);
    } else {
      throw new Error(response.message || 'Registration failed: No token received.');
    }
  };

  const addSubscription = useCallback(async (data: Omit<ISubscription, 'id' | 'user' | 'lastPaidCycle'>) => {
    try {
      const newSub = await api.addSubscription(data);
      setSubscriptions(prev => [newSub, ...prev]);
      toast.success('Abonelik başarıyla eklendi');
    } catch (error) {
      console.error('Abonelik ekleme hatası:', error);
      toast.error((error as Error).message || 'Abonelik eklenemedi');
      throw error;
    }
  }, []);

  const updateSubscription = useCallback(async (id: string, data: ISubscription) => {
    try {
      const updatedSub = await api.updateSubscription(id, data);
      setSubscriptions(prev => prev.map(s => s.id === id ? updatedSub : s));
      toast.success('Abonelik başarıyla güncellendi');
    } catch (error) {
      console.error('Abonelik güncelleme hatası:', error);
      toast.error((error as Error).message || 'Abonelik güncellenemedi');
      throw error;
    }
  }, []);

  const deleteSubscription = useCallback(async (id: string) => {
    try {
      await api.deleteSubscription(id);
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      toast.success('Abonelik başarıyla silindi');
    } catch (error) {
      console.error('Abonelik silme hatası:', error);
      toast.error((error as Error).message || 'Abonelik silinemedi');
      throw error;
    }
  }, []);

  const toggleSubscription = useCallback(async (id: string) => {
    try {
      const updatedSub = await api.toggleSubscription(id);
      setSubscriptions(prev => prev.map(s => s.id === id ? updatedSub : s));
      toast.success('Abonelik durumu güncellendi');
    } catch (error) {
      console.error('Abonelik toggle hatası:', error);
      toast.error((error as Error).message || 'Abonelik durumu değiştirilemedi');
      throw error;
    }
  }, []);

  const addExpense = useCallback(async (data: Omit<IExpense, 'id' | 'user' | 'date'>) => {
    try {
      const newExpense = await api.addExpense(data);
      setExpenses(prev => [newExpense, ...prev]);
      toast.success('Harcama başarıyla eklendi');
    } catch (error) {
      console.error('Harcama ekleme hatası:', error);
      toast.error((error as Error).message || 'Harcama eklenemedi');
      throw error;
    }
  }, []);

  const updateExpense = useCallback(async (id: string, data: IExpense) => {
    try {
      const updatedExpense = await api.updateExpense(id, data);
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
      toast.success('Harcama başarıyla güncellendi');
    } catch (error) {
      console.error('Harcama güncelleme hatası:', error);
      toast.error((error as Error).message || 'Harcama güncellenemedi');
      throw error;
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await api.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success('Harcama başarıyla silindi');
    } catch (error) {
      console.error('Harcama silme hatası:', error);
      toast.error((error as Error).message || 'Harcama silinemedi');
      throw error;
    }
  }, []);

  const addInvestment = useCallback(async (data: { type: InvestmentType; name: string; amount: number; purchasePrice: number; apiId?: string; }) => {
    try {
      const newInvestment = await api.addInvestment(data);
      setInvestments(prev => [newInvestment, ...prev]);
      toast.success('Yatırım başarıyla eklendi');
    } catch (error) {
      console.error('Yatırım ekleme hatası:', error);
      toast.error((error as Error).message || 'Yatırım eklenemedi');
      throw error;
    }
  }, []);

  const updateInvestment = useCallback(async (id: string, data: UpdateInvestmentRequest) => {
    try {
      const updatedInvestment = await api.updateInvestment(id, data);
      setInvestments(prev => prev.map(i => i.id === id ? updatedInvestment : i));
      toast.success('Yatırım başarıyla güncellendi');
    } catch (error) {
      console.error('Yatırım güncelleme hatası:', error);
      toast.error((error as Error).message || 'Yatırım güncellenemedi');
      throw error;
    }
  }, []);

  const deleteInvestment = useCallback(async (id: string) => {
    try {
      await api.deleteInvestment(id);
      setInvestments(prev => prev.filter(i => i.id !== id));
      toast.success('Yatırım başarıyla silindi');
    } catch (error) {
      console.error('Yatırım silme hatası:', error);
      toast.error((error as Error).message || 'Yatırım silinemedi');
      throw error;
    }
  }, []);
  
  const addAsset = useCallback(async (data: Omit<IAsset, 'id' | 'user'>) => {
    try {
      const newAsset = await api.addAsset(data);
      setAssets(prev => [newAsset, ...prev]);
      toast.success('Varlık başarıyla eklendi');
    } catch (error) {
      console.error('Varlık ekleme hatası:', error);
      toast.error((error as Error).message || 'Varlık eklenemedi');
      throw error;
    }
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    try {
      await api.deleteAsset(id);
      setAssets(prev => prev.filter(a => a.id !== id));
      toast.success('Varlık başarıyla silindi');
    } catch (error) {
      console.error('Varlık silme hatası:', error);
      toast.error((error as Error).message || 'Varlık silinemedi');
      throw error;
    }
  }, []);

  const fetchMonthlySummary = useCallback(async () => {
        try {
            const summary = await api.getMonthlySummary();
            setMonthlySummary(summary || []);
        } catch (error) {
            console.error("Failed to fetch monthly summary", error);
            toast.error("Could not load reports data.");
        }
    }, []);

  const value = {
    subscriptions, expenses, investments, assets, prices, spendingLimit,
    isLoading, isLoadingPrices, authToken,
    login, register, logout,
    addSubscription, deleteSubscription, updateSubscription, toggleSubscription,
    addExpense, deleteExpense, updateExpense,
    addInvestment, deleteInvestment, updateInvestment,
    addAsset, deleteAsset,
    setSpendingLimit,
    monthlySummary,
    fetchMonthlySummary,
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export { useData };
