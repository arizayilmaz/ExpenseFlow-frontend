import { useState, useEffect, type FormEvent } from 'react';
import type { InvestmentType, SelectOption } from '../../types/types';
import AsyncSelect from 'react-select/async';
import { searchCoins } from '../../services/api';
import toast from 'react-hot-toast';

const investmentTypeOptions: { value: InvestmentType; label: string }[] = [
  { value: 'coin', label: 'Crypto Coin' },
  { value: 'gold', label: 'Gold (gram)' },
  { value: 'silver', label: 'Silver (gram)' },
];

interface InvestmentFormProps {
  onAddInvestment: (data: { type: InvestmentType; name: string; amount: number; purchasePrice: number; apiId?: string; }) => void;
}

function InvestmentForm({ onAddInvestment }: InvestmentFormProps) {
  const [type, setType] = useState<InvestmentType>('coin');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<SelectOption | null>(null);

  useEffect(() => {
    if (type === 'coin' && selectedCoin) {
      setName(selectedCoin.label);
    } else if (type !== 'coin') {
      const selectedOption = investmentTypeOptions.find(opt => opt.value === type);
      setName(selectedOption ? selectedOption.label : '');
    } else {
      setName('');
    }
  }, [selectedCoin, type]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!type || !amount || !purchasePrice || (type === 'coin' && !selectedCoin)) {
      toast.error('Please fill all fields!');
      return;
    }
    try {
      await onAddInvestment({
        type,
        name,
        amount: parseFloat(amount),
        purchasePrice: parseFloat(purchasePrice),
        apiId: (type === 'coin' && selectedCoin) ? selectedCoin.value : undefined,
      });
      toast.success('Investment added!');
      setAmount('');
      setPurchasePrice('');
      setSelectedCoin(null);
    } catch {
      toast.error('Failed to add investment.');
    }
  };

  const loadCoinOptions = (inputValue: string, callback: (options: SelectOption[]) => void) => {
    setTimeout(() => {
      if (inputValue) searchCoins(inputValue).then(options => callback(options));
      else callback([]);
    }, 500);
  };

  const getAmountPlaceholder = () => {
    if (type === 'gold' || type === 'silver') return 'Amount (in grams)';
    if (type === 'coin') return 'Amount (e.g., 0.5)';
    return 'Amount';
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-50 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold text-slate-700 border-b-2 border-purple-500 pb-2 mb-4 inline-block">
        Add New Investment
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select value={type} onChange={(e) => setType(e.target.value as InvestmentType)} className="p-3 border border-slate-300 rounded-md md:col-span-2">
          {investmentTypeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        {type === 'coin' && (
          <div className="md:col-span-2">
            <AsyncSelect
              cacheOptions
              loadOptions={loadCoinOptions}
              defaultOptions
              value={selectedCoin}
              onChange={(option) => setSelectedCoin(option as SelectOption)}
              placeholder="Search for a coin (e.g., Bitcoin, Ethereum...)"
            />
          </div>
        )}

        <input type="hidden" value={name} />
        <input type="number" step="any" value={amount} onChange={e => setAmount(e.target.value)} placeholder={getAmountPlaceholder()} className="p-3 border border-slate-300 rounded-md" />
        <input type="number" step="any" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} placeholder="Purchase Price (per unit, in USD)" className="p-3 border border-slate-300 rounded-md" />
      </div>
      <button type="submit" className="w-full mt-4 bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 font-semibold">
        Add Investment
      </button>
    </form>
  );
}

export default InvestmentForm;
