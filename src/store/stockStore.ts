import { create } from 'zustand';
import type { Stock, StockStore } from '@/types/stock';
import { storage } from '@/utils/storage';

const defaultStock = (name: string): Stock => ({
  name,
  entryPrice: 0,
  quantity: 0,
  exchangeRate: 7.76,
  fee: 35,
});

export const useStockStore = create<StockStore>((set, get) => ({
  stocks: [],
  currentStock: null,

  addStock: (name: string) => {
    const { stocks } = get();
    if (stocks.find((s) => s.name === name)) {
      return;
    }
    const newStock = defaultStock(name);
    const updatedStocks = [...stocks, newStock];
    set({ stocks: updatedStocks });
    storage.saveStocks(updatedStocks);
  },

  updateStock: (stock: Stock) => {
    const { stocks } = get();
    const updatedStocks = stocks.map((s) =>
      s.name === stock.name ? stock : s
    );
    set({ stocks: updatedStocks, currentStock: stock });
    storage.saveStocks(updatedStocks);
  },

  deleteStock: (name: string) => {
    const { stocks } = get();
    const updatedStocks = stocks.filter((s) => s.name !== name);
    set({ stocks: updatedStocks });
    storage.saveStocks(updatedStocks);
  },

  setCurrentStock: (stock: Stock | null) => {
    set({ currentStock: stock });
  },

  loadStocks: () => {
    const stocks = storage.loadStocks();
    set({ stocks });
  },
}));
