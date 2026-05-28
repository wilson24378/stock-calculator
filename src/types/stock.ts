export interface Stock {
  name: string;
  entryPrice: number;
  quantity: number;
  exchangeRate: number;
  fee: number;
}

export interface StockStore {
  stocks: Stock[];
  currentStock: Stock | null;
  addStock: (name: string) => void;
  updateStock: (stock: Stock) => void;
  deleteStock: (name: string) => void;
  setCurrentStock: (stock: Stock | null) => void;
  loadStocks: () => void;
}
