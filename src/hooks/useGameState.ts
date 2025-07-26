import { useState, useEffect, useCallback } from 'react';

export interface GameState {
  resources: {
    wood: number;
    metal: number;
    gold: number;
    stone: number;
    cash: number;
    diamonds: number;
  };
  buildings: {
    sawmill: { level: number; multiplier: number; };
    mine: { level: number; multiplier: number; };
    metallurgy: { level: number; multiplier: number; };
  };
  experience: number;
  employees: {
    sawmill: number;
    mine: number;
    metallurgy: number;
  };
  crypto: {
    balance: number; // en $ USD
  };
  lastCollectTime: number;
  lastFaucetTime: number;
  autoSave: boolean;
}

const INITIAL_STATE: GameState = {
  resources: {
    wood: 0,
    metal: 0,
    gold: 0,
    stone: 0,
    cash: 0,
    diamonds: 50, // Plus de diamants pour embaucher des employés
  },
  buildings: {
    sawmill: { level: 1, multiplier: 1 },
    mine: { level: 1, multiplier: 1 },
    metallurgy: { level: 1, multiplier: 1 },
  },
  experience: 0,
  employees: {
    sawmill: 1, // Commence avec 1 employé dans chaque bâtiment
    mine: 1,
    metallurgy: 1,
  },
  crypto: {
    balance: 0,
  },
  lastCollectTime: 0,
  lastFaucetTime: 0,
  autoSave: true,
};

export const EXCHANGE_RATES = {
  wood: { amount: 100000, cash: 750 },
  metal: { amount: 200000, cash: 750 },
  gold: { amount: 25000, cash: 750 },
  stone: { amount: 50000, cash: 750 },
};

export const CASH_TO_USD = 100000; // 100000 cash = 0.50 USD

export const CRYPTO_PRICES = {
  bitcoin: { name: 'Bitcoin (BTC)', price: 43000, symbol: '₿' },
  ethereum: { name: 'Ethereum (ETH)', price: 2400, symbol: 'Ξ' },
  cardano: { name: 'Cardano (ADA)', price: 0.38, symbol: '₳' },
  solana: { name: 'Solana (SOL)', price: 65, symbol: '◎' },
  dogecoin: { name: 'Dogecoin (DOGE)', price: 0.08, symbol: 'Ð' },
  polygon: { name: 'Polygon (MATIC)', price: 0.85, symbol: '⬟' },
};

export const EMPLOYEE_COSTS = {
  sawmill: 50, // diamants
  mine: 75,
  metallurgy: 100,
};

