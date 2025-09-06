
import React, { useState, useCallback, ReactNode, createContext, useContext } from 'react';
import Toast, { ToastProps } from '../components/ui/Toast';

interface ToastMessage {
  message: string;
  type: 'success' | 'error';
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: ToastMessage) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onDismiss'>[]>([]);

  const addToast = useCallback((toast: ToastMessage) => {
    setToasts((prevToasts) => [...prevToasts, { ...toast, id: toastId++ }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToasts = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToasts must be used within a ToastProvider');
  }
  return context;
};
