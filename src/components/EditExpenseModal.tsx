import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IExpense } from '../types/types';

interface EditModalProps {
  expense: IExpense | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedExpense: IExpense) => void;
}

function EditExpenseModal({ expense, isOpen, onClose, onUpdate }: EditModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (expense) {
      setDescription(expense.description);
      setAmount(String(expense.amount));
      // Tarihi YYYY-MM-DD formatına çevirerek input'a veriyoruz
      setDate(new Date(expense.date).toISOString().split('T')[0]);
    }
  }, [expense]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!expense) return;

    onUpdate({
      ...expense, // id'yi koru
      description,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(), // Tarihi tekrar ISO formatına çevir
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
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Edit Expense</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expense Description"
                  className="w-full p-3 border border-slate-300 rounded-md"
                />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full p-3 border border-slate-300 rounded-md"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
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

export default EditExpenseModal;