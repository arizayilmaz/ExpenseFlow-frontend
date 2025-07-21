import { useState, useEffect, type FormEvent } from 'react';
import type { ISubscription, SubscriptionCategory } from '../types/types';
import GenericModal from './layout/GenericModal';

// Abonelik Ekleme formundaki kategori seçeneklerinin aynısını buraya da ekliyoruz.
const subCategoryOptions: { value: SubscriptionCategory, label: string }[] = [
  { value: 'streaming', label: 'Streaming (Netflix, etc.)' },
  { value: 'software', label: 'Software (SaaS)' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'utilities', label: 'Utilities (Phone, etc.)' },
  { value: 'health', label: 'Health (Gym, etc.)' },
  { value: 'other', label: 'Other' },
];

interface EditModalProps {
  subscription: ISubscription | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedSubscription: ISubscription) => void;
}

function EditSubscriptionModal({ subscription, isOpen, onClose, onUpdate }: EditModalProps) {
  // Form alanları için state'ler
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDay, setPaymentDay] = useState('');
  // YENİ: Kategori için de bir state ekliyoruz.
  const [category, setCategory] = useState<SubscriptionCategory>('streaming');

  // Düzenlenecek abonelik verisi geldiğinde, form alanlarını onun bilgileriyle doldurur.
  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setAmount(String(subscription.amount));
      setPaymentDay(String(subscription.paymentDay));
      // YENİ: Mevcut aboneliğin kategorisini de state'e atıyoruz.
      setCategory(subscription.category);
    }
  }, [subscription]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subscription) return;

    // Güncellenmiş verileri ana state'e gönderiyoruz.
    onUpdate({
      ...subscription, // id, lastPaidCycle gibi diğer alanları koru
      name,
      amount: parseFloat(amount),
      paymentDay: parseInt(paymentDay),
      category, // YENİ: Güncellenen objeye kategoriyi ekliyoruz.
    });
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title="Edit Subscription">
      <form onSubmit={handleSubmit}>
        {/* DÜZELTME: Eksik olan form inputları eklendi. */}
        <div className="space-y-4">
          <div>
            <label htmlFor="sub-name" className="text-sm font-medium text-slate-600">Subscription Name</label>
            <input id="sub-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-3 border border-slate-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="sub-category" className="text-sm font-medium text-slate-600">Category</label>
            <select id="sub-category" value={category} onChange={(e) => setCategory(e.target.value as SubscriptionCategory)} className="mt-1 w-full p-3 border border-slate-300 rounded-md">
                {subCategoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sub-amount" className="text-sm font-medium text-slate-600">Monthly Amount</label>
            <input id="sub-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full p-3 border border-slate-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="sub-day" className="text-sm font-medium text-slate-600">Payment Day</label>
            <input id="sub-day" type="number" value={paymentDay} min="1" max="31" onChange={(e) => setPaymentDay(e.target.value)} className="mt-1 w-full p-3 border border-slate-300 rounded-md"/>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </GenericModal>
  );
}

export default EditSubscriptionModal;