import { useState, type FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
// YENİ: SubscriptionCategory tipi import edildi
import type { ISubscription, SubscriptionCategory } from '../../types/types';

// YENİ: Abonelik kategorisi seçenekleri
const subCategoryOptions: { value: SubscriptionCategory, label: string }[] = [
  { value: 'streaming', label: 'Streaming (Netflix, etc.)' },
  { value: 'software', label: 'Software (SaaS)' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'utilities', label: 'Utilities (Phone, etc.)' },
  { value: 'health', label: 'Health (Gym, etc.)' },
  { value: 'other', label: 'Other' },
];

interface SubscriptionFormProps {
  onAddSubscription: (subscription: ISubscription) => void;
}

function SubscriptionForm({ onAddSubscription }: SubscriptionFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDay, setPaymentDay] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory>('streaming'); // YENİ: Kategori için state

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !paymentDay) {
      alert('Please fill in all fields!');
      return;
    }
    onAddSubscription({
      id: uuidv4(),
      name,
      amount: parseFloat(amount),
      paymentDay: parseInt(paymentDay),
      category, // YENİ: Kategori objeye eklendi
    });
    setName('');
    setAmount('');
    setPaymentDay('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-50 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold text-slate-700 border-b-2 border-green-500 pb-2 mb-4 inline-block">
        Add New Subscription
      </h3>
      {/* YENİ: Form layout'u kategori alanı için güncellendi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Subscription Name (e.g., Netflix)" className="p-3 border border-slate-300 rounded-md" />
        <select value={category} onChange={(e) => setCategory(e.target.value as SubscriptionCategory)} className="p-3 border border-slate-300 rounded-md">
          {subCategoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Monthly Amount" className="p-3 border border-slate-300 rounded-md" />
        <input type="number" value={paymentDay} min="1" max="31" onChange={(e) => setPaymentDay(e.target.value)} placeholder="Payment Day (1-31)" className="p-3 border border-slate-300 rounded-md" />
      </div>
      <button type="submit" className="w-full mt-4 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold">
        Add Subscription
      </button>
    </form>
  );
}

export default SubscriptionForm;