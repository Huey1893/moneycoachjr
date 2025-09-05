import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Trophy, Star } from 'lucide-react';
import { SavingGoal } from '../types';
import { useAppData } from '../hooks/useAppData';
import { formatAmount, getCurrencyByCode, getCurrencyInputPadding } from '../utils/currencies';

interface GoalProgressProps {
  goal: SavingGoal;
  onAddMoney: (goalId: string, amount: number, note?: string) => void;
  onEditGoal: (goal: SavingGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onCompleteGoal: (goalId: string) => void;
}

export default function GoalProgress({ 
  goal, 
  onAddMoney, 
  onEditGoal, 
  onDeleteGoal, 
  onCompleteGoal
}: GoalProgressProps) {
  const { appData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;
  const currencySymbol = getCurrencyByCode(currentCurrency).symbol;
  const userBalance = appData.user?.totalMoney || 0;

  const [showAddMoney, setShowAddMoney] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [note, setNote] = useState('');
  const [celebrationLevel, setCelebrationLevel] = useState(0);

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const progressRounded = Math.round(progress);

  // Check for milestone celebrations
  useEffect(() => {
    const newLevel = progress >= 100 ? 4 : progress >= 75 ? 3 : progress >= 50 ? 2 : progress >= 25 ? 1 : 0;
    if (newLevel > celebrationLevel) {
      setCelebrationLevel(newLevel);
      showMilestoneMessage(newLevel);
    }
  }, [progress, celebrationLevel]);

  const showMilestoneMessage = (level: number) => {
    const messages = [
      '',
      'Great start! 🌟',
      'Halfway there! 🚀',
      'Almost there! 💪',
      'Goal achieved! 🎉'
    ];
    if (messages[level]) {
      alert(messages[level]);
    }
  };

  const quickAmounts = [5, 10, 20];

  const handleQuickAdd = (amount: number) => {
    if (amount > userBalance) {
      const proceed = window.confirm(
        `You don't have enough money in your balance (${formatAmount(userBalance, currentCurrency)}).\n\nDo you want to add it anyway? (Maybe you got allowance from parents!) 💝`
      );
      if (!proceed) return;
    }
    onAddMoney(goal.id, amount, 'Quick add');
  };

  const handleCustomAdd = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount! 💰');
      return;
    }

    if (amount > userBalance) {
      const proceed = window.confirm(
        `You don't have enough money in your balance (${formatAmount(userBalance, currentCurrency)}).\n\nDo you want to add it anyway? (Maybe you got allowance from parents!) 💝`
      );
      if (!proceed) return;
    }

    onAddMoney(goal.id, amount, note || undefined);
    setCustomAmount('');
    setNote('');
    setShowAddMoney(false);
  };

  const handleComplete = () => {
    const confirm = window.confirm(
      `Congratulations! 🎉\n\nYou've reached your savings goal for "${goal.title}"!\n\nMark this goal as completed?`
    );
    if (confirm) {
      onCompleteGoal(goal.id);
    }
  };

  const handleDelete = () => {
    const confirm = window.confirm(
      `Are you sure you want to delete this goal?\n\n${goal.emoji} ${goal.title}\n\nYour saved money (${formatAmount(goal.currentAmount, currentCurrency)}) will be returned to your balance.`
    );
    if (confirm) {
      onDeleteGoal(goal.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      {/* Goal Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.emoji}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
            <p className="text-sm text-gray-600">
              {formatAmount(goal.currentAmount, currentCurrency)} of {formatAmount(goal.targetAmount, currentCurrency)} saved
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditGoal(goal)}
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit goal"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            title="Delete goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-yellow-600">{progressRounded}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {progress > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Info */}
      <div className="text-center mb-4">
        {remaining > 0 ? (
          <p className="text-lg font-medium text-gray-700">
            Only <span className="text-yellow-600 font-bold">{formatAmount(remaining, currentCurrency)}</span> more to go! 🎯
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-bold text-green-600">🎉 Goal Achieved! 🎉</p>
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Trophy className="w-4 h-4" />
              Mark as Completed
            </button>
          </div>
        )}
      </div>

      {/* Add Money Section */}
      {remaining > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Add Money to Goal</h4>
            <button
              onClick={() => setShowAddMoney(!showAddMoney)}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {showAddMoney ? 'Hide' : 'Custom Amount'}
            </button>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickAdd(amount)}
                className="py-2 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg font-medium transition-colors"
              >
                +{formatAmount(amount, currentCurrency)}
              </button>
            ))}
          </div>

          {/* Custom Amount Form */}
          {showAddMoney && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{currencySymbol}</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className={`w-full ${getCurrencyInputPadding(currentCurrency)} pr-4 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 50))}
                  placeholder="Where did this money come from?"
                  maxLength={50}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleCustomAdd}
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Money
              </button>
            </div>
          )}
        </div>
      )}

      {/* Milestone Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {[25, 50, 75, 100].map((milestone, index) => (
          <div
            key={milestone}
            className={`w-3 h-3 rounded-full transition-colors ${
              progress >= milestone
                ? 'bg-yellow-500'
                : 'bg-gray-200'
            }`}
            title={`${milestone}% milestone`}
          >
            {progress >= milestone && (
              <Star className="w-3 h-3 text-white" fill="currentColor" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}