import { useState } from 'react';
import { useData } from '../context/DataContext'; // Verilerimizi ve fonksiyonlarımızı buradan alıyoruz
import InvestmentForm from '../components/InvestmentForm/InvestmentForm';
import InvestmentList from '../components/InvestmentList/InvestmentList';
import EditInvestmentModal from '../components/EditInvestmentModal';
import type { IInvestment } from '../types/types';

function InvestmentsPage() {
  // Gerekli her şeyi (fiyatlar ve yüklenme durumu dahil) merkezi useData hook'undan alıyoruz.
  const { 
    investments, 
    addInvestment, 
    deleteInvestment, 
    updateInvestment, 
    prices, 
    isLoadingPrices 
  } = useData();

  // Bu sayfaya özel state'ler (modal kontrolü için) burada kalıyor.
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

        {/* Merkezi state'imiz olan isLoadingPrices'ı kullanıyoruz */}
        {isLoadingPrices ? (
          <p className="text-center text-slate-500">Loading current prices...</p>
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
        onUpdate={updateInvestment}
      />
    </>
  );
}

export default InvestmentsPage;