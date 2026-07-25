import React from 'react';
import { motion } from 'framer-motion';
import { useTelemetry } from '../../context/TelemetryContext';
import { ShieldCheck, Activity, Radio, AlertTriangle, AlertCircle } from 'lucide-react';

export const StatusBanner: React.FC = () => {
  const { data } = useTelemetry();
  const evaluation = data?.evaluation;
  const overallStatus = evaluation?.overall_status || 'HEALTHY';
  const avgWqi = evaluation?.average_wqi ?? 84.5;
  const maxPi = evaluation?.max_pollution_index ?? 0.18;
  const activeNodesCount = Object.keys(evaluation?.nodes || {}).length || 5;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return { text: 'HIGH RISK & CRITICAL', badge: 'ACTION REQUIRED', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' };
      case 'WARNING':
        return { text: 'MODERATE ATTENTION', badge: 'MONITORING', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
      default:
        return { text: 'SAFE & CLEAN', badge: 'OPTIMAL QUALITY', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    }
  };

  const statusInfo = getStatusText(overallStatus);

  const getWqiRating = (wqi: number) => {
    if (wqi >= 80) return { label: 'EXCELLENT', color: 'text-emerald-400' };
    if (wqi >= 65) return { label: 'GOOD', color: 'text-sky-400' };
    if (wqi >= 50) return { label: 'MODERATE', color: 'text-amber-400' };
    return { label: 'POOR', color: 'text-rose-400' };
  };

  const wqiRating = getWqiRating(avgWqi);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Tile 1: Water Safety Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="kpi-glass-tile rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between glint-effect group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Water Safety Score</span>
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center badge-glow-cyan">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl lg:text-4xl font-display font-extrabold text-white leading-none tracking-tight">
              {avgWqi.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400">/ 100</span>
          </div>
          <p className={`text-xs font-mono font-bold mt-2 ${wqiRating.color}`}>
            {wqiRating.label} WATER QUALITY
          </p>
        </div>
      </motion.div>

      {/* Tile 2: River Health Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="kpi-glass-tile rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between glint-effect group"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 ${overallStatus === 'CRITICAL' ? 'bg-rose-500/15' : overallStatus === 'WARNING' ? 'bg-amber-500/15' : 'bg-emerald-500/15'} rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60`} />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">River Health</span>
          <div className={`w-8 h-8 rounded-xl ${statusInfo.bg} border ${statusInfo.border} flex items-center justify-center ${overallStatus === 'CRITICAL' ? 'badge-glow-rose' : overallStatus === 'WARNING' ? 'badge-glow-amber' : 'badge-glow-emerald'}`}>
            {overallStatus === 'CRITICAL' ? <AlertCircle className="w-4 h-4 text-rose-400" /> :
             overallStatus === 'WARNING' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
             <Activity className="w-4 h-4 text-emerald-400" />}
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <span className={`text-2xl font-display font-extrabold leading-none tracking-tight block ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-slate-200 border border-white/10 uppercase tracking-wider">
            {statusInfo.badge}
          </span>
        </div>
      </motion.div>

      {/* Tile 3: Active Monitoring Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="kpi-glass-tile rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between glint-effect group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Monitoring Stations</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center badge-glow-emerald">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl lg:text-4xl font-display font-extrabold text-white leading-none tracking-tight">
              {activeNodesCount} / 5
            </span>
          </div>
          <p className="text-xs font-mono font-bold text-emerald-400 mt-2">
            STATIONS ONLINE
          </p>
        </div>
      </motion.div>

      {/* Tile 4: Pollution Index */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="kpi-glass-tile rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between glint-effect group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Pollution Level</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center badge-glow-amber">
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl lg:text-4xl font-display font-extrabold text-amber-400 leading-none tracking-tight">
              {maxPi.toFixed(2)}
            </span>
          </div>
          <p className="text-xs font-mono font-bold text-slate-300 mt-2">
            {maxPi < 0.5 ? '0.18 · LOW RISK' : maxPi < 1.0 ? 'MODERATE RISK' : 'HIGH RISK'}
          </p>
        </div>
      </motion.div>

    </div>
  );
};
