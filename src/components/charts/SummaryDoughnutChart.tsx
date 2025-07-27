import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, Chart } from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { formatCurrency } from '../../utils/formatters';
import type { IExpense, ISubscription, IInvestment } from '../../types/types';
import type { PriceData } from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface ChartDataItem {
  label: string;
  value: number;
  currentValue: number;
  profitLoss?: number;
}

interface ChartProps {
  dataType: 'spending' | 'investments';
  subscriptions: ISubscription[];
  expenses: IExpense[];
  investments: IInvestment[];
  prices: PriceData | null;
}

const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart: Chart) => {
    const { ctx, chartArea: { top, left, width, height } } = chart;
    ctx.save();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const dataValues = chart.data.datasets[0].data as number[];
    const total = dataValues.reduce((acc, value) => acc + (value || 0), 0);
    
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${formatCurrency(total)}`, centerX, centerY - 10);
    
    ctx.font = 'normal 14px Inter, sans-serif';
    ctx.fillText('Total', centerX, centerY + 15);
    ctx.restore();
  }
};

function SummaryDoughnutChart({ dataType, subscriptions, expenses, investments, prices }: ChartProps) {
  const { chartData, chartOptions } = useMemo(() => {
    let data: ChartDataItem[] = [];
    let titleText = '';

    if (dataType === 'spending') {
      const totalSubscriptionCost = subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
      const today = new Date();
      const monthlyExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
      });
      const totalMonthlyExpense = monthlyExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      
      data = [
        { label: 'Subscriptions', value: totalSubscriptionCost, currentValue: totalSubscriptionCost },
        { label: 'One-Time Expenses', value: totalMonthlyExpense, currentValue: totalMonthlyExpense }
      ];
      titleText = 'Monthly Spending Breakdown';
    } else if (dataType === 'investments') {
      titleText = 'Investment Portfolio Allocation';
      const portfolioItems = investments.map(inv => {
        const priceKey = inv.type === 'coin' ? inv.apiId : inv.type;
        const currentPrice = priceKey ? (prices?.[priceKey] || 0) : 0;
        const currentValue = inv.amount * currentPrice;
        const profitLoss = currentValue - inv.initialValue;
        
        return {
          label: inv.name,
          value: currentValue,
          currentValue: currentValue,
          profitLoss: profitLoss,
        };
      });

      data = portfolioItems;
    }

    const finalChartData = {
      labels: data.map(item => item.label),
      datasets: [{
        data: data.map(item => item.value),
        backgroundColor: ['#3b82f6', '#ef4444', '#a855f7', '#f97316', '#eab308', '#84cc16', '#14b8a6', '#f43f5e'],
        borderColor: '#ffffff',
        borderWidth: 2,
      }],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: titleText, font: { size: 18 } },
        centerText: { total: data.reduce((sum, item) => sum + item.value, 0) },
        tooltip: {
          callbacks: {
            label: function(context: TooltipItem<'doughnut'>) {
              const itemIndex = context.dataIndex;
              const item = data[itemIndex];

              if (!item) return '';
              
              const currentValueStr = `Value: ${formatCurrency(item.currentValue)}`;
              
              if (item.profitLoss !== undefined) {
                const profitStr = `P/L: ${formatCurrency(item.profitLoss)}`;
                return [item.label, currentValueStr, profitStr];
              }
              
              return `${item.label}: ${currentValueStr}`;
            },
            labelColor: function(context: TooltipItem<'doughnut'>) {
              const itemIndex = context.dataIndex;
              const item = data[itemIndex];
              if(item && item.profitLoss && item.profitLoss > 0) return { borderColor: '#16a34a', backgroundColor: '#16a34a' };
              if(item && item.profitLoss && item.profitLoss < 0) return { borderColor: '#dc2626', backgroundColor: '#dc2626' };
              return { borderColor: '#6b7280', backgroundColor: '#6b7280' };
            }
          }
        }
      },
      elements: {
        arc: {
          borderWidth: (context: { dataIndex: number }) => {
            const item = data[context.dataIndex];
            return item && item.profitLoss !== undefined ? 3 : 2;
          },
          borderColor: (context: { dataIndex: number }) => {
            const item = data[context.dataIndex];
            if(item && item.profitLoss && item.profitLoss > 0) return '#16a34a';
            if(item && item.profitLoss && item.profitLoss < 0) return '#dc2626';
            return '#ffffff';
          }
        }
      }
    };

    return { chartData: finalChartData, chartOptions: options };
  }, [dataType, subscriptions, expenses, investments, prices]);

  return <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />;
}

export default SummaryDoughnutChart;