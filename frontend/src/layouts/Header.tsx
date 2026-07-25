import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { setSimulationMode } from '../api/telemetryService';
import { Shield, MapPin, Radio, LayoutDashboard, Activity, Gauge, History, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
  { id: 'diagnostics', label: 'AI Analysis', icon: Activity },
  { id: 'simulation', label: 'Simulation Lab', icon: Gauge },
  { id: 'historical', label: 'Historical Trends', icon: History },
];

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { error } = useTelemetry();

  return (
    <header className="relative border-b border-white/[0.08] bg-[#030712]/75 backdrop-blur-2xl z-30 shadow-lg w-full">
      <div className="w-full max-w-[1920px] mx-auto px-8">
        <div className="flex items-center justify-between h-20 gap-6 py-2">
          
          {/* Brand Logo Info */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-105">
                <Shield className="w-5.5 h-5.5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-display font-extrabold text-white tracking-tight leading-none uppercase">
                    Aqua<span className="text-cyan-400">Sentinel</span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider">
                    KWA • CPCB STATIONS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase mt-1 font-display">
                  Periyar River Environmental Monitoring System
                </p>
              </div>
            </div>
          </div>

          {/* Integrated Navigation Tabs in Center Bar */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-white/[0.08] shadow-inner">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-5 py-2 rounded-lg transition-all duration-300 group flex items-center gap-2 cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                      layoutId="header-tab-active"
                      className="absolute inset-0 rounded-lg bg-white/10 border border-white/20 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon 
                    className={`w-4 h-4 relative z-10 transition-colors duration-300 ${
                      isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`relative z-10 text-xs font-display font-semibold tracking-wide transition-colors duration-300 ${
                      isActive ? 'text-white font-bold' : 'text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Diagnostics Panel Status & Profile */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Location indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 font-mono text-xs">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>PERIYAR, KERALA</span>
            </div>

            {/* Quick Status Simulator Switcher Pill */}
            <div className="hidden lg:flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <span className="text-[10px] font-bold text-slate-400 px-2 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                SIM:
              </span>
              <button
                onClick={() => setSimulationMode('NORMAL_CONDITIONS')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer"
                title="Set river status to SAFE"
              >
                SAFE
              </button>
              <button
                onClick={() => setSimulationMode('HEAVY_RAINFALL')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                title="Set river status to WARNING"
              >
                WARNING
              </button>
              <button
                onClick={() => setSimulationMode('INDUSTRIAL_DISCHARGE')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all cursor-pointer animate-pulse"
                title="Set river status to CRITICAL"
              >
                CRITICAL
              </button>
            </div>

            {/* Live Connection indicator */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-ghats-900/90 border border-emerald-500/25 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
              <div className="relative flex items-center justify-center">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  error ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' : 'bg-emerald-400 shadow-[0_0_14px_#00e699]'
                }`} />
                <span className={`absolute w-2.5 h-2.5 rounded-full ${
                  error ? 'bg-amber-500' : 'bg-emerald-400'
                } animate-ping opacity-50`} />
              </div>
              <span className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                {error ? 'RECONNECTING' : 'LIVE'}
              </span>
            </div>

            {/* KWA User Crest Avatar */}
            <div className="relative group cursor-pointer shrink-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center transition-all duration-300 shadow-md group-hover:border-emerald-400">
                <span className="text-xs font-display font-extrabold text-emerald-300">KWA</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#02080e] rounded-full shadow-[0_0_8px_#00e699]" />
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
};
