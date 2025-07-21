import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react';
import type { IExpense, ISubscription, IInvestment, UpdateInvestmentRequest } from '../types/types';
import type { AuthRequest, RegisterRequest } from '../types/auth';
import * as api from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';

interface IDataContext {
  subscriptions: ISubscription[];
  expenses: IExpense[];
  investments: IInvestment[];
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
  // DÜZELTME: Bu satır, formdan gelen doğru veriyi bekleyecek şekilde güncellendi.
  addInvestment: (data: { type: string; name: string; amount: number; purchasePrice: number; apiId?: string; }) => Promise<void>;
  updateInvestment: (id: string, data: UpdateInvestmentRequest) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  setSpendingLimit: (limit: number) => void;
}

const DataContext = createContext<IDataContext | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [investments, setInvestments] = useState<IInvestment[]>([]);
  const [spendingLimit, setSpendingLimit] = useLocalStorage<number>('spendingLimit', 0);
  const [prices, setPrices] = useState<api.PriceData | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!localStorage.getItem('authToken')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [subs, exps, invs] = await Promise.all([
        api.getSubscriptions(),
        api.getExpenses(),
        api.getInvestments(),
      ]);
      setSubscriptions(subs || []);
      setExpenses(exps || []);
      setInvestments(invs || []);
    } catch (error) {
      console.error("Failed to load data, token might be invalid.", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [authToken, fetchData]);

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
    getPrices();
  }, [investments]);

  const login = async (credentials: AuthRequest) => {
    const response = await api.login(credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      setAuthToken(response.token);
    } else {
      throw new Error('Login failed: No token received.');
    }
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.register(data);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      setAuthToken(response.token);
    } else {
      throw new Error('Registration failed: No token received.');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setSubscriptions([]);
    setExpenses([]);
    setInvestments([]);
  };

  const addSubscription = useCallback(async (data) => {
    const newSub = await api.addSubscription(data);
    setSubscriptions(prev => [newSub, ...prev]);
  }, []);

  const updateSubscription = useCallback(async (id: string, data: ISubscription) => {
    const updatedSub = await api.updateSubscription(id, data);
    setSubscriptions(prev => prev.map(s => s.id === id ? updatedSub : s));
  }, []);

  const deleteSubscription = useCallback(async (id: string) => {
    await api.deleteSubscription(id);
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  }, []);

  const toggleSubscription = useCallback(async (id: string) => {
    const updatedSub = await api.toggleSubscription(id);
    setSubscriptions(prev => prev.map(s => s.id === id ? updatedSub : s));
  }, []);

  const addExpense = useCallback(async (data) => {
    const newExpense = await api.addExpense(data);
    setExpenses(prev => [newExpense, ...prev]);
  }, []);

  const updateExpense = useCallback(async (id: string, data: IExpense) => {
    const updatedExpense = await api.updateExpense(id, data);
    setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    await api.deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  // DÜZELTME: Bu fonksiyon artık API'yi çağırıyor ve state'i güncelliyor.
  const addInvestment = useCallback(async (data) => {
    const newInvestment = await api.addInvestment(data);
    setInvestments(prev => [newInvestment, ...prev]);
  }, []);

  const updateInvestment = useCallback(async (id: string, data: UpdateInvestmentRequest) => {
    const updatedInvestment = await api.updateInvestment(id, data);
    setInvestments(prev => prev.map(i => i.id === id ? updatedInvestment : i));
  }, []);

  const deleteInvestment = useCallback(async (id: string) => {
    await api.deleteInvestment(id);
    setInvestments(prev => prev.filter(i => i.id !== id));
  }, []);

  const value = {
    subscriptions, expenses, investments, prices, spendingLimit,
    isLoading, isLoadingPrices, authToken,
    login, register, logout,
    addSubscription, deleteSubscription, updateSubscription, toggleSubscription,
    addExpense, deleteExpense, updateExpense,
    addInvestment, deleteInvestment, updateInvestment,
    setSpendingLimit
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}