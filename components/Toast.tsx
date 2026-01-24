'use client';

import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  type?: ToastType;
}

export default function Toast({ message, isOpen, onClose, duration = 3000, type = 'success' }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!shouldRender) return null;

  const iconColors = {
    success: 'text-[#10B981]',
    error: 'text-red-400',
    info: 'text-blue-400',
  };

  const icons = {
    success: (
      <svg className={`w-4 h-4 ${iconColors.success}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    error: (
      <svg className={`w-4 h-4 ${iconColors.error}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    info: (
      <svg className={`w-4 h-4 ${iconColors.info}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <div 
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md max-w-md">
        {icons[type]}
        <span className="text-xs font-bold tracking-tight">{message}</span>
      </div>
    </div>
  );
}

// Toast Context for global usage
interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<{ message: string; type: ToastType; duration: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 3000) => {
    setToast({ message, type, duration });
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}
