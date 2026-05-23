import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const TOAST_DEFAULTS = {
  type: 'info',
  duration: 3500,
  position: 'bottom-right',
  dismissible: true,
};

let toastIdCounter = 0;

export function ToastProvider({ children, maxVisible = 5 }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const showToast = useCallback((message, opts = {}) => {
    const id = ++toastIdCounter;
    const config = { ...TOAST_DEFAULTS, ...opts };
    const toast = { id, message, type: config.type, position: config.position, dismissible: config.dismissible, action: config.action || null };

    setToasts((prev) => {
      const next = [...prev, toast];
      return next.length > maxVisible ? next.slice(next.length - maxVisible) : next;
    });

    if (config.duration > 0) {
      timersRef.current[id] = setTimeout(() => removeToast(id), config.duration);
    }

    return id;
  }, [maxVisible, removeToast]);

  const updateToast = useCallback((id, updates) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const dismissAll = useCallback(() => {
    Object.keys(timersRef.current).forEach((id) => {
      clearTimeout(timersRef.current[id]);
    });
    timersRef.current = {};
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, updateToast, dismissAll }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');

  const toast = useCallback((message, opts = {}) => ctx.showToast(message, opts), [ctx]);
  const success = useCallback((message, opts = {}) => ctx.showToast(message, { ...opts, type: 'success' }), [ctx]);
  const error = useCallback((message, opts = {}) => ctx.showToast(message, { ...opts, type: 'error' }), [ctx]);
  const warning = useCallback((message, opts = {}) => ctx.showToast(message, { ...opts, type: 'warning' }), [ctx]);
  const info = useCallback((message, opts = {}) => ctx.showToast(message, { ...opts, type: 'info' }), [ctx]);

  return { ...ctx, toast, success, error, warning, info };
}
