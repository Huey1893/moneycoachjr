import React from 'react';
import { Coins, Lock } from 'lucide-react';

interface HeaderProps {
  onParentAccess: () => void;
}

export default function Header({ onParentAccess }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-green-500 shadow-lg sticky top-0 z-50">
      <div className="px-4 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-white">
            MoneyCoach Jr.
          </h1>
        </div>

        {/* Parent Access Button */}
        <button
          onClick={onParentAccess}
          className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-white transition-colors"
        >
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Parents</span>
        </button>
      </div>
    </header>
  );
}