import React, { useState } from 'react';
import { Plus, Gift, Check } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { getCurrencyByCode, getCurrencyInputPadding } from '../utils/currencies';

interface AddMoneyFormProps {
  onAddMoney: (amount: number, note: string) => void;
}

export default function AddMoneyForm({ onAddMoney }: AddMoneyFormProps) {
  const { appData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;
  const currencySymbol = getCurrencyByCode(currentCurrency).symbol;

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const quickAmounts = [5, 10, 20, 50];
  const commonNotes = [
    'Weekly allowance',
    'Chores completed',
    'Birthday money',
    'Good behavior bonus',
    'Found money',
    'Gift from family'
  ];

  const resetForm = () => {
    setAmount('');
    setNote('');
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleQuickNote = (quickNote: string) => {
    setNote(quickNote);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount! 💰');
      return;
    }

    onAddMoney(numAmount, note || 'Money added');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-800">Add Money</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Amounts 💰
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => handleQuickAmount(quickAmount)}
                className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                  amount === quickAmount.toString()
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
              >
                {currencySymbol}{quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Amount 💵
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {currencySymbol}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              max="9999.99"
              className={`w-full ${getCurrencyInputPadding(currentCurrency)} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg font-medium`}
              required
            />
          </div>
        </div>

        {/* Note Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where did this money come from? 📝
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {commonNotes.map((commonNote) => (
              <button
                key={commonNote}
                type="button"
                onClick={() => handleQuickNote(commonNote)}
                className={`p-2 text-sm rounded-lg font-medium transition-colors ${
                  note === commonNote
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}
              >
                {commonNote}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 100))}
            placeholder="Or write your own note..."
            maxLength={100}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {note.length}/100
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={showSuccess}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
            showSuccess
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {showSuccess ? (
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Money Added! 🎉
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Add Money to Balance
            </div>
          )}
        </button>
      </form>

      {/* Helpful Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-700 font-medium mb-1">💡 Tips:</p>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Add your weekly allowance here</li>
          <li>• Record money from chores or good behavior</li>
          <li>• Don't forget birthday or gift money!</li>
        </ul>
      </div>
    </div>
  );
}