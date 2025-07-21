import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import type { IExpense } from '../../types/types';

// Chart.js'e kullanacağımız ve "kayıt" etmemiz gereken elementleri tanıtıyoruz.
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Bu bileşenin dışarıdan alacağı verilerin (props) tipini belirliyoruz.
interface ChartProps {
  expenses: IExpense[];
}

/**
 * Harcamaları kategorilere göre bir halka grafikte gösteren bileşen.
 */
function ExpenseDoughnutChart({ expenses }: ChartProps) {
  
  // Veriyi chart.js'in anlayacağı formata dönüştüren mantık.
  // useMemo kullanarak bu karmaşık hesaplamanın sadece 'expenses' listesi değiştiğinde
  // yeniden yapılmasını sağlıyoruz. Bu, performansı artırır.
  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};

    // Gelen tüm harcamalar üzerinde döngüye gir
    for (const expense of expenses) {
      // Eğer harcamanın bir kategorisi yoksa, onu 'other' (Diğer) olarak kabul et.
      const category = expense.category || 'other'; 
      
      // Eğer bu kategori daha önce listeye eklenmediyse, başlangıç değerini 0 yap.
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      // Harcama tutarını, sayı olduğundan emin olarak ilgili kategori toplamına ekle.
      categoryTotals[category] += (Number(expense.amount) || 0);
    }

    // Hesaplanan toplamları etiketler (labels) ve veri (data) olarak iki ayrı diziye ayır.
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    // Chart.js'in beklediği formatta veri objesini oluştur ve döndür.
    return {
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)), // Etiketlerin baş harflerini büyük yap
      datasets: [
        {
          label: 'TL Spent',
          data: data,
          backgroundColor: [
            '#ef4444', // red-500
            '#3b82f6', // blue-500
            '#f97316', // orange-500
            '#14b8a6', // teal-500
            '#a855f7', // purple-500
            '#84cc16', // lime-500
            '#f43f5e', // rose-500
            '#64748b', // slate-500
          ],
          borderColor: '#ffffff', // Dilimler arası beyaz boşluk
          borderWidth: 2,
        },
      ],
    };
  }, [expenses]); // Bu hesaplama sadece 'expenses' prop'u değişince yeniden çalışır.
  
  // Grafiğin görünüm ayarlarını (başlık, pozisyon vb.) içeren obje.
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