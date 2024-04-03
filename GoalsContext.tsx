import React, { createContext, useContext, useState, ReactNode } from 'react';

type Goal = {
  id: string;
  title: string;
  amount: number;
  priority: number;
};

interface GoalsContextType {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export const GoalsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  return (
    <GoalsContext.Provider value={{ goals, setGoals }}>
      {children}
    </GoalsContext.Provider>
  );
};

export default GoalsContext;