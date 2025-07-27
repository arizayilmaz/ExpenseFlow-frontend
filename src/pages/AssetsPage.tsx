import { useState } from 'react';
import { useData } from '../context/DataContext';
import Dashboard from '../components/dashboard/Dashboard';
import SummaryDoughnutChart from '../components/charts/SummaryDoughnutChart';
import AssetForm from '../components/assetForm/AssetForm';
import AssetList from '../components/assetList/AssetList';
import { Spinner } from '../components/common/Spinner';

const activeChartButton = "bg-blue-600 text-white";
const inactiveChartButton = "bg-slate-100 text-slate-700 hover:bg-slate-200";

function AssetsPage() {
  const {
    subscriptions,
    expenses,
    investments,
    prices,
    isLoadingPrices,
  } = useData();

  const [chartView, setChartView] = useState<'spending' | 'investments'>('investments');

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:grid md:grid-cols-4">
      
      {/* Sol Taraf: Ana İçerik */}
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
          
          {/* Dinamik grafik bileşeni */}
          <div className="mb-12 max-w-md mx-auto">
             {isLoadingPrices ? (
                <Spinner />
             ) : (
                <SummaryDoughnutChart
                  dataType={'investments'}
                  subscriptions={subscriptions}
                  expenses={expenses}
                  investments={investments}
                  prices={prices || {}}
                />
             )}
          </div>

          <hr className="my-8 border-t-2 border-slate-200" />

          {/* Varlıkları Yönetme Alanı */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Manage Your Assets</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AssetForm />
              <AssetList />
            </div>
          </div>
        </main>
      </div>

      {/* Sağ Taraf: Dashboard */}
      <aside className="p-4 md:p-2 md:col-span-1 bg-white border-t md:border-t-0 md:border-l border-slate-200">
        <Dashboard />
      </aside>
    
    </div>
  );
}

export default AssetsPage;