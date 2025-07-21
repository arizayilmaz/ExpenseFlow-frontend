import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IInvestment, InvestmentType } from '../types/types';

const investmentTypeOptions: { value: InvestmentType; label: string }[] = [
    // ... seçenekler aynı ...
];

interface EditModalProps {
  investment: IInvestment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedInvestment: IInvestment) => void;
}

function EditInvestmentModal({ investment, isOpen, onClose, onUpdate }: EditModalProps) {
  const [type, setType] = useState<InvestmentType>('dolar');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [apiId, setApiId] = useState('');
  // DEĞİŞİKLİK: Artık purchasePrice'ı düzenleyeceğiz.
  const [purchasePrice, setPurchasePrice] = useState('');
  
  useEffect(() => {
    if (investment) {
      setType(investment.type);
      setName(investment.name);
      setAmount(String(investment.amount));
      setApiId(investment.apiId || '');
      // DEĞİŞİKLİK: Kayıtlı veriden o anki birim fiyatını hesaplayıp state'e atıyoruz.
      if (investment.amount > 0) {
        setPurchasePrice(String(investment.initialValue / investment.amount));
      } else {
        setPurchasePrice('0');
      }
    }
  }, [investment]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!investment) return;

    // DEĞİŞİKLİK: Kaydederken de toplam başlangıç değerini yeniden hesaplıyoruz.
    const calculatedInitialValue = parseFloat(amount) * parseFloat(purchasePrice);

    onUpdate({
      ...investment,
      type,
      name,
      amount: parseFloat(amount),
      initialValue: calculatedInitialValue, // Güncellenmiş toplam maliyeti kaydediyoruz
      apiId: type === 'coin' ? apiId.toLowerCase() : undefined,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Edit Investment</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* ... select, apiId input, name input aynı ... */}
                <input type="number" step="any" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-full p-3 border border-slate-300 rounded-md" />
                
                {/* DEĞİŞİKLİK: Artık birim fiyatını düzenliyoruz */}
                <input 
                  type="number"
                  step="any"
                  value={purchasePrice}
                  onChange={e => setPurchasePrice(e.target.value)}
                  placeholder="Purchase Price (per unit, in TL)"
                  className="w-full p-3 border border-slate-300 rounded-md" />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditInvestmentModal;