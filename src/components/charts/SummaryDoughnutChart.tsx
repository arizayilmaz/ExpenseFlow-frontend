import { useMemo, useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, Chart } from 'chart.js';
import type { IExpense, ISubscription, IInvestment } from '../../types/types';
import type { PriceData } from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ensureNumber = (value: any): number => Number(value) || 0;

interface ChartProps {
  dataType: 'spending' | 'investments';
  subscriptions: ISubscription[];
  expenses: IExpense[];
  investments: IInvestment[];
  prices: PriceData | null;
}

function SummaryDoughnutChart({ dataType, subscriptions, expenses, investments, prices }: ChartProps) {
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // This effect ensures the old chart instance is destroyed before a new one is created.
  useEffect(() => {
    const chart = chartRef.current;
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []); // The empty array ensures this cleanup runs only when the component unmounts.


  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      const total = chart.config.options?.plugins?.centerText?.total || 0;
      
      ctx.save();
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${total.toFixed(2)} TL`, centerX, centerY - 10);
      
      ctx.font = 'normal 14px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Total', centerX, centerY + 15);
      ctx.restore();
    }
  };

  const { chartData, chartOptions } = useMemo(() => {
    let labels: string[] = [];
    let data: number[] = [];
    let titleText = '';
    let total = 0;
    let detailedData: any[] = [];

    if (dataType === 'spending') {
      titleText = 'Monthly Spending Breakdown';
      const totalSubscriptionCost = subscriptions.reduce((sum, sub) => sum + ensureNumber(sub.amount), 0);
      const today = new Date();
      const monthlyExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
      });
      const totalMonthlyExpense = monthlyExpenses.reduce((sum, exp) => sum + ensureNumber(exp.amount), 0);
      
      labels = ['Subscriptions', 'One-Time Expenses'];
      data = [totalSubscriptionCost, totalMonthlyExpense];
      total = totalSubscriptionCost + totalMonthlyExpense;
      detailedData = data.map((value, index) => ({ label: labels[index], currentValue: value }));

    } else if (dataType === 'investments') {
      titleText = 'Investment Portfolio Allocation';
      
      const portfolioItems = investments.map(inv => {
        const priceKey = inv.type === 'coin' ? inv.apiId : inv.type;
        const currentPrice = ensureNumber(priceKey && prices ? prices[priceKey] : 0);
        const currentValue = ensureNumber(inv.amount) * currentPrice;
        const initialValue = ensureNumber(inv.initialValue);
        const profitLoss = currentValue - initialValue;

        return {
          label: inv.name,
          currentValue: currentValue,
          profitLoss: profitLoss,
        };
      });

      labels = portfolioItems.map(p => p.label);
      data = portfolioItems.map(p => p.currentValue);
      total = data.reduce((sum, val) => sum + val, 0);
      detailedData = portfolioItems;
    }

    const finalChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#3b82f6', '#ef4444', '#a855f7', '#f97316', '#eab308', '#84cc16', '#14b8a6', '#f43f5e'],
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 8,
      }],
    };

    const finalChartOptions = {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        title: { display: true, text: titleText, font: { size: 18 } },
        centerText: { total: total },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const itemIndex = context.dataIndex;
              const item = detailedData[itemIndex];

              if (!item) return '';
              
              const currentValueStr = `Value: ${item.currentValue.toFixed(2)} TL`;

              if (item.profitLoss !== undefined) {
                const profitStr = `P/L: ${item.profitLoss.toFixed(2)} TL`;
                return [` ${context.label}`, `   ${currentValueStr}`, `   ${profitStr}`];
              }
              
              return ` ${context.label}: ${currentValueStr}`;
            },
            labelColor: function(context: any) {
              const itemIndex = context.dataIndex;
              const item = detailedData[itemIndex];
              if(item && item.profitLoss > 0) return { borderColor: '#16a34a', backgroundColor: '#16a34a' };
              if(item && item.profitLoss < 0) return { borderColor: '#dc2626', backgroundColor: '#dc2626' };
              return { borderColor: '#475569', backgroundColor: '#475569' };
            }
          }
        }
      },
    };

    return { chartData: finalChartData, chartOptions: finalChartOptions as any };

  }, [dataType, subscriptions, expenses, investments, prices]);

  if (chartData.datasets[0].data.length === 0 || chartData.datasets[0].data.every(item => item === 0)) {
    return (
      <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-xl">
        <p className="text-slate-500">No data to display for this view.</p>
      </div>
    );
  }

  return <Doughnut ref={chartRef} data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />;
}

export default SummaryDoughnutChart;