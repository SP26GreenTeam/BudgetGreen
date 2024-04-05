import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { PlaidData } from '../types/interfaces';

interface PlaidDataContextValue {
  data: PlaidData | null;
  setData: Dispatch<SetStateAction<PlaidData | null>>;
}

const PlaidDataContext = createContext<PlaidDataContextValue | undefined>(undefined);

export function usePlaidData() {
  const context = useContext(PlaidDataContext);
  if (context === undefined) {
    throw new Error('usePlaidData must be used within a PlaidDataProvider');
  }
  return context;
}

interface PlaidDataProviderProps {
  children: ReactNode;
}

export const PlaidDataProvider: React.FC<PlaidDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<PlaidData | null>(null);

  return (
    <PlaidDataContext.Provider value={{ data, setData }}>
      {children}
    </PlaidDataContext.Provider>
  );
};