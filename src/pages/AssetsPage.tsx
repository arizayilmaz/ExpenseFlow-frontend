import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import Dashboard from '../components/dashboard/Dashboard';
import SummaryDoughnutChart from '../components/charts/SummaryDoughnutChart';

// Buton stilleri
const activeChartButton = "bg-blue-600 text-white";
const inactiveChartButton = "bg-slate-100 text-slate-700 hover:bg-slate-200";

function AssetsPage() {
  const { subscriptions, expenses, investments, prices, isLoadingPrices } = useData();
  
  // Hangi grafiğin gösterileceğini tutan state ('spending' veya 'investments')
  const [chartView, setChartView] = useState<'spending' | 'investments'>('spending');

  // Sadece bu ayki harcamaları filtrelemek için useMemo
  const monthlyExpenses = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  }, [expenses]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:grid md:grid-cols-4">
      
      {/* Sol Taraf: Ana İçerik ve Grafikler */}
      <div className="p-6 md:p-10 md:col-span-3 border-b md:border-b-0 md:border-r border-slate-200">
        <header className="text-center md:text-left border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Assets</h1>
          <p className="text-md text-slate-500 mt-2">
            An overview of your financial assets and spending habits.
          </p>
        </header>
        <main>
          {/* Grafik değiştirme butonları */}
          <div className="flex items-center justify-center space-x-2 mb-6 p-1 bg-slate-100 rounded-lg">
            <button 
              onClick={() => setChartView('spending')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${chartView === 'spending' ? activeChartButton : inactiveChartButton}`}
            >
              Spending Breakdown
            </button>
            <button
              onClick={() => setChartView('investments')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${chartView === 'investments' ? activeChartButton : inactiveChartButton}`}
            >
              Investment Allocation
            </button>
          </div>
          
          {/* Dinamik grafik bileşenimiz */}
          <div className="mb-12 max-w-md mx-auto">
             {isLoadingPrices ? (
                <p className="text-center p-10 text-slate-500">Loading Chart Data...</p>
             ) : (
                <SummaryDoughnutChart
                    key={`${chartView}-${expenses.length}-${subscriptions.length}-${investments.length}`}
                  dataType={chartView}
                  subscriptions={subscriptions}
                  expenses={monthlyExpenses}
                  investments={investments}
                  prices={prices}
                />
             )}
          </div>
        </main>
      </div>

      <aside className="p-6 md:p-10 md:col-span-1 bg-white border-t md:border-t-0 md:border-l border-slate-200">
        <Dashboard />
      </aside>
      
    </div>
  );
}

export default AssetsPage;