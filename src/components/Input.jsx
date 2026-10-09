import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      {props.type === 'textarea' ? (
        <textarea
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
            error ? 'border-danger-500' : 'border-slate-300'
          }`}
          {...props}
        />
      ) : (
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
            error ? 'border-danger-500' : 'border-slate-300'
          }`}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
