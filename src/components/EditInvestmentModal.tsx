import { useState, useEffect, type FormEvent } from 'react';
import type { IInvestment, InvestmentType, SelectOption, UpdateInvestmentRequest } from '../types/types';
import AsyncSelect from 'react-select/async';
import { searchCoins } from '../services/api';
import toast from 'react-hot-toast';
import GenericModal from './layout/GenericModal';

const investmentTypeOptions: { value: InvestmentType; label: string }[] = [
  { value: 'coin', label: 'Crypto Coin' },
  { value: 'gold', label: 'Gold (gram)' },
  { value: 'silver', label: 'Silver (gram)' },
];

interface EditInvestmentModalProps {
  isOpen: boolean;
  investment: IInvestment | null;
  onClose: () => void;
  onUpdate: (updatedData: UpdateInvestmentRequest) => void;
}

function EditInvestmentModal({ isOpen, investment, onClose, onUpdate }: EditInvestmentModalProps) {
  const [type, setType] = useState<InvestmentType>('coin');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<SelectOption | null>(null);

  useEffect(() => {
    if (investment) {
      setType(investment.type);
      setName(investment.name);
      setAmount(String(investment.amount));
      setPurchasePrice(String(investment.initialValue / investment.amount));
      if (investment.type === 'coin' && investment.apiId) {
        setSelectedCoin({ value: investment.apiId, label: investment.name });
      }
    }
  }, [investment]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!type || !amount || !purchasePrice || (type === 'coin' && !selectedCoin)) {
      toast.error('Please fill all fields!');
      return;
    }
    try {
      const updatedData: UpdateInvestmentRequest = {
        name: type === 'coin' && selectedCoin ? selectedCoin.label : name,
        amount: parseFloat(amount),
        purchasePrice: parseFloat(purchasePrice),
        apiId: (type === 'coin' && selectedCoin) ? selectedCoin.value : undefined,
      };
      onUpdate(updatedData);
      toast.success('Investment updated!');
      onClose();
    } catch {
      toast.error('Failed to update investment.');
    }
  };

  const loadCoinOptions = (inputValue: string, callback: (options: SelectOption[]) => void) => {
    setTimeout(() => {
      if (inputValue) searchCoins(inputValue).then(options => callback(options));
      else callback([]);
    }, 500);
  };

  if (!investment) return null;

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title="Edit Investment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value as InvestmentType)} 
          className="w-full p-3 border border-slate-300 rounded-md"
        >
          {investmentTypeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        {type === 'coin' && (
          <AsyncSelect
            cacheOptions
            loadOptions={loadCoinOptions}
            defaultOptions
            value={selectedCoin}
            onChange={(option) => setSelectedCoin(option as SelectOption)}
            placeholder="Search for a coin"
          />
        )}

        <input 
          type="number" 
          step="any" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          placeholder="Amount" 
          className="w-full p-3 border border-slate-300 rounded-md" 
        />
        
        <input 
          type="number" 
          step="any" 
          value={purchasePrice} 
          onChange={e => setPurchasePrice(e.target.value)} 
          placeholder="Purchase Price (per unit, in USD)" 
          className="w-full p-3 border border-slate-300 rounded-md" 
        />
        
        <div className="flex gap-3 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Update
          </button>
        </div>
      </form>
    </GenericModal>
  );
}

export default EditInvestmentModal;
