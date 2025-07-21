import { useState, type FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { IInvestment, InvestmentType, SelectOption } from '../../types/types';
import AsyncSelect from 'react-select/async';
import { searchCoins } from '../../services/api';

const investmentTypeOptions: { value: InvestmentType; label: string }[] = [
  { value: 'dollar', label: 'Dollar' },
  { value: 'euro', label: 'Euro' },
  { value: 'gold', label: 'Gold (Gram)' },
  { value: 'silver', label: 'Silver (Gram)' },
  { value: 'coin', label: 'Crypto Coin' },
  { value: 'interest', label: 'Interest / Deposit' },
];

interface InvestmentFormProps {
  onAddInvestment: (investment: IInvestment) => void;
}

function InvestmentForm({ onAddInvestment }: InvestmentFormProps) {
  const [type, setType] = useState<InvestmentType>('coin');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<SelectOption | null>(null);

   const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!type || !name || !amount || !purchasePrice || (type === 'coin' && !selectedCoin)) {
      alert('Please fill all fields and select a coin from the list!');
      return;
    }

    const calculatedInitialValue = parseFloat(amount) * parseFloat(purchasePrice);

    onAddInvestment({
      type,
      name,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice), 
      apiId: (type === 'coin' && selectedCoin) ? selectedCoin.value : undefined,
    });

    setName('');
    setAmount('');
    setPurchasePrice('');
    setSelectedCoin(null);
  };

  const loadCoinOptions = (
    inputValue: string,
    callback: (options: SelectOption[]) => void
  ) => {
    setTimeout(() => {
      if (inputValue) {
        searchCoins(inputValue).then(options => callback(options));
      } else {
        callback([]);
      }
    }, 500);
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
              noOptionsMessage={({ inputValue }) => 
                !inputValue ? "Start typing to search..." : "No coins found"
              }
            />
          </div>
        )}

        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Investment Name (e.g., My BTC Wallet)" className="p-3 border border-slate-300 rounded-md" />
        <input type="number" step="any" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (e.g., 0.5)" className="p-3 border border-slate-300 rounded-md" />
        <input type="number" step="any" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} placeholder="Purchase Price (per unit, in TL)" className="p-3 border border-slate-300 rounded-md md:col-span-2" />
      </div>
      <button type="submit" className="w-full mt-4 bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 font-semibold">
        Add Investment
      </button>
    </form>
  );
}

export default InvestmentForm;