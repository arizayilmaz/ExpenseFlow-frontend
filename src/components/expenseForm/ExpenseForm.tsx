    import { useState, type FormEvent } from "react";
    import { v4 as uuidv4 } from 'uuid';
    import type { ExpenseCategory, IExpense } from "../../types/types";

    interface ExpenseFormProps {
        onAddExpense: (expense: IExpense) => void;
    }

    const categoryOptions: { value: ExpenseCategory, label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'bills', label: 'Bills' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

    interface ExpenseFormProps {
    onAddExpense: (expense: IExpense) => void;
    }

    function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState<ExpenseCategory>('food'); // YENİ: Kategori için state

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if(!description || !amount) { /* ... */ }
        onAddExpense({
            id: uuidv4(),
            description,
            amount: parseFloat(amount),
            date: new Date().toISOString(),
            category, // YENİ: Kategori objeye eklendi
        });
        setDescription("");
        setAmount("");
    };
    return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-50 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold text-slate-700 border-b-2 border-blue-500 pb-2 mb-4 inline-block">
        Add New Expense
      </h3>
      {/* YENİ: Form layout'u kategori alanı için güncellendi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Expense Description" className="p-3 border border-slate-300 rounded-md md:col-span-2" />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (in TL)" className="p-3 border border-slate-300 rounded-md" />
        <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)} className="p-3 border border-slate-300 rounded-md">
          {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <button type="submit" className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold">
        Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;