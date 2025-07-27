import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import type { IExpense } from '../../types/types';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface ExpenseDoughnutChartProps {
  expenses: IExpense[];
}

function ExpenseDoughnutChart({ expenses }: ExpenseDoughnutChartProps) {
  const categoryTotals: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const category = expense.category || 'other';
    categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
  });

  const labels = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);

  const chartData = {
    labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [
      {
        label: 'USD Spent',
        data: totals,
        backgroundColor: [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
          '#EC4899', '#06B6D4', '#84CC16'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Expense Breakdown',
        font: { size: 18, family: 'Inter, sans-serif' },
        color: '#1e293b' // slate-800
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}

export default ExpenseDoughnutChart;