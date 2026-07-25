import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useTelemetry } from '../../context/TelemetryContext';
import { MapPin, Compass, Maximize2, Minimize2 } from 'lucide-react';

const STATIONS = [
  { id: 'NODE_BHT_01', name: 'Bhoothathankettu Station', km: 0, x: 7.5, y: 50, lat: "10.1412° N", lon: "76.6631° E" },
  { id: 'NODE_NRM_02', name: 'Neriamangalam Station', km: 24.5, x: 30.0, y: 30, lat: "10.0524° N", lon: "76.7812° E" },
  { id: 'NODE_ALV_03', name: 'Aluva Water Intake', km: 62, x: 52.5, y: 70, lat: "10.1084° N", lon: "76.3541° E" },
  { id: 'NODE_ELR_04', name: 'Eloor Industrial Belt', km: 74.5, x: 75.0, y: 35, lat: "10.0762° N", lon: "76.2974° E" },
  { id: 'NODE_KCH_05', name: 'Kochi Estuary Outlet', km: 88, x: 92.5, y: 60, lat: "9.9754° N", lon: "76.2415° E" },
];

function getStatusColor(status?: string): { hex: string; text: string; bg: string } {
  if (status === 'CRITICAL') {
    return { hex: '#ff3b30', text: 'text-rose-400', bg: 'bg-rose-500' };
  }
  if (status === 'WARNING') {
    return { hex: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500' };
  }
  return { hex: '#00e699', text: 'text-emerald-300', bg: 'bg-emerald-500' };
}

export const StationMap: React.FC = () => {
  const { data, selectedNodeId, setSelectedNodeId } = useTelemetry();
  const nodes = data?.evaluation?.nodes || {};
  const [isExpanded, setIsExpanded] = useState(false);

  const content = (
    <>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-emerald-400 shadow-[0_0_12px_#00e699]" />
          <div>
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">Periyar River Map</h3>
            <p className="text-xs text-slate-400 font-medium">Live tracking of water conditions across the 88km river stretch.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 font-bold shadow-inner">
            <Compass className="w-4 h-4 text-emerald-400" />
            LIVE MAP ACTIVE
          </span>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white border border-transparent hover:border-white/20"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 w-full bg-slate-950/40 rounded-2xl border border-white/[0.05] overflow-hidden min-h-0 shadow-inner" style={{ perspective: "1500px" }}>
        
        {/* 3D Map Transform Container */}
        <div className="absolute inset-0 w-full h-full transition-transform duration-[1s] ease-out hover:rotate-x-[20deg] hover:rotate-z-[-5deg] hover:scale-105"
             style={{ 
               transform: "rotateX(55deg) rotateZ(-12deg) scale(1.15) translateY(-5%)", 
               transformStyle: "preserve-3d" 
             }}>
        
        {/* Ambient background inside map */}
        <div className="absolute inset-0 bg-[#070b16]/75 pointer-events-none" />
        
        {/* Subtle watermark text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden mix-blend-overlay">
          <span className="text-[12rem] font-display font-black tracking-[0.2em] text-white whitespace-nowrap blur-[2px] transform -rotate-12">
            PERIYAR
          </span>
        </div>



        {/* SVG Flowing Spline with tributaries */}
        <svg 
          viewBox="0 0 800 200" 
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* Auxiliary Tributary 1 (Dashed) */}
          <path 
            d="M 60,100 C 120,130 180,120 240,60" 
            fill="none" 
            stroke="rgba(99,102,241,0.2)" 
            strokeWidth="1.5" 
            strokeDasharray="4 6" 
            vectorEffect="non-scaling-stroke"
          />

          {/* Auxiliary Tributary 2 (Dashed) */}
          <path 
            d="M 420,140 C 460,180 500,160 540,110" 
            fill="none" 
            stroke="rgba(6,182,212,0.2)" 
            strokeWidth="1.5" 
            strokeDasharray="4 6" 
            vectorEffect="non-scaling-stroke"
          />

          {/* Underlay river bed glow */}
          <path 
            d="M 60,100 C 150,40 180,60 240,60 C 300,60 360,140 420,140 C 480,140 540,70 600,70 C 660,70 700,120 740,120"
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="8" 
            strokeLinecap="round"
            className="opacity-20"
            vectorEffect="non-scaling-stroke"
          />

          {/* Core river line */}
          <path 
            d="M 60,100 C 150,40 180,60 240,60 C 300,60 360,140 420,140 C 480,140 540,70 600,70 C 660,70 700,120 740,120"
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Animating river flow dash */}
          <path 
            d="M 60,100 C 150,40 180,60 240,60 C 300,60 360,140 420,140 C 480,140 540,70 600,70 C 660,70 700,120 740,120"
            fill="none" 
            stroke="#22d3ee" 
            strokeWidth="2.5" 
            strokeDasharray="14 28" 
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{
              animation: 'riverFlowMap 5s linear infinite'
            }}
          />

          {/* Selected Node Radiating Sonar Wave */}
          {selectedNodeId && STATIONS.find(s => s.id === selectedNodeId) && (() => {
            const current = STATIONS.find(s => s.id === selectedNodeId)!;
            const evalData = nodes[selectedNodeId];
            const color = getStatusColor(evalData?.status).hex;
            
            // Map percentage coordinates to viewBox width 800 and height 200
            const xVal = (current.x / 100) * 800;
            const yVal = (current.y / 100) * 200;

            return (
              <g>
                <circle cx={xVal} cy={yVal} r="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" vectorEffect="non-scaling-stroke">
                  <animate attributeName="r" values="8;120" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={xVal} cy={yVal} r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke">
                  <animate attributeName="r" values="8;80" dur="3s" begin="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })()}
          
          <style>{`
            @keyframes riverFlowMap {
              from { stroke-dashoffset: 168; }
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </svg>

        {/* Stations Overlay */}
        {STATIONS.map((station, i) => {
          const evalData = nodes[station.id];
          const status = evalData?.status || 'HEALTHY';
          const colors = getStatusColor(status);
          const isSelected = selectedNodeId === station.id;
          const wqi = evalData?.water_quality_index;

          return (
            <div
              key={station.id}
              style={{
                left: `${station.x}%`,
                top: `${station.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 group p-6 -m-6 cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const target = e.currentTarget.querySelector('.magnetic-target') as HTMLElement;
                if (target) target.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget.querySelector('.magnetic-target') as HTMLElement;
                if (target) target.style.transform = `translate(0px, 0px)`;
              }}
            >
              {/* Pulsing rings */}
              <div className="relative flex items-center justify-center magnetic-target transition-transform duration-150 ease-out" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* 3D Volumetric Light Pillar */}
                <div 
                  className="absolute bottom-[50%] left-1/2 origin-bottom transition-all duration-[1.5s] z-0"
                  style={{
                    transform: 'translateX(-50%) rotateX(-90deg)', // Stand up in 3D space
                    width: '10px',
                    height: `${(wqi ? Math.max(20, (100 - wqi) * 1.5) : 30)}px`, // Taller for worse WQI
                    backgroundColor: colors.hex,
                    opacity: isSelected ? 0.9 : 0.4,
                    filter: `drop-shadow(0 0 10px ${colors.hex})`,
                    pointerEvents: 'none'
                  }}
                />

                {/* HUD Targeting Reticle */}
                <motion.svg 
                  viewBox="0 0 100 100" 
                  className={`absolute inset-0 m-auto w-16 h-16 pointer-events-none transition-all duration-300 z-10 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-150 group-hover:opacity-100 group-hover:scale-100'}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{ color: colors.hex }}
                >
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 15" opacity="0.6" />
                  <path d="M 25 25 L 35 25 M 25 25 L 25 35" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 75 25 L 65 25 M 75 25 L 75 35" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 25 75 L 35 75 M 25 75 L 25 65" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 75 75 L 65 75 M 75 75 L 75 65" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="5" x2="50" y2="15" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="50" y1="95" x2="50" y2="85" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="5" y1="50" x2="15" y2="50" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="95" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="1.5" />
                </motion.svg>
                
                <motion.div
                  animate={{ scale: [1, 2.3, 1], opacity: [0.15, 0, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                  className={`absolute w-9 h-9 rounded-full border border-current z-10 ${colors.text}`}
                />

                <motion.div
                  animate={{ scale: [1, 1.7, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className={`absolute w-6.5 h-6.5 rounded-full border border-current z-10 ${colors.text}`}
                />

                {/* Main Node core button */}
                <button
                  onClick={() => setSelectedNodeId(station.id)}
                  className={`w-4.5 h-4.5 rounded-full border-2 border-[#02040a] cursor-pointer shadow-lg transition-transform duration-300 relative z-20 ${
                    isSelected ? 'scale-130' : 'hover:scale-120'
                  }`}
                  style={{
                    backgroundColor: colors.hex,
                    boxShadow: isSelected ? `0 0 20px ${colors.hex}` : `0 2px 8px rgba(0,0,0,0.6)`,
                  }}
                />

                {/* Hover Details Card (Mini Tooltip) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-300 z-30">
                  <div className="px-4 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.8)] flex flex-col gap-1 whitespace-nowrap">
                    <span className="text-xs font-extrabold text-white leading-none">{station.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{station.lat} · {station.lon}</span>
                    <span className="text-[9px] text-indigo-400 font-mono">River km {station.km}</span>
                    {wqi !== undefined && (
                      <span className={`text-xs font-mono font-bold mt-1.5 ${colors.text}`}>
                        WQI: {wqi} · {status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status indicator labels above nodes */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center select-none">
                  <div className="px-2 py-0.5 rounded-lg bg-slate-950/80 border border-white/[0.05] backdrop-blur-sm shadow-sm">
                    <span className="text-[10px] font-mono font-bold text-slate-350">
                      WQI {wqi !== undefined ? wqi : '--'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Upstream/Downstream legend */}
      <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400 font-mono tracking-[0.2em] uppercase font-semibold">
        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-500" /> Western Ghats (Upstream)</span>
        <span className="w-24 h-px bg-white/[0.04]" />
        <span>Arabian Sea (Downstream)</span>
      </div>
      
    </>
  );

  const baseView = (
    <div className="periyar-glass-card rounded-2xl p-6 relative overflow-hidden h-full flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(0,242,254,0.12)] hover:border-white/20 cursor-default">
      <div className="glint" />
      <div className="parallax-inner flex flex-col h-full w-full relative z-10">
        {content}
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <>
        {/* Placeholder */}
        <div className="periyar-glass-card rounded-2xl p-6 relative overflow-hidden h-full flex flex-col opacity-0 pointer-events-none" />
        
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
