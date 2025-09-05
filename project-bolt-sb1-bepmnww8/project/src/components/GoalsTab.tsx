import React, { useState } from 'react';
import { Target, Star, Trophy, TrendingUp } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import GoalForm from './GoalForm';
import GoalProgress from './GoalProgress';
import CompletedGoals from './CompletedGoals';
import { SavingGoal } from '../types';
import { formatAmount } from '../utils/currencies';

export default function GoalsTab() {
  const { appData, updateAppData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);

  const activeGoal = appData.savingGoals.find(goal => !goal.completed);
  const userBalance = appData.user?.totalMoney || 0;

  const handleCreateGoal = (goalData: Omit<SavingGoal, 'id'>) => {
    const newGoal: SavingGoal = {
      ...goalData,
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    updateAppData({
      ...appData,
      savingGoals: [...appData.savingGoals, newGoal]
    });
  };

  const handleAddMoney = (goalId: string, amount: number, note?: string) => {
    const updatedGoals = appData.savingGoals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + amount;
        const updatedNotes = note ? [...goal.notes, `+€${amount.toFixed(2)}: ${note}`] : goal.notes;
        return {
          ...goal,
          currentAmount: Math.round(newAmount * 100) / 100,
          notes: updatedNotes
        };
      }
      return goal;
    });

    // Update user balance (subtract the amount)
    const updatedUser = appData.user ? {
      ...appData.user,
      totalMoney: Math.max(0, appData.user.totalMoney - amount)
    } : null;

    updateAppData({
      ...appData,
      user: updatedUser,
      savingGoals: updatedGoals
    });
  };

  const handleEditGoal = (goal: SavingGoal) => {
    setEditingGoal(goal);
    // In a real app, you'd show an edit form modal
    const newTitle = prompt('Enter new goal name:', goal.title);
    const newAmount = prompt('Enter new target amount:', goal.targetAmount.toString());
    
    if (newTitle && newAmount) {
      const amount = parseFloat(newAmount);
      if (!isNaN(amount) && amount > 0) {
        const updatedGoals = appData.savingGoals.map(g => 
          g.id === goal.id 
            ? { ...g, title: newTitle.trim(), targetAmount: Math.round(amount * 100) / 100 }
            : g
        );
        updateAppData({
          ...appData,
          savingGoals: updatedGoals
        });
      }
    }
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = appData.savingGoals.find(g => g.id === goalId);
    if (!goalToDelete) return;

    // Return saved money to user balance
    const updatedUser = appData.user ? {
      ...appData.user,
      totalMoney: appData.user.totalMoney + goalToDelete.currentAmount
    } : null;

    const updatedGoals = appData.savingGoals.filter(goal => goal.id !== goalId);

    updateAppData({
      ...appData,
      user: updatedUser,
      savingGoals: updatedGoals
    });
  };

  const handleCompleteGoal = (goalId: string) => {
    const goalToComplete = appData.savingGoals.find(g => g.id === goalId);
    if (!goalToComplete) return;

    const completedGoal: SavingGoal = {
      ...goalToComplete,
      completed: true,
      completedDate: new Date()
    };

    const updatedGoals = appData.savingGoals.filter(goal => goal.id !== goalId);
    const updatedCompletedGoals = [...appData.completedGoals, completedGoal];

    updateAppData({
      ...appData,
      savingGoals: updatedGoals,
      completedGoals: updatedCompletedGoals
    });

    // Show celebration
    setTimeout(() => {
      alert('🎉 Congratulations! You achieved your savings goal! 🎉\n\nYou\'re amazing at saving money! Keep up the great work! 🌟');
    }, 500);
  };

  // Calculate statistics
  const totalSaved = appData.savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalCompleted = appData.completedGoals.length;
  const totalCompletedValue = appData.completedGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <div className="p-6 pb-24 bg-gradient-to-br from-yellow-50 to-white min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header Stats */}
        <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Savings Goals</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Currently Saved</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{formatAmount(totalSaved, currentCurrency)}</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completed</span>
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{totalCompleted}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Active Goals</span>
              </div>
              <div className="text-xl font-bold text-blue-600">{activeGoal ? 1 : 0}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">Total Value</span>
              </div>
              <div className="text-xl font-bold text-purple-600">{formatAmount(totalCompletedValue, currentCurrency)}</div>
            </div>
          </div>
        </div>

        {/* Goal Form */}
        <GoalForm
          onCreateGoal={handleCreateGoal}
          hasActiveGoal={!!activeGoal}
        />

        {/* Active Goal Progress */}
        {activeGoal && (
          <GoalProgress
            goal={activeGoal}
            onAddMoney={handleAddMoney}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onCompleteGoal={handleCompleteGoal}
          />
        )}

        {/* Completed Goals */}
        {appData.completedGoals.length > 0 && (
          <CompletedGoals completedGoals={appData.completedGoals} />
        )}

        {/* Empty State for No Goals */}
        {!activeGoal && appData.completedGoals.length === 0 && (
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Start Your First Savings Goal!
            </h3>
            <p className="text-gray-600">
              What would you like to save for? A new bike? A video game? 
              Set your goal above and start your savings journey! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
}