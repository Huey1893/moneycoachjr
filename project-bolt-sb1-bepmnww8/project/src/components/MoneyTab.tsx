import React from 'react';
import { Coins, Plus, TrendingUp, Star, Wallet } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { formatAmount } from '../utils/currencies';
import AddMoneyForm from './AddMoneyForm';

export default function MoneyTab() {
  const { appData, updateAppData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;
  const userBalance = appData.user?.totalMoney || 0;
  const totalSaved = appData.savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const handleAddMoney = (amount: number, note: string) => {
    if (!appData.user) return;

    const updatedUser = {
      ...appData.user,
      totalMoney: appData.user.totalMoney + amount
    };

    updateAppData({
      ...appData,
      user: updatedUser
    });
  };

  return (
    <div className="p-6 pb-24 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-4xl mb-3">💰</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">My Money</h2>
        </div>

        {/* Add Money Form */}
        <AddMoneyForm onAddMoney={handleAddMoney} />

        {/* Preview Cards */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">My Allowance</h3>
              <Coins className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold">{formatAmount(userBalance, currentCurrency)}</div>
            <p className="text-blue-100 text-sm mt-2">Your current balance</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Balance</span>
              </div>
              <div className="text-xl font-bold text-green-600">{formatAmount(userBalance, currentCurrency)}</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Saved</span>
              </div>
              <div className="text-xl font-bold text-blue-600">{formatAmount(totalSaved, currentCurrency)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}