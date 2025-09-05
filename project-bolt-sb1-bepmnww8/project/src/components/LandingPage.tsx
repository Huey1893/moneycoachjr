import React from 'react';
import { Coins, TrendingUp, Target, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStartApp: () => void;
}

export default function LandingPage({ onStartApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full shadow-lg">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            MoneyCoach Jr.
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-8 text-center">
        <div className="max-w-md mx-auto space-y-8">
          {/* Welcome Message */}
          <div className="space-y-4">
            <div className="text-6xl mb-4 animate-bounce">
              💰📊🎯
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              Welcome to your
              <span className="block text-blue-600">Money Adventure!</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Learn about money in a fun way, track your spending, and reach your savings goals!
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 gap-4 my-8">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Manage My Money</h3>
                <p className="text-sm text-gray-600">Keep track of your allowance</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Track Expenses</h3>
                <p className="text-sm text-gray-600">See where you spend your money</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Reach Savings Goals</h3>
                <p className="text-sm text-gray-600">Save for your dreams and wishes</p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="space-y-4">
            <button
              onClick={onStartApp}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start App
                <Sparkles className="w-5 h-5" />
              </div>
            </button>
            
            <p className="text-sm text-gray-500">
              No registration required - just get started! 🚀
            </p>
          </div>
        </div>
      </main>

      {/* Fun Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center">
        <div className="text-2xl animate-pulse">
          ✨🌟✨
        </div>
      </footer>
    </div>
  );
}