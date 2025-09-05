import { AppData } from '../types';

const STORAGE_KEY = 'moneycoach-jr-data';

export const saveToStorage = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const loadFromStorage = (): AppData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      if (parsed.user?.createdAt) {
        parsed.user.createdAt = new Date(parsed.user.createdAt);
      }
      if (parsed.user && !parsed.user.currency) {
        parsed.user.currency = 'EUR';
      }
      if (parsed.expenses) {
        parsed.expenses.forEach((expense: any) => {
          expense.date = new Date(expense.date);
        });
      }
      if (parsed.savingGoals) {
        parsed.savingGoals.forEach((goal: any) => {
          goal.createdDate = new Date(goal.createdDate);
          if (goal.completedDate) {
            goal.completedDate = new Date(goal.completedDate);
          }
        });
      }
      if (parsed.completedGoals) {
        parsed.completedGoals.forEach((goal: any) => {
          goal.createdDate = new Date(goal.createdDate);
          if (goal.completedDate) {
            goal.completedDate = new Date(goal.completedDate);
          }
        });
      }
      return parsed;
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
  }
  return null;
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};