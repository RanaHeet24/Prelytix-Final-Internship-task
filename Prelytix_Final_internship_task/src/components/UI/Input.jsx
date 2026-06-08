import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-slate-900/60 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-300 outline-none ${
          error
            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
        }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}
