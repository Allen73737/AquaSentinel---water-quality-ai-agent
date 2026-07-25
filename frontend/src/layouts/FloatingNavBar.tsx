import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Activity, Cpu, History } from 'lucide-react';

interface FloatingNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
  { id: 'simulation', label: 'Simulation', icon: Cpu },
  { id: 'historical', label: 'History', icon: History },
];

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-[#060b18]/85 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-white/10"
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-6 py-3 rounded-xl transition-all duration-300 group flex items-center gap-2.5 cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-cyan-500/15 border border-cyan-400/50 shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon 
                className={`w-4.5 h-4.5 relative z-10 transition-all duration-300 ${
                  isActive 
                    ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,242,254,0.7)]' 
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span
                className={`relative z-10 text-sm font-display tracking-wide transition-all duration-300 ${
                  isActive 
                    ? 'text-white font-extrabold drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]' 
                    : 'text-slate-400 font-medium group-hover:text-slate-200'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};