export const EMPLOYEE_PRODUCTION = {
  sawmill: 10, // bois par seconde
  mine: 5, // pierre et or par seconde
  metallurgy: 3, // métal par seconde
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('resource-game-state');
    if (saved) {
      const parsedState = JSON.parse(saved);
      // Mettre à jour les anciens saves avec les nouveaux champs
      return {
        ...INITIAL_STATE,
        ...parsedState,
        lastCollectTime: parsedState.lastCollectTime || 0,
        lastFaucetTime: parsedState.lastFaucetTime || Date.now(),
        employees: {
          sawmill: Math.max(1, parsedState.employees?.sawmill || 1),
          mine: Math.max(1, parsedState.employees?.mine || 1),
          metallurgy: Math.max(1, parsedState.employees?.metallurgy || 1),
        }
      };
    }
    return { ...INITIAL_STATE, lastFaucetTime: Date.now() };
  });

  // Sauvegarde automatique
  useEffect(() => {
    if (gameState.autoSave) {
      localStorage.setItem('resource-game-state', JSON.stringify(gameState));
    }
  }, [gameState]);

  // Production automatique des employés et faucet de diamants
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newState = { ...prev };
        const currentTime = Date.now();
        
        // Production des employés (seulement s'il y en a)
        if (prev.employees.sawmill > 0) {
          newState.resources.wood += prev.employees.sawmill * EMPLOYEE_PRODUCTION.sawmill;
        }
        if (prev.employees.mine > 0) {
          newState.resources.stone += prev.employees.mine * EMPLOYEE_PRODUCTION.mine;
          newState.resources.gold += prev.employees.mine * EMPLOYEE_PRODUCTION.mine * 0.2; // 20% de chance d'or
        }
        if (prev.employees.metallurgy > 0) {
          newState.resources.metal += prev.employees.metallurgy * EMPLOYEE_PRODUCTION.metallurgy;
        }

        // Faucet de diamants toutes les 5 minutes
        if (currentTime - prev.lastFaucetTime >= 300000) { // 5 minutes = 300000ms
          const diamondReward = Math.floor(Math.random() * 11) + 5; // Entre 5 et 15 diamants
          newState.resources.diamonds += diamondReward;
          newState.lastFaucetTime = currentTime;
        }

        return newState;
      });
    }, 1000); // Chaque seconde

    return () => clearInterval(interval);
  }, []);

  const collectResource = useCallback((type: 'wood' | 'metal' | 'gold' | 'stone', amount: number) => {
    setGameState(prev => {
      const currentTime = Date.now();
      const timeSinceLastCollect = currentTime - prev.lastCollectTime;
      const cooldownTime = 300000; // 5 minutes en millisecondes
      
      // Permettre la première collecte si lastCollectTime est 0
      if (prev.lastCollectTime !== 0 && timeSinceLastCollect < cooldownTime) {
        return prev; // Ne rien faire si le cooldown n'est pas écoulé
      }
      
      const building = type === 'wood' ? 'sawmill' : type === 'metal' ? 'metallurgy' : 'mine';
      const multiplier = prev.buildings[building].multiplier;
      const expMultiplier = 1 + (prev.experience * 0.01); // 1% par niveau d'XP
      
      const finalAmount = Math.floor(amount * multiplier * expMultiplier);
      
      return {
        ...prev,
        resources: {
          ...prev.resources,
          [type]: prev.resources[type] + finalAmount,
        },
        lastCollectTime: currentTime,
      };
    });
  }, []);

  const exchangeForCash = useCallback((resourceType: keyof typeof EXCHANGE_RATES) => {
    setGameState(prev => {
      const rate = EXCHANGE_RATES[resourceType];
      const available = prev.resources[resourceType];
      
      if (available >= rate.amount) {
        return {
          ...prev,
          resources: {
            ...prev.resources,
            [resourceType]: available - rate.amount,
            cash: prev.resources.cash + rate.cash,
          },
          experience: prev.experience + 0.5, // 0.5 XP par vente
        };
      }
      return prev;
    });
  }, []);

  const buyCrypto = useCallback((cryptoType: keyof typeof CRYPTO_PRICES, usdAmount: number) => {
    setGameState(prev => {
      const cashNeeded = usdAmount * CASH_TO_USD;
      
      if (prev.resources.cash >= cashNeeded) {
        return {
          ...prev,
          resources: {
            ...prev.resources,
            cash: prev.resources.cash - cashNeeded,
          },
          crypto: {
            ...prev.crypto,
            balance: prev.crypto.balance + usdAmount,
          },
        };
      }
      return prev;
    });
  }, []);

  const upgradeBuilding = useCallback((buildingType: keyof GameState['buildings']) => {
    setGameState(prev => {
      const building = prev.buildings[buildingType];
      const cost = building.level * 100; // Coût en diamants
      
      if (prev.resources.diamonds >= cost) {
        return {
          ...prev,
          resources: {
            ...prev.resources,
            diamonds: prev.resources.diamonds - cost,
          },
          buildings: {
            ...prev.buildings,
            [buildingType]: {
              level: building.level + 1,
              multiplier: building.multiplier + 0.5,
            },
          },
        };
      }
      return prev;
    });
  }, []);

  const hireEmployee = useCallback((buildingType: keyof GameState['employees']) => {
    setGameState(prev => {
      const cost = EMPLOYEE_COSTS[buildingType];
      
      if (prev.resources.diamonds >= cost) {
        return {
          ...prev,
          resources: {
            ...prev.resources,
            diamonds: prev.resources.diamonds - cost,
          },
          employees: {
            ...prev.employees,
            [buildingType]: prev.employees[buildingType] + 1,
          },
        };
      }
      return prev;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
    localStorage.removeItem('resource-game-state');
  }, []);

  return {
    gameState,
    collectResource,
    exchangeForCash,
    buyCrypto,
    upgradeBuilding,
    hireEmployee,
    resetGame,
  };
}