import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useStockStore } from '@/store/stockStore';
import type { Stock } from '@/types/stock';

interface HomePageProps {
  onStockClick: (stock: Stock) => void;
}

export default function HomePage({ onStockClick }: HomePageProps) {
  const { stocks, addStock, deleteStock, loadStocks } = useStockStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newStockName, setNewStockName] = useState('');

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const handleAddStock = () => {
    if (newStockName.trim()) {
      addStock(newStockName.trim());
      setNewStockName('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddStock();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-[#1e3a5f] text-center mb-8">
          股票計算器
        </h1>

        <div className="space-y-3">
          {stocks.map((stock) => (
            <div
              key={stock.name}
              className="flex items-center gap-2 animate-fadeIn"
            >
              <button
                onClick={() => onStockClick(stock)}
                className="flex-1 bg-white border-2 border-[#4a90d9] text-[#1e3a5f] font-semibold py-4 px-6 rounded-xl shadow-sm hover:bg-[#4a90d9] hover:text-white transition-all duration-200 active:scale-95"
              >
                {stock.name}
              </button>
              <button
                onClick={() => deleteStock(stock.name)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {isAdding ? (
          <div className="mt-4 bg-white p-4 rounded-xl shadow-md animate-fadeIn">
            <input
              type="text"
              value={newStockName}
              onChange={(e) => setNewStockName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="輸入股票名稱"
              className="w-full px-4 py-3 border-2 border-[#4a90d9] rounded-lg text-[#1e3a5f] placeholder-gray-400 focus:outline-none focus:border-[#1e3a5f]"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddStock}
                className="flex-1 bg-[#4a90d9] text-white py-2 rounded-lg font-medium hover:bg-[#1e3a5f] transition-colors"
              >
                儲存
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewStockName('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full mt-4 bg-[#4a90d9] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#1e3a5f] transition-all duration-200 active:scale-95"
          >
            <Plus size={24} />
            增加
          </button>
        )}

        {stocks.length === 0 && !isAdding && (
          <p className="text-center text-gray-500 mt-8 text-sm">
            還沒有股票，點擊上方按鈕添加
          </p>
        )}
      </div>
    </div>
  );
}
