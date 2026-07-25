import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, type Variants, animate } from 'framer-motion';
import { useTelemetry } from '../../context/TelemetryContext';
import { ShieldCheck, AlertTriangle, Maximize2, Minimize2, Activity } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const AnimatedCounter = ({ value }: { value: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(parseFloat(node.textContent || '0'), value, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(val) {
          node.textContent = val.toFixed(1);
        },
      });
      return () => controls.stop();
    }
  }, [value]);

  return <span ref={nodeRef}>{value.toFixed(1)}</span>;
};

export const WaterQualityGrid: React.FC = () => {
  const { data, selectedNodeId } = useTelemetry();
  const [isExpanded, setIsExpanded] = useState(false);

  const activeNodeId = selectedNodeId || 'NODE_ELR_04';
  const activeNodeEval = data?.evaluation?.nodes?.[activeNodeId];
  const nodeReadings = data?.node_readings?.[activeNodeId] || activeNodeEval?.readings;

  const phVal = nodeReadings?.ph ?? 7.2;
  const doVal = nodeReadings?.do ?? 6.8;
  const turbVal = nodeReadings?.turbidity ?? 4.2;
  const bodVal = nodeReadings?.bod ?? 2.1;
  const coliformVal = nodeReadings?.cod ? Math.round(nodeReadings.cod * 15) : 210;
  const tempVal = nodeReadings?.temp ?? 26.5;

  const phStatus: 'safe' | 'warning' | 'critical' = (phVal < 6.5 || phVal > 8.5) ? 'critical' : 'safe';
  const doStatus: 'safe' | 'warning' | 'critical' = doVal < 4.0 ? 'warning' : 'safe';
  const turbStatus: 'safe' | 'warning' | 'critical' = turbVal > 10 ? 'warning' : 'safe';
  const bodStatus: 'safe' | 'warning' | 'critical' = bodVal > 3.0 ? 'warning' : 'safe';
  const coliformStatus: 'safe' | 'warning' | 'critical' = coliformVal > 500 ? 'warning' : 'safe';
  const tempStatus: 'safe' | 'warning' | 'critical' = (tempVal < 20 || tempVal > 30) ? 'warning' : 'safe';

  const getStatusColor = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const getBarColor = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-rose-500';
    }
  };

  const metrics = [
    {
      id: 'ph',
      name: 'pH Level (Acidity)',
      value: phVal,
      unit: '',
      min: 0,
      max: 14,
      target: '6.5 - 8.5',
      status: phStatus,
      icon: <span className="font-bold text-xs">pH</span>
    },
    {
      id: 'do',
      name: 'DO (Oxygen for Fish)',
      value: doVal,
      unit: 'mg/L',
      min: 0,
      max: 12,
      target: '> 4.0 mg/L',
      status: doStatus,
      icon: <span className="font-bold text-xs">O₂</span>
    },
    {
      id: 'turbidity',
      name: 'Turbidity (Cloudiness)',
      value: turbVal,
      unit: 'NTU',
      min: 0,
      max: 50,
      target: '< 10 NTU',
      status: turbStatus,
      icon: <span className="font-bold text-xs">~</span>
    },
    {
      id: 'bod',
      name: 'BOD (Organic Waste)',
      value: bodVal,
      unit: 'mg/L',
      min: 0,
      max: 10,
      target: '< 3.0 mg/L',
      status: bodStatus,
      icon: <span className="font-bold text-xs">BOD</span>
    },
    {
      id: 'coliform',
      name: 'Coliform (Bacteria Level)',
      value: coliformVal,
      unit: 'MPN/100ml',
      min: 0,
      max: 1000,
      target: '< 500 MPN',
      status: coliformStatus,
      icon: <span className="font-bold text-xs">B</span>
    },
    {
      id: 'temp',
      name: 'Water Temperature',
      value: tempVal,
      unit: '°C',
      min: 15,
      max: 35,
      target: '20 - 30 °C',
      status: tempStatus,
      icon: <span className="font-bold text-xs">°C</span>
    }
  ];

  const content = (
    <>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-lg font-semibold tracking-wide text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Live Parameters
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time chemical and physical metrics from the active sensor.</p>
        </div>
        <div className="flex items-center gap-3">
          {!!data && (
            <span className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white border border-transparent hover:border-white/20"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`flex-1 grid gap-4 overflow-y-auto pr-2 mask-fade-y ${isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
      >
        {metrics.map((metric) => {
          const progressPercentage = Math.min(100, Math.max(0, ((metric.value - metric.min) / (metric.max - metric.min)) * 100));
          
          return (
            <motion.div 
              key={metric.id}
              variants={itemVariants}
              className="periyar-glass-card p-4 rounded-xl flex flex-col justify-center gap-3 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(0,242,254,0.15)] hover:border-cyan-500/30 cursor-default group overflow-hidden glint-effect"
            >
              <div className="parallax-inner flex flex-col gap-3 w-full relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border font-mono ${getStatusColor(metric.status)} ${metric.status === 'safe' ? 'badge-glow-emerald' : metric.status === 'warning' ? 'badge-glow-amber' : 'badge-glow-rose'}`}>
                      {metric.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-semibold text-slate-200">{metric.name}</h3>
                      <p className="text-xs font-mono text-slate-400">Target: {metric.target}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-2xl font-display font-extrabold text-white tracking-tight tabular-nums">
                        <AnimatedCounter value={metric.value} />
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-400">{metric.unit}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${getStatusColor(metric.status)}`}>
                      {metric.status === 'safe' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {metric.status === 'safe' ? 'SAFE' : 'EXCEEDED'}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-white/[0.04] p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${getBarColor(metric.status)} shadow-[0_0_12px_rgba(var(--color),0.8)]`}
                    style={{ '--color': metric.status === 'safe' ? '16, 185, 129' : metric.status === 'warning' ? '245, 158, 11' : '244, 63, 94' } as React.CSSProperties}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );

  const baseView = (
    <div className="flex flex-col h-full space-y-4">
      {content}
    </div>
  );

  if (isExpanded) {
    return (
      <>
        {/* Placeholder */}
        <div className="flex flex-col h-full space-y-4 opacity-0 pointer-events-none" />
        
        {/* Fullscreen Portal */}
        {createPortal(
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-[#020814] flex flex-col overflow-hidden p-6"
          >
            {content}
          </motion.div>,
          document.body
        )}
      </>
    );
  }

  return baseView;
};
