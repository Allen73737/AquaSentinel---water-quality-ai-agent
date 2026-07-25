import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useTelemetry } from '../../context/TelemetryContext';
import { X, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

const NODE_META: Record<string, { name: string; km: number; desc: string }> = {
  NODE_BHT_01: { name: 'Bhoothathankettu Barrage', km: 0.0, desc: 'Upstream reservoir and forest baseline station' },
  NODE_NRM_02: { name: 'Neriamangalam Basin', km: 24.5, desc: 'Upper midstream confluence zone' },
  NODE_ALV_03: { name: 'Aluva Water Intake', km: 62.0, desc: 'Primary drinking water abstraction point' },
  NODE_ELR_04: { name: 'Eloor Industrial Belt', km: 74.5, desc: 'Heavy industrial corridor monitoring station' },
  NODE_KCH_05: { name: 'Kochi Estuary Outlet', km: 88.0, desc: 'Tidal estuarine outlet to Arabian Sea' },
};

const PARAM_LABELS: Record<string, { label: string; unit: string }> = {
  ph: { label: 'pH Level', unit: 'pH' },
  do: { label: 'Dissolved Oxygen', unit: 'mg/L' },
  turbidity: { label: 'Turbidity', unit: 'NTU' },
  bod: { label: 'Biochemical Oxygen Demand', unit: 'mg/L' },
  cod: { label: 'Chemical Oxygen Demand', unit: 'mg/L' },
  temp: { label: 'Temperature', unit: '°C' },
  ec: { label: 'Electrical Conductivity', unit: 'µS/cm' },
};

const PARAM_EXTENTS: Record<string, { minVal: number; maxVal: number; targetMin: number; targetMax: number }> = {
  ph: { minVal: 4.0, maxVal: 10.0, targetMin: 6.5, targetMax: 8.5 },
  do: { minVal: 0.0, maxVal: 16.0, targetMin: 6.0, targetMax: 14.0 },
  turbidity: { minVal: 0.0, maxVal: 15.0, targetMin: 0.0, targetMax: 5.0 },
  bod: { minVal: 0.0, maxVal: 8.0, targetMin: 0.0, targetMax: 3.0 },
  cod: { minVal: 0.0, maxVal: 40.0, targetMin: 0.0, targetMax: 15.0 },
  temp: { minVal: 15.0, maxVal: 35.0, targetMin: 24.0, targetMax: 28.0 },
  ec: { minVal: 0.0, maxVal: 800.0, targetMin: 0.0, targetMax: 500.0 },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } }
};

