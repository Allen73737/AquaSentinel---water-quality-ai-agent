import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelemetry } from '../../context/TelemetryContext';
import { 
  Play, 
  Sun, 
  FlaskConical, 
  CloudRain, 
  Sliders, 
  Binary, 
  Gauge, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import type { SimulationMode } from '../../types/telemetry';

const MODE_DEFS: Record<SimulationMode, { 
  label: string; 
  desc: string; 
  icon: React.ComponentType<any>; 
  colorClass: string;
  glowColor: string; 
}> = {
  HISTORICAL_REPLAY: { 
    label: 'Historical Replay', 
    desc: 'Sequential playback of recorded telemetry logs from past seasons.', 
    icon: Play,
    colorClass: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.2)'
  },
  NORMAL_CONDITIONS: { 
    label: 'Normal Baseline', 
    desc: 'Standard seasonal water quality parameters and baseline inputs.', 
    icon: Sun,
    colorClass: 'text-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.2)'
  },
  INDUSTRIAL_DISCHARGE: { 
    label: 'Industrial Discharge', 
    desc: 'Chemical effluent leakage scenario simulating high acidic load.', 
    icon: FlaskConical,
    colorClass: 'text-rose-400',
    glowColor: 'rgba(244, 63, 94, 0.2)'
  },
  HEAVY_RAINFALL: { 
    label: 'Heavy Rainfall', 
    desc: 'Monsoon runoffs, flash floods, and severe sediment load dispersion.', 
    icon: CloudRain,
    colorClass: 'text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.2)'
  },
  MANUAL_TESTING: { 
    label: 'Manual Injector', 
    desc: 'Inject manual override parameters directly into active sensor arrays.', 
    icon: Sliders,
    colorClass: 'text-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.2)'
  },
  DEVELOPER_MODE: { 
    label: 'Developer Stress', 
    desc: 'Chaotic edge parameters for AI predictive testing under heavy loads.', 
    icon: Binary,
    colorClass: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.2)'
  },
};

export const SimulationStudio: React.FC = () => {
  const { activeMode, changeMode } = useTelemetry();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncLabel, setSyncLabel] = useState<string>('');

  const handleModeChange = async (mode: SimulationMode) => {
    if (mode === activeMode) return;
    setSyncLabel(MODE_DEFS[mode].label);
    setIsSyncing(true);
    
    // Showcase premium syncing feedback
    await changeMode(mode);
    setTimeout(() => {
      setIsSyncing(false);
    }, 700);
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
      
      {/* Synchronization Overlay */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-40"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <RefreshCw className="w-8 h-8 text-indigo-400" />
            </motion.div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-[0.25em] animate-pulse">Syncing Physics Engine</h4>
              <p className="text-xs text-slate-400 font-mono">Injecting model boundaries: {syncLabel}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-cyan-500/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white tracking-tight">Environmental Hydro-Simulation Studio</h3>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">Inject synthetic hydrological stress scenarios and model basin response in real time</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3.5 py-2 rounded-xl bg-abyss-900/90 border border-cyan-500/25 text-cyan-300 flex items-center gap-2 uppercase tracking-wider shadow-inner">
          <Gauge className="w-4 h-4 text-cyan-400" />
          Mode: {MODE_DEFS[activeMode]?.label || activeMode}
        </span>
      </div>

      {/* Grid of Simulation Mode Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(Object.keys(MODE_DEFS) as SimulationMode[]).map(modeId => {
          const item = MODE_DEFS[modeId];
          const Icon = item.icon;
          const isActive = activeMode === modeId;

          return (
            <motion.button
              key={modeId}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleModeChange(modeId)}
              className={`p-5 md:p-6 rounded-2xl text-left border relative overflow-hidden transition-all duration-350 cursor-pointer flex flex-col justify-between h-[160px] glint-effect ${
                isActive
                  ? 'border-cyan-400/40 bg-slate-900/90 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                  : 'border-white/[0.06] bg-slate-950/40 hover:bg-slate-900/60 hover:border-cyan-500/20'
              }`}
              style={{
                boxShadow: isActive ? `0 12px 40px rgba(0,0,0,0.6), 0 0 25px ${item.glowColor}` : 'none'
              }}
            >
              {/* Soft background ambient dot for active cards */}
              {isActive && (
                <div className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-2xl opacity-15 bg-current ${item.colorClass}`} />
              )}

              <div className="flex items-start justify-between w-full relative z-10">
                <div className={`p-2.5 rounded-xl border bg-slate-950/80 ${
                  isActive ? 'border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-white/[0.04]'
                }`}>
                  <Icon className={`w-4.5 h-4.5 ${isActive ? item.colorClass : 'text-slate-400'}`} />
                </div>
                {isActive && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                  </span>
                )}
              </div>

              <div className="mt-4 relative z-10">
                <h4 className={`text-sm font-display font-extrabold transition-colors ${
                  isActive ? 'text-white' : 'text-slate-200'
                }`}>
                  {item.label}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1 font-medium">{item.desc}</p>
              </div>

            </motion.button>
          );
        })}
      </div>

      {/* AI Interactive Remediation Intervention Deck */}
      <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h4 className="text-sm font-display font-extrabold text-white uppercase tracking-wider">AI Remediation Strategy Controller</h4>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 font-bold">
            Simulate Chemical Reactions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={async () => {
              try {
                await fetch('http://localhost:5000/api/v1/agent/remediate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ strategy: 'AERATION_BARGES' })
                });
              } catch (e) {}
            }}
            className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 hover:border-emerald-500/40 text-left transition-all cursor-pointer group hover:-translate-y-1 shadow-sm"
          >
            <span className="text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300 block">⚡ Deploy Aeration Barges</span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">Injects high-diffuse micro-bubbles (+3.2 mg/L DO boost in 20m)</span>
          </button>

          <button
            onClick={async () => {
              try {
                await fetch('http://localhost:5000/api/v1/agent/remediate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ strategy: 'CALCIUM_CARBONATE_BUFFER' })
                });
              } catch (e) {}
            }}
            className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20 hover:border-amber-500/40 text-left transition-all cursor-pointer group hover:-translate-y-1 shadow-sm"
          >
            <span className="text-xs font-mono font-bold text-amber-400 group-hover:text-amber-300 block">🧪 Inject pH Buffer Solution</span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">Neutralizes acidic industrial leaks (CaCO₃ buffer ➔ pH 7.4)</span>
          </button>

          <button
            onClick={async () => {
              try {
                await fetch('http://localhost:5000/api/v1/agent/remediate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ strategy: 'DAM_SPILLWAY_FLUSH' })
                });
              } catch (e) {}
            }}
            className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-500/40 text-left transition-all cursor-pointer group hover:-translate-y-1 shadow-sm"
          >
            <span className="text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300 block">🌊 Spillway Hydraulic Flush</span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">Opens Bhoothathankettu sluice gates (+35% freshwater dilution)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
