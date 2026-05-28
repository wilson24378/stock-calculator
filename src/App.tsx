import { useState } from 'react';
import HomePage from '@/pages/HomePage';
import StockCalcPage from '@/pages/StockCalcPage';
import type { Stock } from '@/types/stock';

export default function App() {
  const [currentStock, setCurrentStock] = useState<Stock | null>(null);

  const handleStockClick = (stock: Stock) => {
    setCurrentStock(stock);
  };

  const handleBack = () => {
    setCurrentStock(null);
  };

  return (
    <div className="font-sans">
      {currentStock ? (
        <StockCalcPage stock={currentStock} onBack={handleBack} />
      ) : (
        <HomePage onStockClick={handleStockClick} />
      )}
    </div>
  );
}
