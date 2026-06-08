import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/40 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 text-xs text-slate-500">
        <div>
          <span>&copy; {new Date().getFullYear()} AetherCart Systems. Designed for extreme fidelity.</span>
        </div>
        <div className="flex space-x-6">
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">Security Policy</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">API Docs</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Use</span>
        </div>
      </div>
    </footer>
  );
}
