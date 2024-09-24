import { useContext } from 'react';
import { RevenueContext } from '../contexts/revenue-context-provider';

export function useRevenueContext() {
  const context = useContext(RevenueContext);

  if (!context) {
    throw new Error('usePetContext must be used within a PetContextProvider');
  }

  return context;
}
