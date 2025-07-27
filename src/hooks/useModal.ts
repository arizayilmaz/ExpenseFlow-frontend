// src/hooks/useModal.ts
import { useState } from 'react';

export function useModal<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<T | null>(null);

  const openModal = (data: T) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null);
  };

  return { isOpen, modalData, openModal, closeModal };
}