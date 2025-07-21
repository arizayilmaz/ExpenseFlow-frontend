import { useState } from 'react';

// Bu hook, her türlü veri tipiyle çalışabilmesi için generic (<T>) yapıda
export function useModal<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<T | null>(null);

  const openModal = (data: T) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null); // Kapatırken datayı temizle
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
  };
}