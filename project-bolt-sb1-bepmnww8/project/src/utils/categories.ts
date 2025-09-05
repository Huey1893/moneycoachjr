export interface ExpenseCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const expenseCategories: ExpenseCategory[] = [
  {
    id: 'food',
    name: 'Food & Drinks',
    emoji: '🍔',
    color: 'text-red-600'
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    emoji: '🧸',
    color: 'text-pink-600'
  },
  {
    id: 'clothes',
    name: 'Clothes & Accessories',
    emoji: '👕',
    color: 'text-purple-600'
  },
  {
    id: 'books',
    name: 'Books & Learning',
    emoji: '📚',
    color: 'text-blue-600'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    emoji: '🎬',
    color: 'text-green-600'
  },
  {
    id: 'other',
    name: 'Other',
    emoji: '❓',
    color: 'text-gray-600'
  }
];

export const getCategoryById = (id: string): ExpenseCategory => {
  return expenseCategories.find(cat => cat.id === id) || expenseCategories[expenseCategories.length - 1];
};