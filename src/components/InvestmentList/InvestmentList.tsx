
import { formatCurrency } from '../../utils/formatters';
import type { IInvestment } from '../../types/types';
import type { PriceData } from '../../services/api';
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';

interface InvestmentListProps {
  investments: IInvestment[];
  prices: PriceData;
  
  onDeleteInvestment: (id: string) => void;
  onEditInvestment: (investment: IInvestment) => void;
}

function InvestmentList({ investments, prices, onDeleteInvestment, onEditInvestment }: InvestmentListProps) {
  return (
    <div className="space-y-4">
      {investments.map(inv => {
        const priceKey = inv.type === 'coin' ? inv.apiId : inv.type;
        const currentPrice = priceKey ? prices[priceKey] : 0;
        const currentValue = inv.amount * currentPrice;
        const profitLoss = currentValue - inv.initialValue;
        
        const isProfit = profitLoss > 0;
        const isLoss = profitLoss < 0;

        return (
          <div key={inv.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <p className="font-bold text-slate-800">{inv.name}</p>
                <p className="text-sm text-slate-500 capitalize">{inv.type}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Initial Value</p>
                <p className="font-semibold">{formatCurrency(inv.initialValue)}</p>
                <p className="text-xs text-slate-400 mt-2">Current Value</p>
                <p className="font-bold text-lg">{formatCurrency(currentValue)}</p>
              </div>
              <div className={`text-right font-bold text-lg flex items-center justify-end ${isProfit && 'text-green-600'} ${isLoss && 'text-red-600'}`}>
                {isProfit && <FaArrowUp className="mr-2" />}
                {isLoss && <FaArrowDown className="mr-2" />}
                {!isProfit && !isLoss && <FaEquals className="mr-2" />}
                {formatCurrency(profitLoss)}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-slate-100">
              <button onClick={() => onEditInvestment(inv)} className="text-xs font-medium text-slate-500 hover:text-blue-600 px-2 py-1 rounded">
                Edit
              </button>
              <span className="text-slate-300">|</span>
              <button onClick={() => onDeleteInvestment(inv.id)} className="text-xs font-medium text-slate-500 hover:text-red-600 px-2 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InvestmentList;