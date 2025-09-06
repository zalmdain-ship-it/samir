
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(id), 300); // Wait for fade out
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, duration, onDismiss]);

  const baseClasses = "flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800 transition-all duration-300";
  const positionClasses = isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0";

  const typeStyles = {
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      iconBg: "bg-green-100 dark:bg-green-800",
    },
    error: {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      iconBg: "bg-red-100 dark:bg-red-800",
    },
  };

  const currentType = typeStyles[type];

  return (
    <div className={`${baseClasses} ${positionClasses}`} role="alert">
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${currentType.iconBg}`}>
        {currentType.icon}
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button 
        type="button" 
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" 
        onClick={() => onDismiss(id)}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
