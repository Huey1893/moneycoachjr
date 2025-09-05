import React from 'react';
import { Wallet, BarChart3, Target } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'money' as TabType,
      label: 'My Money',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'expenses' as TabType,
      label: 'Expenses',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'goals' as TabType,
      label: 'Savings Goals',
      icon: Target,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-3 px-2 transition-all duration-200 ${
                isActive
                  ? `${tab.color} ${tab.bgColor} bg-opacity-20`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-full transition-colors ${
                isActive ? `${tab.bgColor} ${tab.color}` : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}