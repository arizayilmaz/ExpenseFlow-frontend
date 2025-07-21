import { useState, useEffect, type FormEvent } from 'react';
import type { IExpense, ISubscription, IInvestment } from '../../types/types';
import type { PriceData } from '../../services/api';
import { useData } from '../../context/DataContext';
import { 
  FaFileInvoiceDollar, 
  FaReceipt, 
  FaCoins, 
  FaChartLine, 
  FaExclamationTriangle, 
  FaPiggyBank 
} from 'react-icons/fa';

// Para birimini formatlamak için kullanılan yardımcı fonksiyon.
const formatCurrency = (amount: number): string => {
  // NaN veya null gibi durumlarda '0.00 TL' döndürerek hatayı engelle
  if (isNaN(amount) || amount === null) {
    return '0.00 TL';
  }
  return amount.toFixed(2) + ' TL';
};

/**
 * Finansal özeti ve bütçe limit durumunu gösteren Dashboard bileşeni.
 * Tüm verilerini merkezi DataContext'ten alır.
 */
function Dashboard() {
  const { 
    subscriptions, 
    expenses, 
    investments, 
    prices, 
    spendingLimit, 
    setSpendingLimit 
  } = useData();
  
  // Limiti girmek için kullanılan input alanının kendi local state'i.
  const [limitInput, setLimitInput] = useState<string>('');

  // Global 'spendingLimit' state'i değiştiğinde, input alanını da güncelliyoruz.
  useEffect(() => {
    setLimitInput(String(spendingLimit || ''));
  }, [spendingLimit]);

  // --- HESAPLAMALAR ---

  const totalSubscriptionCost = subscriptions.reduce((sum, sub) => sum + (Number(sub.amount) || 0), 0);

  const today = new Date();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
  });
  const totalMonthlyExpense = monthlyExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  
  const grandTotal = totalSubscriptionCost + totalMonthlyExpense;

  const totalInitialValue = investments.reduce((sum, inv) => sum + (Number(inv.initialValue) || 0), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => {
    const priceKey = inv.type === 'coin' ? inv.apiId : inv.type;
    const currentPrice = (priceKey && prices) ? (Number(prices[priceKey]) || 0) : 0;
    return sum + ((Number(inv.amount) || 0) * currentPrice);
  }, 0);
  
  const totalProfitLoss = totalCurrentValue - totalInitialValue;

  const remainingBudget = (Number(spendingLimit) || 0) - grandTotal;

  // Form gönderildiğinde limiti güncelleyen fonksiyon
  const handleLimitSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newLimit = Number(limitInput);
    if (!isNaN(newLimit) && newLimit >= 0) {
      setSpendingLimit(newLimit);
    }
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Financial Summary</h3>
      
      {/* Harcama Limiti Belirleme Formu */}
      <form onSubmit={handleLimitSubmit} className="mb-4">
        <label htmlFor="limit" className="text-sm font-medium text-slate-600">Set Monthly Limit</label>
        <div className="flex items-center gap-2 mt-1">
          <input
            id="limit"
            type="number"
            value={limitInput}
            onChange={(e) => setLimitInput(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md"
            placeholder="e.g., 5000"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Set</button>
        </div>
      </form>

      <div className="flex flex-col space-y-4 mt-4">
        {/* Bütçe Durum Kartı (Sadece limit belirlendiğinde gösterilir) */}
        {spendingLimit > 0 && (
          <div className={`flex items-start p-4 rounded-lg ${remainingBudget < 0 ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
            <div className={`p-3 rounded-full ${remainingBudget < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              {remainingBudget < 0 ? (
                <FaExclamationTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <FaPiggyBank className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">
                {remainingBudget < 0 ? 'Limit Exceeded' : 'Remaining Budget'}
              </p>
              <p className={`text-xl font-bold mt-1 ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(remainingBudget)}
              </p>
            </div>
          </div>
        )}

        {/* Diğer Özet Kartları */}
        <div className="flex items-start p-4 bg-slate-50 rounded-lg">
          <div className="p-3 bg-blue-100 rounded-full"><FaFileInvoiceDollar className="h-5 w-5 text-blue-600" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Subscriptions</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalSubscriptionCost)}</p>
          </div>
        </div>

        <div className="flex items-start p-4 bg-slate-50 rounded-lg">
          <div className="p-3 bg-orange-100 rounded-full"><FaReceipt className="h-5 w-5 text-orange-600" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">This Month's Expenses</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalMonthlyExpense)}</p>
          </div>
        </div>
        
        <div className="flex items-start p-4 bg-slate-50 rounded-lg">
          <div className="p-3 bg-purple-100 rounded-full"><FaChartLine className="h-5 w-5 text-purple-600" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Investment P/L</p>
            <p className={`text-xl font-bold mt-1 ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(totalProfitLoss)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;