export const NodeInfoPanel: React.FC = () => {
  const { data, selectedNodeId, setSelectedNodeId } = useTelemetry();

  if (!selectedNodeId) return null;

  const nodeEval = data?.evaluation?.nodes[selectedNodeId];
  const readings = nodeEval?.readings || data?.node_readings?.[selectedNodeId];
  const meta = NODE_META[selectedNodeId] || { name: selectedNodeId, km: 0, desc: '' };
  
  const status = nodeEval?.status || 'HEALTHY';
  
  let statusColorHex = '#10b981'; // Emerald
  let statusBg = 'bg-emerald-500/10 border-emerald-500/20';
  let statusTextClass = 'text-emerald-400';
  let statusGlow = 'rgba(16, 185, 129, 0.12)';
  
  if (status === 'CRITICAL') {
    statusColorHex = '#f43f5e'; // Rose
    statusBg = 'bg-rose-500/10 border-rose-500/20';
    statusTextClass = 'text-rose-400';
    statusGlow = 'rgba(244, 63, 94, 0.12)';
  } else if (status === 'WARNING') {
    statusColorHex = '#f59e0b'; // Amber
    statusBg = 'bg-amber-500/10 border-amber-500/20';
    statusTextClass = 'text-amber-400';
    statusGlow = 'rgba(245, 158, 11, 0.12)';
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
        onClick={() => setSelectedNodeId(null)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 260 }}
          className="w-full max-w-md h-full bg-[#02050e]/95 backdrop-blur-2xl border-l border-cyan-500/20 overflow-y-auto flex flex-col relative shadow-[0_0_60px_rgba(0,0,0,0.9),-10px_0_30px_rgba(6,182,212,0.15)]"
          onClick={e => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="sticky top-0 bg-[#02050e]/95 backdrop-blur-2xl border-b border-cyan-500/15 px-6 py-6 flex items-start justify-between z-10 shrink-0 shadow-md">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: statusColorHex, boxShadow: `0 0 12px ${statusColorHex}` }} />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-[0.25em]">{selectedNodeId}</span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-white tracking-tight leading-snug">{meta.name}</h2>
              <p className="text-sm font-sans text-slate-400 mt-1 font-semibold">River km {meta.km} · {meta.desc}</p>
            </div>
            
            <button
              onClick={() => setSelectedNodeId(null)}
              className="p-2.5 rounded-xl bg-abyss-900/80 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all cursor-pointer group shrink-0 shadow-inner"
            >
              <X className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform duration-250" />
            </button>
          </div>

          {/* Panel Scrollable Body */}
          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            
            {/* Key Assessment Card */}
            {nodeEval && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                className={`rounded-2xl border p-6 relative overflow-hidden ${statusBg}`}
                style={{
                  boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 24px ${statusGlow}`
                }}
              >
                {/* Background glow shape */}
                <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full ${status === 'HEALTHY' ? 'bg-emerald-500' : status === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'}`} />

                <div className="grid grid-cols-3 gap-4 text-center z-10 relative">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">NODE WQI</p>
                    <p className="text-2xl font-bold font-mono text-white mt-2 leading-none">{nodeEval.water_quality_index}</p>
                    <div className="mt-3 w-full h-1 bg-slate-950/40 rounded-full overflow-hidden relative">
                      <div className="h-full rounded-full bg-indigo-500/80" style={{ width: `${nodeEval.water_quality_index}%` }} />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">POLLUTION</p>
                    <p className={`text-2xl font-bold font-mono mt-2 leading-none ${statusTextClass}`}>{nodeEval.pollution_index.toFixed(2)}</p>
                    <div className="mt-3 w-full h-1 bg-slate-950/40 rounded-full overflow-hidden relative">
                      <div className={`h-full rounded-full bg-current ${statusTextClass}`} style={{ width: `${Math.min(100, nodeEval.pollution_index * 20)}%` }} />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">CONFIDENCE</p>
                    <p className="text-2xl font-bold font-mono text-slate-350 mt-2 leading-none">{nodeEval.confidence}%</p>
                    <div className="mt-3 w-full h-1 bg-slate-950/40 rounded-full overflow-hidden relative">
                      <div className="h-full rounded-full bg-emerald-500/80" style={{ width: `${nodeEval.confidence}%` }} />
                    </div>
                  </div>
                </div>

                {nodeEval.suggested_action && (
                  <div className="mt-5 pt-5 border-t border-white/[0.04] z-10 relative">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-4.5 h-4.5" />
                      AI Recommended Action
                    </p>
                    <p className="text-sm text-slate-200 font-semibold leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-white/[0.02]">
                      {nodeEval.suggested_action}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Sensor Telemetry List with visual gauges */}
            {readings && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Sensor Telemetry
                </h3>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3.5"
                >
                  {Object.entries(readings).map(([key, val]) => {
                    const info = PARAM_LABELS[key];
                    if (!info) return null;
                    
                    const range = PARAM_EXTENTS[key];
                    const within = range ? val >= range.targetMin && val <= range.targetMax : true;
                    
                    let valPct = 50;
                    let targetLeft = 25;
                    let targetWidth = 50;
                    
                    if (range && typeof val === 'number') {
                      const span = range.maxVal - range.minVal;
                      valPct = Math.max(0, Math.min(100, ((val - range.minVal) / span) * 100));
                      targetLeft = Math.max(0, Math.min(100, ((range.targetMin - range.minVal) / span) * 100));
                      targetWidth = Math.max(0, Math.min(100, ((range.targetMax - range.targetMin) / span) * 100));
                    }

                    return (
                      <motion.div 
                        key={key} 
                        variants={itemVariants}
                        className="py-3 px-4.5 rounded-xl bg-slate-950/20 border border-white/[0.03] space-y-3"
                      >
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold text-slate-350">{info.label}</span>
                            <span className="text-[10px] text-slate-500 font-mono ml-2">({info.unit})</span>
                          </div>
                          <span className={`text-sm font-extrabold font-mono ${within ? 'text-white' : 'text-rose-400'}`}>
                            {typeof val === 'number' ? val.toFixed(1) : val}
                          </span>
                        </div>

                        {/* Miniature Gauge line */}
                        {range && typeof val === 'number' && (
                          <div className="space-y-1.5">
                            <div className="h-1 w-full bg-white/5 rounded-full relative">
                              <div 
                                style={{ left: `${targetLeft}%`, width: `${targetWidth}%` }}
                                className="absolute h-full bg-indigo-500/20 rounded-full"
                              />
                              <div 
                                style={{ left: `${valPct}%` }}
                                className={`absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 top-1/2 rounded-full ${
                                  within ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-rose-400 shadow-[0_0_6px_#f43f5e]'
                                }`}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 font-semibold leading-none">
                              <span>Min {range.targetMin}</span>
                              <span className="opacity-75">Target: {range.targetMin} - {range.targetMax}</span>
                              <span>Max {range.targetMax}</span>
                            </div>
                          </div>
                        )}

                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}
            
          </div>

          {/* Footer details */}
          {nodeEval && (
            <div className="p-5 bg-[#030712]/50 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-500 font-mono shrink-0 z-10">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Updated: {nodeEval.timestamp}
              </span>
              <span>Inference: {nodeEval.inference_time_ms}ms</span>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
