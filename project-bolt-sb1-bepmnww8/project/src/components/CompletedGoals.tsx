import React from 'react';
import { Trophy, Calendar, Target } from 'lucide-react';
import { SavingGoal } from '../types';
import { useAppData } from '../hooks/useAppData';
import { formatAmount } from '../utils/currencies';

interface CompletedGoalsProps {
  completedGoals: SavingGoal[];
}

export default function CompletedGoals({ completedGoals }: CompletedGoalsProps) {
  const { appData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;

  if (completedGoals.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <div className="text-4xl mb-3">🏆</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Completed Goals Yet</h3>
        <p className="text-gray-600">
          Complete your first savings goal to see it here! 🌟
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-yellow-600" />
        <h3 className="text-xl font-bold text-gray-800">Completed Goals</h3>
      </div>

      <div className="text-center mb-4 p-3 bg-yellow-50 rounded-xl">
        <p className="text-lg font-bold text-yellow-700">
          🎉 You've completed {completedGoals.length} goal{completedGoals.length !== 1 ? 's' : ''}! 🎉
        </p>
        <p className="text-sm text-yellow-600 mt-1">
          Amazing job saving for your dreams! 🌟
        </p>
      </div>

      <div className="space-y-3">
        {completedGoals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <span className="text-2xl">{goal.emoji}</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-2 h-2 text-white" fill="currentColor" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">
                  {goal.title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-3 h-3" />
                  <span>{formatAmount(goal.targetAmount, currentCurrency)}</span>
                  <span>•</span>
                  <Calendar className="w-3 h-3" />
                  <span>
                    {goal.completedDate ? formatDate(goal.completedDate) : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}