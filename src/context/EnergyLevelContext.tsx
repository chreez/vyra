import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type EnergyLevel = 'tired' | 'medium';

interface EnergyLevelContextType {
  energyLevel: EnergyLevel | null;
  setEnergyLevel: (level: EnergyLevel) => void;
  hasSelectedEnergy: boolean;
  showSplash: boolean;
  dismissSplash: () => void;
  hasVariants: boolean;
  setHasVariants: (value: boolean) => void;
}

const EnergyLevelContext = createContext<EnergyLevelContextType | null>(null);

// Version the keys to bust cache when needed
const STORAGE_VERSION = 'v2';
const STORAGE_KEY = `vyra-energy-level-${STORAGE_VERSION}`;
const SPLASH_DISMISSED_KEY = `vyra-energy-splash-dismissed-${STORAGE_VERSION}`;

interface EnergyLevelProviderProps {
  children: ReactNode;
}

export function EnergyLevelProvider({ children }: EnergyLevelProviderProps) {
  const [energyLevel, setEnergyLevelState] = useState<EnergyLevel | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [hasSelectedEnergy, setHasSelectedEnergy] = useState(false);
  const [hasVariants, setHasVariants] = useState(true); // Default true for non-article pages

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as EnergyLevel | null;
    const splashDismissed = localStorage.getItem(SPLASH_DISMISSED_KEY);

    if (stored) {
      setEnergyLevelState(stored);
      setHasSelectedEnergy(true);
    }

    // Show splash if user hasn't dismissed it and hasn't selected energy
    if (!splashDismissed && !stored) {
      setShowSplash(true);
    }
  }, []);

  const setEnergyLevel = (level: EnergyLevel) => {
    setEnergyLevelState(level);
    setHasSelectedEnergy(true);
    localStorage.setItem(STORAGE_KEY, level);
    localStorage.setItem(SPLASH_DISMISSED_KEY, 'true');
    setShowSplash(false);
  };

  const dismissSplash = () => {
    localStorage.setItem(SPLASH_DISMISSED_KEY, 'true');
    setShowSplash(false);
  };

  return (
    <EnergyLevelContext.Provider
      value={{
        energyLevel,
        setEnergyLevel,
        hasSelectedEnergy,
        showSplash,
        dismissSplash,
        hasVariants,
        setHasVariants,
      }}
    >
      {children}
    </EnergyLevelContext.Provider>
  );
}

export function useEnergyLevel() {
  const context = useContext(EnergyLevelContext);
  if (!context) {
    throw new Error('useEnergyLevel must be used within an EnergyLevelProvider');
  }
  return context;
}
