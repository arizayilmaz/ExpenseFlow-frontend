import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { Spinner } from '../components/common/Spinner';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart'; // Şimdi oluşturacağız

function ReportsPage() {
    const { monthlySummary, fetchMonthlySummary } = useData();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchMonthlySummary();
            setIsLoading(false);
        };
        loadData();
    }, [fetchMonthlySummary]);

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
            <p className="mt-2 text-slate-500 mb-8">Analyze your financial trends over time.</p>
            
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="h-96">
                    <MonthlyTrendChart data={monthlySummary} />
                </div>
            )}
        </div>
    );
}

export default ReportsPage;