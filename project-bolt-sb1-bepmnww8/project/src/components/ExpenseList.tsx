import React, { useState } from 'react';
import { Edit2, Trash2, Undo2 } from 'lucide-react';
import { Expense } from '../types';
import { getCategoryById } from '../utils/categories';
import { useAppData } from '../hooks/useAppData';
import { formatAmount } from '../utils/currencies';

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onEditExpense, onDeleteExpense }: ExpenseListProps) {
  const { appData } = useAppData();
  const currentCurrency = appData.parentSettings.currency;

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleDeleteClick = (expense: Expense) => {
    const confirmDelete = window.confirm(
      `Really delete this expense?\n\n${expense.emoji} ${expense.title}\n€${expense.amount.toFixed(2)}\n\nThis action cannot be undone! 🗑️`
    );

    if (confirmDelete) {
      setDeletingId(expense.id);
        `Really delete this expense?\n\n${expense.emoji} ${expense.title}\n${formatAmount(expense.amount, currentCurrency)}\n\nThis action cannot be undone! 🗑️`
      // Set up undo timeout
      const timeout = setTimeout(() => {
        onDeleteExpense(expense.id);
        setDeletingId(null);
      }, 3000);
      
      setUndoTimeout(timeout);
    }
  };

  const handleUndo = () => {
    if (undoTimeout) {
      clearTimeout(undoTimeout);
      setUndoTimeout(null);
    }
    setDeletingId(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">😊</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No expenses yet!
        </h3>
        <p className="text-gray-600">
          Start tracking your spending above! 📊
        </p>
      </div>
    );
  }

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Your Expenses ({expenses.length})
      </h3>
      
      {sortedExpenses.map((expense) => {
        const category = getCategoryById(expense.category);
        const isDeleting = deletingId === expense.id;
        
        return (
          <div
            key={expense.id}
            className={`bg-white rounded-xl p-4 shadow-md transition-all duration-300 ${
              isDeleting ? 'bg-red-50 border-2 border-red-200' : 'hover:shadow-lg'
            }`}
          >
            {isDeleting ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🗑️</span>
                  <div>
                    <p className="font-medium text-red-700">Deleting expense...</p>
                    <p className="text-sm text-red-600">
                      {expense.emoji} {expense.title} - {formatAmount(expense.amount, currentCurrency)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`text-2xl p-2 rounded-full bg-gray-50`}>
                    {category.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {expense.title}
                      </h4>
                      <span className="text-lg font-bold text-green-600">
                        {formatAmount(expense.amount, currentCurrency)}
                      </span>
                    </div>
                    {expense.description && expense.description !== expense.title && (
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {expense.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{category.name}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => onEditExpense(expense)}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit expense"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(expense)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}