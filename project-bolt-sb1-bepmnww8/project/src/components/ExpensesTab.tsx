import React, { useState } from 'react';
import { BarChart3, TrendingDown, Calendar, PieChart } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import { Expense } from '../types';
import { formatAmount } from '../utils/currencies';

export default function ExpensesTab() {
  const { appData, updateAppData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    updateAppData({
      ...appData,
      expenses: [...appData.expenses, newExpense]
    });
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    updateAppData({
      ...appData,
      expenses: appData.expenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    });
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    updateAppData({
      ...appData,
      expenses: appData.expenses.filter(expense => expense.id !== expenseId)
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Calculate statistics
  const totalExpenses = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = appData.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Get unique categories
  const categories = [...new Set(appData.expenses.map(expense => expense.category))];

  return (
    <div className="p-6 pb-24 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header Stats */}
        <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Expenses</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">This Month</span>
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{formatAmount(thisMonthTotal, currentCurrency)}</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">All Time</span>
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{formatAmount(totalExpenses, currentCurrency)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <PieChart className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">Categories</span>
              </div>
              <div className="text-xl font-bold text-purple-600">{categories.length}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-600">Entries</span>
              </div>
              <div className="text-xl font-bold text-orange-600">{appData.expenses.length}</div>
            </div>
          </div>
        </div>

        {/* Expense Form */}
        <ExpenseForm
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          editingExpense={editingExpense}
          onCancelEdit={handleCancelEdit}
        />

        {/* Expense List */}
        <ExpenseList
          expenses={appData.expenses}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>
    </div>
  );
}