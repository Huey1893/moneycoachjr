import React, { useState, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Expense } from '../types';
import { expenseCategories } from '../utils/categories';
import { useAppData } from '../hooks/useAppData';
import { formatAmount, getCurrencyByCode, getCurrencyInputPadding } from '../utils/currencies';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  editingExpense?: Expense | null;
  onCancelEdit: () => void;
}

export default function ExpenseForm({ 
  onAddExpense, 
  onUpdateExpense, 
  editingExpense, 
  onCancelEdit 
}: ExpenseFormProps) {
  const { appData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;
  const currencySymbol = getCurrencyByCode(currentCurrency).symbol;

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDescription(editingExpense.description || '');
      setDate(editingExpense.date.toISOString().split('T')[0]);
    }
  }, [editingExpense]);

  const resetForm = () => {
    setAmount('');
    setCategory('food');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount! 💰');
      return;
    }

    const selectedCategory = expenseCategories.find(cat => cat.id === category);
    if (!selectedCategory) return;

    const expenseData = {
      title: description || selectedCategory.name,
      amount: Math.round(numAmount * 100) / 100, // Round to 2 decimal places
      category: category,
      date: new Date(date),
      emoji: selectedCategory.emoji,
      description: description || undefined
    };

    if (editingExpense) {
      onUpdateExpense({
        ...editingExpense,
        ...expenseData
      });
      onCancelEdit();
    } else {
      onAddExpense(expenseData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      resetForm();
    }
  };

  const handleCancel = () => {
    if (editingExpense) {
      onCancelEdit();
      resetForm();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </h3>
        {editingExpense && (
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount 💰
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

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category 📂
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
            required
          >
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional) ✏️
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 100))}
            placeholder="What did you buy?"
            maxLength={100}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {description.length}/100
          </div>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date 📅
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
            required
          />
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
              Added! 🎉
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              {editingExpense ? 'Update Expense' : 'Add Expense'}
            </div>
          )}
        </button>
      </form>
    </div>
  );
}