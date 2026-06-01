import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

let toastTimeout;

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => setToast(null), 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`toast-container ${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === 'success' && <CheckCircle size={20} />}
                        {toast.type === 'error' && <XCircle size={20} />}
                        {toast.type === 'info' && <AlertCircle size={20} />}
                    </div>
                    <p>{toast.message}</p>
                    <button onClick={() => setToast(null)}><X size={16} /></button>
                </div>
            )}
        </ToastContext.Provider>
    );
};

const ToastContext = React.createContext();
export const useToast = () => React.useContext(ToastContext);
