import { useState, useEffect, type FormEvent } from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';
import { FaExclamationTriangle, FaPiggyBank, FaFileInvoiceDollar, FaReceipt, FaChartLine } from 'react-icons/fa';

function Dashboard() {
  const { 
    subscriptions, 
    expenses, 
    investments, 
    prices, 
    spendingLimit, 
    setSpendingLimit 
  } = useData();
  
  const [limitInput, setLimitInput] = useState<string>('');

  useEffect(() => {
    setLimitInput(String(spendingLimit || ''));
  }, [spendingLimit]);

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

  const handleLimitSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newLimit = Number(limitInput);
    if (!isNaN(newLimit) && newLimit >= 0) {
      setSpendingLimit(newLimit);
    }
  };

  return (
    <div className="p-2 bg-white border border-slate-400 rounded-2xl shadow-sm h-full w-full max-w-md overflow-hidden">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Financial Summary</h3>
      
      {/* Harcama Limiti Belirleme Formu */}
      <form onSubmit={handleLimitSubmit} className="mb-12">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="p-6 bg-blue-50 rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full"><FaFileInvoiceDollar className="h-5 w-5 text-blue-600" /></div>
              <h3 className="text-lg font-semibold text-slate-700 ml-3">Subscriptions</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(totalSubscriptionCost)}</p>
          </div>

          <div className="p-6 bg-green-50 rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full"><FaReceipt className="h-5 w-5 text-green-600" /></div>
              <h3 className="text-lg font-semibold text-slate-700 ml-3">Monthly Expenses</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(totalMonthlyExpense)}</p>
          </div>

          <div className="p-6 bg-purple-50 rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full"><FaChartLine className="h-5 w-5 text-purple-600" /></div>
              <h3 className="text-lg font-semibold text-slate-700 ml-3">Investment P/L</h3>
            </div>
            <p className={`text-xl font-bold mt-1 ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(totalProfitLoss)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;