import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      <div className="relative flex items-center justify-center">
        {/* Pulsating outer ring */}
        <div className="absolute w-16 h-16 rounded-full border border-indigo-500/30 animate-ping" />
        
        {/* Rotating inner gradient circle */}
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
      <p className="mt-6 text-xs font-semibold tracking-widest uppercase text-slate-400 animate-pulse">
        Initializing Checkout Space...
      </p>
    </div>
  );
}
