import type { Stock } from '@/types/stock';

const STORAGE_KEY = 'stock-calculator-data-v1';

export const storage = {
  isAvailable: (): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  saveStocks: (stocks: Stock[]): boolean => {
    try {
      const data = JSON.stringify({ stocks, timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEY, data);
      
      // 同時保存到 sessionStorage 作為備份
      sessionStorage.setItem(STORAGE_KEY, data);
      return true;
    } catch (error) {
      console.error('Failed to save stocks:', error);
      return false;
    }
  },

  loadStocks: (): Stock[] => {
    try {
      // 首先嘗試從 localStorage 讀取
      let data = localStorage.getItem(STORAGE_KEY);
      
      // 如果 localStorage 沒有，嘗試從 sessionStorage 讀取
      if (!data) {
        data = sessionStorage.getItem(STORAGE_KEY);
      }
      
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.stocks && Array.isArray(parsed.stocks)) {
          return parsed.stocks;
        }
      }
    } catch (error) {
      console.error('Failed to load stocks:', error);
    }
    return [];
  },

  // 導出數據為 JSON 字符串，供用戶手動備份
  exportData: (): string => {
    try {
      const stocks = storage.loadStocks();
      return JSON.stringify({ stocks, exportDate: new Date().toISOString() }, null, 2);
    } catch (error) {
      return '{}';
    }
  },

  // 從 JSON 字符串導入數據
  importData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.stocks && Array.isArray(data.stocks)) {
        return storage.saveStocks(data.stocks);
      }
      return false;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },
};
