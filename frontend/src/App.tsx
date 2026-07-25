import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Header } from './layouts/Header';
import { StatusBanner } from './components/dashboard/StatusBanner';
import { AlertBroadcastModule } from './components/dashboard/AlertBroadcastModule';
import { AquaSentinel3DRiver } from './components/river-map/Periyar3DRiver';
import { StationMap } from './components/river-map/StationMap';
import { NodeInfoPanel } from './components/river-map/NodeInfoPanel';
import { WaterQualityGrid } from './components/dashboard/WaterQualityGrid';
import { AiConsole } from './components/dashboard/AiConsole';
import { TrendSparklines } from './components/dashboard/TrendSparklines';
import { SimulationStudio } from './components/simulation/SimulationStudio';
import { Shield } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { data } = useTelemetry();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);

  // Splash Screen reveal timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroActive(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for subtle UI Spotlights
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Determine global mood color
  const status = data?.evaluation?.overall_status || 'SAFE';

  const glowColor1 = status === 'CRITICAL' ? 'bg-rose-600/10' : status === 'WARNING' ? 'bg-amber-500/10' : 'bg-cyan-500/10';
  const glowColor2 = status === 'CRITICAL' ? 'bg-red-500/10' : status === 'WARNING' ? 'bg-orange-400/10' : 'bg-emerald-500/10';

  return (
    <div className="min-h-screen w-full bg-[#070b16] text-[#e2e8f0] relative overflow-x-hidden overflow-y-auto font-sans flex flex-col selection:bg-cyan-500/20">
      
      {/* Dark Solid Backdrop */}
      <div className="fixed inset-0 z-0 bg-[#070b16] pointer-events-none transition-colors duration-1000" />

      {/* Visual Splash Screen / Boot sequence */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#070b16] flex flex-col items-center justify-center gap-6"
          >
            {/* Ultra Premium Shield Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
              className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-cyan-500/40 shadow-xl"
            >
              <Shield className="w-8 h-8 text-cyan-400" />
            </motion.div>

            {/* Title Decryption */}
            <div className="text-center space-y-2">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-display font-extrabold text-white tracking-[0.3em] uppercase"
              >
                Aqua<span className="text-cyan-400">Sentinel</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.4 }}
                className="text-[11px] font-mono text-cyan-300 tracking-[0.25em] uppercase font-bold"
              >
                Initializing River Monitoring System
              </motion.p>
            </div>

            {/* Progress loading bar */}
            <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden relative border border-cyan-500/20">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '0%' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.6)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating ambient bioluminescent blobs in background */}
      <div className={`absolute top-[5%] left-[10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-20 pointer-events-none z-0 animate-blob-1 transition-colors duration-1000 ${glowColor1}`} />
      <div className={`absolute bottom-[10%] right-[5%] w-[700px] h-[700px] rounded-full blur-[150px] opacity-15 pointer-events-none z-0 animate-blob-2 transition-colors duration-1000 ${glowColor2}`} />

      {/* 3D WebGL Flow Background */}
      <AquaSentinel3DRiver />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-full w-full">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 w-full max-w-[1920px] mx-auto px-6 py-6 flex flex-col gap-6">
          {/* Status Banner - 4-Card Top KPI Summary Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <StatusBanner />
          </motion.div>

          {/* Alert Broadcast Module - Dynamic Emergency Transmission Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <AlertBroadcastModule />
          </motion.div>

          {/* Tab content with Fluid Framer-motion Transitions */}
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-min"
                >
                  {/* Balanced 2-Column Main Dashboard Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-min">
                    {/* Left Column (60% width): Interactive River Map */}
                    <div className="lg:col-span-7 h-[560px]">
                      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="h-full">
                        <StationMap />
                      </motion.div>
                    </div>
                    
                    {/* Right Column (40% width): Water Safety Parameters */}
                    <div className="lg:col-span-5 h-[560px]">
                      <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="h-full">
                        <WaterQualityGrid />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'diagnostics' && (
                <motion.div
                  key="diagnostics"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-min flex flex-col gap-6"
                >
                  <div className="w-full h-[650px]">
                    <AiConsole />
                  </div>
                </motion.div>
              )}

              {activeTab === 'simulation' && (
                <motion.div
                  key="simulation"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <SimulationStudio />
                </motion.div>
              )}

              {activeTab === 'historical' && (
                <motion.div
                  key="historical"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-min flex flex-col gap-6"
                >
                  <div className="w-full h-[650px]">
                    <TrendSparklines />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modal detail slide panel */}
      <NodeInfoPanel />
    </div>
  );
};

export default function App() {
  return (
    <TelemetryProvider>
      <DashboardContent />
    </TelemetryProvider>
  );
}
