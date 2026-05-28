import type { Stock } from '@/types/stock';

const STORAGE_KEY = 'stock-calculator-data';

export const storage = {
  saveStocks: (stocks: Stock[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stocks }));
    } catch (error) {
      console.error('Failed to save stocks:', error);
    }
  },

  loadStocks: (): Stock[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.stocks || [];
      }
    } catch (error) {
      console.error('Failed to load stocks:', error);
    }
    return [];
  },
};
