import { useState, useEffect } from 'react';
import { AppData, ParentSettings } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const defaultParentSettings: ParentSettings = {
  pin: '1234',
  currency: 'EUR',
  spendingLimits: {},
  notifications: {
    goalReminders: true
  }
};

export const useAppData = () => {
  const [appData, setAppData] = useState<AppData>({
    user: null,
    expenses: [],
    savingGoals: [],
    completedGoals: [],
    parentSettings: defaultParentSettings
  });

  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      setAppData({
        ...savedData,
        parentSettings: savedData.parentSettings || defaultParentSettings,
        expenses: savedData.expenses || [],
        savingGoals: savedData.savingGoals || [],
        completedGoals: savedData.completedGoals || []
      });
    }
  }, []);

  const updateAppData = (newData: AppData) => {
    setAppData(newData);
    saveToStorage(newData);
  };

  return {
    appData,
    updateAppData
  };
};