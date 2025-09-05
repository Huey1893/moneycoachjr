import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Gift, 
  Settings, 
  BarChart3, 
  Coins,
  Target,
  TrendingUp,
  Calendar,
  PieChart
} from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { formatAmount, currencies, getCurrencyByCode, getCurrencyInputPadding } from '../utils/currencies';
import { getCategoryById } from '../utils/categories';

interface ParentDashboardProps {
  onClose: () => void;
}

export default function ParentDashboard({ onClose }: ParentDashboardProps) {
  const { appData, updateAppData } = useAppData();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [addMoneyNote, setAddMoneyNote] = useState('');
  const [addToGoal, setAddToGoal] = useState(false);

  const currentCurrency = appData.parentSettings.currency;
  const activeGoal = appData.savingGoals.find(goal => !goal.completed);

  // Calculate statistics
  const thisWeekExpenses = appData.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return expenseDate >= weekAgo;
  });

  const thisMonthExpenses = appData.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });

  const thisWeekTotal = thisWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Category breakdown
  const categoryTotals = appData.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const handleAddMoney = () => {
    const amount = parseFloat(addMoneyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount! 💰');
      return;
    }

    if (addToGoal && activeGoal) {
      // Add directly to goal
      const updatedGoals = appData.savingGoals.map(goal => 
        goal.id === activeGoal.id 
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      );
      updateAppData({
        ...appData,
        savingGoals: updatedGoals
      });
    } else {
      // Add to balance
      const updatedUser = appData.user ? {
        ...appData.user,
        totalMoney: appData.user.totalMoney + amount
      } : null;
      updateAppData({
        ...appData,
        user: updatedUser
      });
    }

    alert(`${formatAmount(amount, currentCurrency)} added successfully! 🎉\n\n${addMoneyNote || 'Money added to account'}`);
    setAddMoneyAmount('');
    setAddMoneyNote('');
    setShowAddMoney(false);
    setAddToGoal(false);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    const confirm = window.confirm(
      `Change currency to ${getCurrencyByCode(newCurrency).name}?\n\nThis will change how money amounts are displayed throughout the app.`
    );
    
    if (confirm) {
      const updatedUser = appData.user ? {
        ...appData.user,
        currency: newCurrency
      } : null;

      updateAppData({
        ...appData,
        user: updatedUser,
        parentSettings: {
          ...appData.parentSettings,
          currency: newCurrency
        }
      });
      alert('Currency updated successfully! 💱');
    }
  };

  const handleChangePIN = () => {
    const newPin = prompt('Enter new 4-digit PIN:');
    if (newPin && /^\d{4}$/.test(newPin)) {
      updateAppData({
        ...appData,
        parentSettings: {
          ...appData.parentSettings,
          pin: newPin
        }
      });
      alert('PIN changed successfully! 🔒');
    } else if (newPin) {
      alert('PIN must be exactly 4 digits! 🔢');
    }
  };

  const handleResetApp = () => {
    const confirm1 = window.confirm(
      '⚠️ WARNING ⚠️\n\nThis will delete ALL data including:\n• All expenses\n• Savings goals\n• Completed goals\n• User profile\n\nAre you sure?'
    );
    
    if (confirm1) {
      const confirm2 = window.confirm(
        '🚨 FINAL WARNING 🚨\n\nThis action CANNOT be undone!\n\nAll your child\'s progress will be lost forever.\n\nType "DELETE" in the next prompt to confirm.'
      );
      
      if (confirm2) {
        const finalConfirm = prompt('Type "DELETE" to confirm:');
        if (finalConfirm === 'DELETE') {
          localStorage.clear();
          window.location.reload();
        }
      }
    }
  };

  if (showAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setShowAnalytics(false)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
          </div>

          {/* Spending Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Spending Overview</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">This Week</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatAmount(thisWeekTotal, currentCurrency)}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">This Month</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatAmount(thisMonthTotal, currentCurrency)}
                </div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Top Spending Categories</h2>
            </div>
            
            {topCategories.length > 0 ? (
              <div className="space-y-3">
                {topCategories.map(([categoryId, amount], index) => {
                  const category = getCategoryById(categoryId);
                  const percentage = Math.round((amount / thisMonthTotal) * 100) || 0;
                  return (
                    <div key={categoryId} className="flex items-center gap-3">
                      <div className="text-2xl">{category.emoji}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">{category.name}</span>
                          <span className="font-bold text-green-600">
                            {formatAmount(amount, currentCurrency)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No expenses to analyze yet! 📊</p>
            )}
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Export Report</h2>
            <button
              onClick={() => {
                const reportDate = new Date().toLocaleDateString();
                const totalSaved = appData.savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
                
                const report = `MoneyCoach Jr Report - ${reportDate}

Balance: ${formatAmount(appData.user?.totalMoney || 0, currentCurrency)}
This Week Spending: ${formatAmount(thisWeekTotal, currentCurrency)}
This Month Spending: ${formatAmount(thisMonthTotal, currentCurrency)}
Total Saved: ${formatAmount(totalSaved, currentCurrency)}
Active Goals: ${appData.savingGoals.length}
Completed Goals: ${appData.completedGoals.length}`;

                // Simple alert with report - always works
                alert(`📊 Financial Report\n\n${report}\n\n💡 Copy this text and paste it into an email or document!`);
              }}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              📊 View Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Parent Settings</h1>
          </div>

          {/* PIN Management */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Security</h2>
            <button
              onClick={handleChangePIN}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors mb-3"
            >
              🔒 Change PIN
            </button>
            <p className="text-sm text-gray-600">Current PIN: {appData.parentSettings.pin}</p>
          </div>

          {/* Currency Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Currency Settings</h2>
            <div className="space-y-2">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    currentCurrency === currency.code
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currency.flag}</span>
                    <div>
                      <div className="font-medium text-gray-800">
                        {currency.name} ({currency.symbol})
                      </div>
                      <div className="text-sm text-gray-600">{currency.code}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* App Management */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">App Management</h2>
            <button
              onClick={handleResetApp}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
            >
              🗑️ Reset All Data
            </button>
            <p className="text-sm text-red-600 mt-2">⚠️ This will delete everything permanently!</p>
          </div>
        </div>
      </div>
    );
  }

  if (showAddMoney) {
    const quickAmounts = [10, 20, 50, 100];
    const allowanceNotes = [
      'Weekly allowance',
      'Chores completed',
      'Good behavior bonus',
      'Custom note'
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setShowAddMoney(false)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Add Money</h1>
          </div>

          {/* Add Money Form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Quick Amounts */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Amounts
              </label>
              <div className="grid grid-cols-2 gap-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAddMoneyAmount(amount.toString())}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                      addMoneyAmount === amount.toString()
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    {formatAmount(amount, currentCurrency)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  {getCurrencyByCode(currentCurrency).symbol}
                </span>
                <input
                  type="number"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full ${getCurrencyInputPadding(currentCurrency)} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg font-medium`}
                />
              </div>
            </div>

            {/* Note Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reason
              </label>
              <div className="space-y-2">
                {allowanceNotes.map((note) => (
                  <button
                    key={note}
                    onClick={() => setAddMoneyNote(note === 'Custom note' ? '' : note)}
                    className={`w-full p-3 text-left rounded-xl transition-colors ${
                      addMoneyNote === note || (note === 'Custom note' && !allowanceNotes.slice(0, -1).includes(addMoneyNote))
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
              {!allowanceNotes.slice(0, -1).includes(addMoneyNote) && (
                <input
                  type="text"
                  value={addMoneyNote}
                  onChange={(e) => setAddMoneyNote(e.target.value)}
                  placeholder="Enter custom note..."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none mt-2"
                />
              )}
            </div>

            {/* Add to Goal Option */}
            {activeGoal && (
              <div className="mb-6">
                <label className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border-2 border-dashed border-yellow-200">
                  <input
                    type="checkbox"
                    checked={addToGoal}
                    onChange={(e) => setAddToGoal(e.target.checked)}
                    className="w-5 h-5 text-yellow-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      Add directly to savings goal
                    </div>
                    <div className="text-sm text-gray-600">
                      {activeGoal.emoji} {activeGoal.title}
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={handleAddMoney}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add Money
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, Parent! 👋</h1>
            <p className="text-gray-600">Manage your child's money journey</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Child Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Child Summary</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Current Balance</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatAmount(appData.user?.totalMoney || 0, currentCurrency)}
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">This Week</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(thisWeekTotal, currentCurrency)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-600">Active Goal</span>
              </div>
              <div className="text-lg font-bold text-yellow-600">
                {activeGoal ? `${Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100)}%` : 'None'}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Completed</span>
              </div>
              <div className="text-lg font-bold text-purple-600">
                {appData.completedGoals.length} goals
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowAddMoney(true)}
              className="p-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-medium transition-colors flex flex-col items-center gap-2"
            >
              <Plus className="w-6 h-6" />
              Add Allowance
            </button>
            
            <button
              onClick={() => setShowAddMoney(true)}
              className="p-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl font-medium transition-colors flex flex-col items-center gap-2"
            >
              <Gift className="w-6 h-6" />
              Bonus Money
            </button>
            
            <button
              onClick={() => setShowAnalytics(true)}
              className="p-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium transition-colors flex flex-col items-center gap-2"
            >
              <BarChart3 className="w-6 h-6" />
              View Reports
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-colors flex flex-col items-center gap-2"
            >
              <Settings className="w-6 h-6" />
              Settings
            </button>
          </div>
        </div>

        {/* Current Currency Display */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
          <p className="text-sm text-gray-600 mb-2">Current Currency</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{getCurrencyByCode(currentCurrency).flag}</span>
            <span className="text-lg font-bold text-gray-800">
              {getCurrencyByCode(currentCurrency).name} ({getCurrencyByCode(currentCurrency).symbol})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}