import React, { useState } from 'react';
import { Plus, Target, Check } from 'lucide-react';
import { SavingGoal } from '../types';
import { useAppData } from '../hooks/useAppData';
import { getCurrencyByCode, getCurrencyInputPadding } from '../utils/currencies';

interface GoalFormProps {
  onCreateGoal: (goal: Omit<SavingGoal, 'id'>) => void;
  hasActiveGoal: boolean;
}

const goalEmojis = ['🚲', '🎮', '🎸', '📱', '🧸', '⚽', '🎨', '📚', '🎯', '🏠', '✈️', '🎪'];

export default function GoalForm({ onCreateGoal, hasActiveGoal }: GoalFormProps) {
  const { appData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;
  const currencySymbol = getCurrencyByCode(currentCurrency).symbol;

  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setGoalName('');
    setTargetAmount('');
    setSelectedEmoji('🎯');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid target amount! 💰');
      return;
    }

    if (goalName.trim().length === 0) {
      alert('Please enter a goal name! 📝');
      return;
    }

    const goalData: Omit<SavingGoal, 'id'> = {
      title: goalName.trim(),
      targetAmount: Math.round(amount * 100) / 100,
      currentAmount: 0,
      createdDate: new Date(),
      emoji: selectedEmoji,
      completed: false,
      notes: []
    };

    onCreateGoal(goalData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
    }, 2000);
  };

  if (hasActiveGoal) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">One Goal at a Time!</h3>
          <p className="text-gray-600">
            Complete your current goal before creating a new one! 
            Focus helps you achieve your dreams faster! 🌟
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-6 h-6 text-yellow-600" />
        <h3 className="text-xl font-bold text-gray-800">Create New Savings Goal</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you saving for? ✨
          </label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value.slice(0, 50))}
            placeholder="New Bike, Video Game, Trip to Zoo..."
            maxLength={50}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none text-lg"
            required
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {goalName.length}/50
          </div>
        </div>

        {/* Target Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How much do you need? 💰
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {currencySymbol}
            </span>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max="9999.99"
              className={`w-full ${getCurrencyInputPadding(currentCurrency)} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none text-lg font-medium`}
              required
            />
          </div>
        </div>

        {/* Emoji Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose an icon for your goal 🎨
          </label>
          <div className="grid grid-cols-6 gap-2">
            {goalEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`p-3 text-2xl rounded-xl border-2 transition-all ${
                  selectedEmoji === emoji
                    ? 'border-yellow-500 bg-yellow-50 scale-110'
                    : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={showSuccess}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
            showSuccess
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {showSuccess ? (
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Goal Created! 🎉
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Create Savings Goal
            </div>
          )}
        </button>
      </form>
    </div>
  );
}