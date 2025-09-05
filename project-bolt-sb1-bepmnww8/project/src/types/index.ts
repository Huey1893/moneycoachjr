export interface User {
  id: string;
  name: string;
  age: number;
  totalMoney: number;
  createdAt: Date;
  currency: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  emoji: string;
  description?: string;
}

export interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  createdDate: Date;
  completedDate?: Date;
  emoji: string;
  completed: boolean;
  notes: string[];
}

export interface AppData {
  user: User | null;
  expenses: Expense[];
  savingGoals: SavingGoal[];
  completedGoals: SavingGoal[];
  parentSettings: ParentSettings;
}

export type TabType = 'money' | 'expenses' | 'goals';

export interface ParentSettings {
  pin: string;
  currency: string;
  spendingLimits: {
    daily?: number;
    weekly?: number;
  };
  notifications: {
    goalReminders: boolean;
  };
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  decimals: number;
}