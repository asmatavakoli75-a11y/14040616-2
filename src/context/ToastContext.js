import React, { createContext, useState, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../components/AppIcon';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const Toast = ({ message, type, onClose }) => {
  const typeClasses = {
    success: {
      bg: 'bg-success/10',
      border: 'border-success/20',
      iconColor: 'text-success',
      icon: 'CheckCircle',
    },
    error: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      iconColor: 'text-destructive',
      icon: 'AlertTriangle',
    },
  };

  const classes = typeClasses[type] || typeClasses.success;

  return (
    <div className={`w-full max-w-sm p-4 rounded-lg shadow-lg flex items-start space-x-3 rtl:space-x-reverse animate-fade-in-down ${classes.bg} ${classes.border}`}>
      <Icon name={classes.icon} size={20} className={classes.iconColor} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${classes.iconColor}`}>{message}</p>
      </div>
      <button onClick={onClose}>
        <Icon name="X" size={16} className="text-muted-foreground" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000); // Auto-dismiss after 5 seconds
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div className="fixed top-5 right-5 z-[100] space-y-2">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
