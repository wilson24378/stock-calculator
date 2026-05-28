import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calculator, Check } from 'lucide-react';
import { useStockStore } from '@/store/stockStore';
import type { Stock } from '@/types/stock';

interface StockCalcPageProps {
  stock: Stock;
  onBack: () => void;
}

interface InputRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  showSave?: boolean;
  placeholder?: string;
  saveSuccess?: boolean;
}

function InputRow({
  label,
  value,
  onChange,
  onSave,
  showSave = true,
  placeholder = '',
  saveSuccess = false,
}: InputRowProps) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm">
      <div className="flex items-center gap-3">
        <label className="text-[#1e3a5f] font-medium whitespace-nowrap w-20 text-sm">{label}</label>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-[#1e3a5f] text-sm focus:outline-none focus:border-[#4a90d9] transition-colors"
        />
        {showSave && onSave && (
          <button
            onClick={onSave}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 flex items-center gap-1 whitespace-nowrap ${
              saveSuccess
                ? 'bg-green-500 text-white'
                : 'bg-[#4a90d9] text-white hover:bg-[#1e3a5f]'
            }`}
          >
            {saveSuccess ? <Check size={16} /> : null}
            儲存
          </button>
        )}
      </div>
    </div>
  );
}

export default function StockCalcPage({ stock, onBack }: StockCalcPageProps) {
  const { updateStock } = useStockStore();
  const [currentPrice, setCurrentPrice] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [fee, setFee] = useState('');
  const [profit, setProfit] = useState<number | null>(null);
  const [profitAfterFee, setProfitAfterFee] = useState<number | null>(null);

  const [saveStatus, setSaveStatus] = useState({
    entryPrice: false,
    quantity: false,
    exchangeRate: false,
    fee: false,
  });

  useEffect(() => {
    setEntryPrice(stock.entryPrice.toString());
    setQuantity(stock.quantity.toString());
    setExchangeRate(stock.exchangeRate.toString());
    setFee(stock.fee.toString());
  }, [stock.name]);

  const showSaveSuccess = useCallback((key: keyof typeof saveStatus) => {
    setSaveStatus((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  }, []);

  const handleSaveEntryPrice = useCallback(() => {
    const newStock = {
      ...stock,
      entryPrice: parseFloat(entryPrice) || 0,
    };
    updateStock(newStock);
    showSaveSuccess('entryPrice');
  }, [stock, entryPrice, updateStock, showSaveSuccess]);

  const handleSaveQuantity = useCallback(() => {
    const newStock = {
      ...stock,
      quantity: parseFloat(quantity) || 0,
    };
    updateStock(newStock);
    showSaveSuccess('quantity');
  }, [stock, quantity, updateStock, showSaveSuccess]);

  const handleSaveExchangeRate = useCallback(() => {
    const newStock = {
      ...stock,
      exchangeRate: parseFloat(exchangeRate) || 7.76,
    };
    updateStock(newStock);
    showSaveSuccess('exchangeRate');
  }, [stock, exchangeRate, updateStock, showSaveSuccess]);

  const handleSaveFee = useCallback(() => {
    const newStock = {
      ...stock,
      fee: parseFloat(fee) || 35,
    };
    updateStock(newStock);
    showSaveSuccess('fee');
  }, [stock, fee, updateStock, showSaveSuccess]);

  const handleCalculate = useCallback(() => {
    const current = parseFloat(currentPrice) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const qty = parseFloat(quantity) || 0;
    const rate = parseFloat(exchangeRate) || 7.76;
    const feeAmount = parseFloat(fee) || 35;

    const calculatedProfit = (current - entry) * qty * rate;
    const calculatedProfitAfterFee = calculatedProfit - feeAmount;

    setProfit(calculatedProfit);
    setProfitAfterFee(calculatedProfitAfterFee);
  }, [currentPrice, entryPrice, quantity, exchangeRate, fee]);

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 text-[#1e3a5f] hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#1e3a5f]">{stock.name}</h1>
        </div>

        <div className="space-y-2">
          <InputRow
            label="現價"
            value={currentPrice}
            onChange={setCurrentPrice}
            showSave={false}
            placeholder="輸入現價"
          />

          <InputRow
            label="入貨價"
            value={entryPrice}
            onChange={setEntryPrice}
            onSave={handleSaveEntryPrice}
            saveSuccess={saveStatus.entryPrice}
          />

          <InputRow
            label="數量"
            value={quantity}
            onChange={setQuantity}
            onSave={handleSaveQuantity}
            saveSuccess={saveStatus.quantity}
          />

          <InputRow
            label="匯率"
            value={exchangeRate}
            onChange={setExchangeRate}
            onSave={handleSaveExchangeRate}
          />

          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <label className="text-[#1e3a5f] font-medium whitespace-nowrap w-20 text-sm">估計利潤</label>
                {profit !== null && (
                  <div
                    className={`text-lg font-bold ${
                      profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {profit >= 0 ? '+' : ''}
                    {profit.toLocaleString('zh-HK', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                )}
              </div>
              <button
                onClick={handleCalculate}
                className="flex items-center gap-1 px-3 py-2 bg-[#4a90d9] text-white rounded-lg font-medium text-sm hover:bg-[#1e3a5f] transition-colors active:scale-95 whitespace-nowrap"
              >
                <Calculator size={16} />
                計算
              </button>
            </div>
          </div>

          <InputRow
            label="手續費"
            value={fee}
            onChange={setFee}
            onSave={handleSaveFee}
            saveSuccess={saveStatus.fee}
          />

          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <label className="text-[#1e3a5f] font-medium whitespace-nowrap w-20 text-sm">
                淨利潤
              </label>
              {profitAfterFee !== null && (
                <div
                  className={`text-xl font-bold ${
                    profitAfterFee >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {profitAfterFee >= 0 ? '+' : ''}
                  {profitAfterFee.toLocaleString('zh-HK', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}
              {profitAfterFee === null && (
                <div className="text-gray-400 text-sm">請先點擊計算</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
