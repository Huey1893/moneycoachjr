import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import MoneyTab from './components/MoneyTab';
import ExpensesTab from './components/ExpensesTab';
import GoalsTab from './components/GoalsTab';
import PinModal from './components/PinModal';
import ParentDashboard from './components/ParentDashboard';
import { TabType, AppData } from './types';
import { useAppData } from './hooks/useAppData';

function App() {
  const [showApp, setShowApp] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('money');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const { appData, updateAppData } = useAppData();

  useEffect(() => {
    // If user exists, skip landing page
    if (appData.user) {
      setShowApp(true);
    }
  }, [appData.user]);

  const handleStartApp = () => {
    // Create a simple user profile for demo
    const newUser = {
      id: 'user-1',
      name: 'MoneyCoach User',
      age: 12,
      totalMoney: 0,
      createdAt: new Date(),
      currency: appData.parentSettings.currency
    };

    updateAppData({
      ...appData,
      user: newUser
    });
    setShowApp(true);
  };

  const handleParentAccess = () => {
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setShowParentDashboard(true);
  };

  const handleCloseParentDashboard = () => {
    setShowParentDashboard(false);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'money':
        return <MoneyTab />;
      case 'expenses':
        return <ExpensesTab />;
      case 'goals':
        return <GoalsTab />;
      default:
        return <MoneyTab />;
    }
  };

  if (!showApp) {
    return <LandingPage onStartApp={handleStartApp} />;
  }

  if (showParentDashboard) {
    return <ParentDashboard onClose={handleCloseParentDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onParentAccess={handleParentAccess} />
      <main className="relative">
        {renderActiveTab()}
      </main>
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        currentPin={appData.parentSettings.pin}
      />
    </div>
  );
}

export default App;