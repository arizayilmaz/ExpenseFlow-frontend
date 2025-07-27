import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import type { IExpense, ISubscription } from '../types/types';

import ExpenseForm from '../components/expenseForm/ExpenseForm';
import ExpenseList from '../components/expenseList/ExpenseList';
import SubscriptionForm from '../components/SubscriptionForm/SubscriptionForm';
import SubscriptionList from '../components/SubscriptionList/SubscriptionList';
import EditSubscriptionModal from '../components/EditSubscriptionModal';
import EditExpenseModal from '../components/EditExpenseModal';

const buttonBaseStyle = "w-full py-3 px-5 text-center font-semibold rounded-lg transition-all duration-300";
const buttonInactiveStyle = "bg-white text-slate-700 shadow-sm hover:bg-slate-50";
const buttonActiveStyle = "text-white shadow-lg";

function HomePage() {
  const {
    expenses, subscriptions, addExpense, deleteExpense, updateExpense,
    addSubscription, deleteSubscription, updateSubscription, toggleSubscription,
  } = useData();
  
  const [visibleForm, setVisibleForm] = useState<'subscription' | 'expense' | null>(null);
  const [isEditSubscriptionModalOpen, setIsEditSubscriptionModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<ISubscription | null>(null);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<IExpense | null>(null);

  const handleEditSubscription = (subscription: ISubscription) => {
    setEditingSubscription(subscription);
    setIsEditSubscriptionModalOpen(true);
  };

  const handleEditExpense = (expense: IExpense) => {
    setEditingExpense(expense);
    setIsEditExpenseModalOpen(true);
  };

  const handleAddSubscription = (subscription: Omit<ISubscription, 'id' | 'user' | 'lastPaidCycle'>) => {
    addSubscription(subscription);
    setVisibleForm(null);
  };

  const handleAddExpense = (expense: Omit<IExpense, 'id' | 'user' | 'date'>) => {
    addExpense(expense);
    setVisibleForm(null);
  };

  const handleDeleteSubscription = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      deleteSubscription(id);
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
    }
  };

 

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <header className="text-center md:text-left border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Expenses</h1>
        <p className="text-md text-slate-500 mt-2">Track your subscriptions and one-time expenses.</p>
      </header>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setVisibleForm(visibleForm === 'subscription' ? null : 'subscription')}
              className={`${buttonBaseStyle} ${visibleForm === 'subscription' ? `${buttonActiveStyle} bg-green-600` : buttonInactiveStyle}`}
            >
              + Add New Subscription
            </button>
            <button
              onClick={() => setVisibleForm(visibleForm === 'expense' ? null : 'expense')}
              className={`${buttonBaseStyle} ${visibleForm === 'expense' ? `${buttonActiveStyle} bg-blue-600` : buttonInactiveStyle}`}
            >
              + Add New Expense
            </button>
        </div>
        <AnimatePresence>
          {visibleForm === 'subscription' && (
            <motion.div key="sub-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <SubscriptionForm onAddSubscription={handleAddSubscription} />
            </motion.div>
          )}
          {visibleForm === 'expense' && (
            <motion.div key="exp-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <ExpenseForm onAddExpense={handleAddExpense} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <hr className="my-8 border-t-2 border-slate-200" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          <SubscriptionList 
            subscriptions={subscriptions} 
            onToggleSubscription={toggleSubscription} 
            onDeleteSubscription={handleDeleteSubscription} 
            onEditSubscription={handleEditSubscription} 
          />
          <ExpenseList 
            expenses={expenses} 
            onDeleteExpense={handleDeleteExpense} 
            onEditExpense={handleEditExpense} 
          />
        </div>
      </section>
      
      <EditSubscriptionModal 
        isOpen={isEditSubscriptionModalOpen} 
        subscription={editingSubscription} 
        onClose={() => setIsEditSubscriptionModalOpen(false)} 
        // DÜZELTME: onUpdate prop'una yeni bir arrow function gönderiyoruz.
        onUpdate={(updatedData) => {
            if (editingSubscription) {
                updateSubscription(editingSubscription.id, updatedData);
            }
        }} 
      />
      <EditExpenseModal 
        isOpen={isEditExpenseModalOpen} 
        expense={editingExpense} 
        onClose={() => setIsEditExpenseModalOpen(false)} 
        // DÜZELTME: Aynısını Expense için de yapıyoruz.
        onUpdate={(updatedData) => {
            if (editingExpense) {
                updateExpense(editingExpense.id, updatedData);
            }
        }} 
      />
    </div>
  );
}

export default HomePage;