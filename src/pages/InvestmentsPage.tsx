import { useState } from 'react';
import { useData } from '../context/DataContext';
import InvestmentForm from '../components/InvestmentForm/InvestmentForm';
import InvestmentList from '../components/InvestmentList/InvestmentList';
import EditInvestmentModal from '../components/EditInvestmentModal';
import type { IInvestment, UpdateInvestmentRequest } from '../types/types';
import { Spinner } from '../components/common/Spinner';

function InvestmentsPage() {
  const { 
    investments, 
    addInvestment, 
    deleteInvestment, 
    updateInvestment, 
    prices, 
    isLoadingPrices 
  } = useData();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<IInvestment | null>(null);

  const handleEditInvestment = (investment: IInvestment) => {
    setEditingInvestment(investment);
    setIsEditModalOpen(true);
  };

  const handleDeleteInvestment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this investment?")) {
      deleteInvestment(id);
    }
  };
  
  return (
    <>
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800">My Investments</h1>
        <p className="mt-2 text-slate-500 mb-8">Track the performance of your assets.</p>
        
        <InvestmentForm onAddInvestment={addInvestment} />
        <hr className="my-8"/>

        {isLoadingPrices ? (
          <Spinner />
        ) : (
          <InvestmentList 
            investments={investments} 
            prices={prices!} 
            onDeleteInvestment={handleDeleteInvestment}
            onEditInvestment={handleEditInvestment}
          />
        )}
      </div>
      <EditInvestmentModal
        isOpen={isEditModalOpen}
        investment={editingInvestment}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={(updatedData: UpdateInvestmentRequest) => {
            if (editingInvestment) {
                updateInvestment(editingInvestment.id, updatedData);
            }
        }}
      />
    </>
  );
}

export default InvestmentsPage;