'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isOpen, onClose, duration = 2000 }: ToastProps) {
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
      }, 300); // Wait for fade-out animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md">
        <svg className="w-4 h-4 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-xs font-bold tracking-tight">{message}</span>
      </div>
    </div>
  );
}

