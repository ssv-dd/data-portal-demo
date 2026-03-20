import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  pinnedCards: string[];
  addPinnedCard: (id: string) => void;
  clearPinnedCards: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pinnedCards, setPinnedCards] = useState<string[]>([]);

  const addPinnedCard = (id: string) => {
    if (!pinnedCards.includes(id)) {
      setPinnedCards([...pinnedCards, id]);
    }
  };

  const clearPinnedCards = () => {
    setPinnedCards([]);
  };

  return (
    <AppContext.Provider value={{ pinnedCards, addPinnedCard, clearPinnedCards }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
