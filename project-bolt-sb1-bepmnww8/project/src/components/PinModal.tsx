import React, { useState, useEffect } from 'react';
import { Lock, X, RotateCcw } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPin: string;
}

export default function PinModal({ isOpen, onClose, onSuccess, currentPin }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showForgotPin, setShowForgotPin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setShowForgotPin(false);
    }
  }, [isOpen]);

  const handleNumberClick = (number: string) => {
    if (pin.length < 4) {
      setPin(pin + number);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleSubmit = () => {
    if (pin === currentPin) {
      onSuccess();
      setPin('');
    } else {
      setError('Wrong PIN! Try again 🔒');
      setPin('');
    }
  };

  const handleForgotPin = () => {
    alert('PIN has been reset to 1234! 🔓\n\nPlease use the default PIN to access parent area.');
    setShowForgotPin(false);
    setPin('');
    setError('');
  };

  useEffect(() => {
    if (pin.length === 4) {
      setTimeout(handleSubmit, 200);
    }
  }, [pin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Parent Access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Child-friendly message */}
        <div className="text-center mb-6 p-4 bg-yellow-50 rounded-xl border-2 border-dashed border-yellow-200">
          <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
          <p className="text-gray-700 font-medium">
            This is for parents only!
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Ask your mom or dad to enter their PIN
          </p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${
                pin.length > index
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-300'
              }`}
            >
              {pin.length > index ? '●' : ''}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center mb-4 p-3 bg-red-50 text-red-600 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number.toString())}
              className="h-14 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xl text-gray-800 transition-colors"
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setShowForgotPin(true)}
            className="h-14 bg-yellow-100 hover:bg-yellow-200 rounded-xl font-medium text-sm text-yellow-700 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="h-14 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xl text-gray-800 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 bg-red-100 hover:bg-red-200 rounded-xl font-bold text-lg text-red-600 transition-colors"
          >
            ⌫
          </button>
        </div>

        {/* Forgot PIN Modal */}
        {showForgotPin && (
          <div className="absolute inset-0 bg-white rounded-2xl p-6 flex flex-col justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🔓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reset PIN?</h3>
              <p className="text-gray-600 mb-6">
                This will reset your PIN back to the default: <strong>1234</strong>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForgotPin(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPin}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  Reset PIN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hint */}
        <div className="text-center text-sm text-gray-500">
          Default PIN: 1234
        </div>
      </div>
    </div>
  );
}