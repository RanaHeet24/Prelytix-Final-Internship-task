import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) {
  return (
    <div
      className={`glass-effect rounded-2xl p-5 border border-white/5 transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-white/10' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
