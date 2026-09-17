import React from 'react';

interface ToastProps {
  show: boolean;
  message: string;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ show, message, icon = 'check_circle' }) => {
  if (!show) return null;

  return (
    <div
      id="toastNotification"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-primary text-on-primary shadow-2xl border border-secondary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <span className="material-symbols-outlined text-secondary-fixed text-[20px]" id="toastIcon">
        {icon}
      </span>
      <span className="font-label-md text-label-md font-semibold" id="toastMessage">
        {message}
      </span>
    </div>
  );
};
