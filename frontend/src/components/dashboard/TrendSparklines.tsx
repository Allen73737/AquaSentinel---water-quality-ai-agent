import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useTelemetry } from '../../context/TelemetryContext';
import { TrendingUp, Clock, Maximize2, Minimize2 } from 'lucide-react';

const W = 500;
const H = 140; // Slightly taller chart height
const PADDING_Y = 15;
const PADDING_X = 15;

export const TrendSparklines: React.FC = () => {
  const { nodeHistoryMap, selectedNodeId } = useTelemetry();
  const activeNodeId = selectedNodeId || 'NODE_ELR_04';
  const history = nodeHistoryMap[activeNodeId] || [];

  const [hoveredWqiIdx, setHoveredWqiIdx] = useState<number | null>(null);
  const [hoveredPiIdx, setHoveredPiIdx] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const getPointsCoords = (points: number[], w = W, h = H) => {
    if (!points || points.length < 2) return [];
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    
    return points.map((val, i) => {
      const x = PADDING_X + (i / (points.length - 1)) * (w - PADDING_X * 2);
      const y = h - PADDING_Y - ((val - min) / range) * (h - PADDING_Y * 2);
      return { x, y, val };
    });
  };

  const getPathFromCoords = (coords: { x: number; y: number }[]) => {
    if (coords.length < 2) return '';
    return coords.reduce((acc, coord, i) => {
      return `${acc} ${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`;
    }, '');
  };

  const getAreaPathFromCoords = (coords: { x: number; y: number }[], h = H) => {
    const linePath = getPathFromCoords(coords);
    if (!linePath) return '';
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    return `${linePath} L ${lastX} ${h - 5} L ${firstX} ${h - 5} Z`;
  };

  const wqiSeries = history.map(h => h.wqi || 80);
  const piSeries = history.map(h => h.pi || 1.2);
  const lastWqi = wqiSeries[wqiSeries.length - 1] ?? null;
  const lastPi = piSeries[piSeries.length - 1] ?? null;

  const wqiCoords = getPointsCoords(wqiSeries);
  const piCoords = getPointsCoords(piSeries);

  const handleMouseMove = (
    e: React.MouseEvent<SVGSVGElement>, 
    coords: { x: number; y: number }[], 
    setHoverIdx: (idx: number | null) => void
  ) => {
    if (coords.length < 2) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const pct = clientX / rect.width;
    
    // Find closest coordinate based on X distance
    let closestIdx = 0;
    let minDistance = Infinity;
    
    coords.forEach((coord, index) => {
      const coordPct = coord.x / W;
      const dist = Math.abs(coordPct - pct);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = index;
      }
    });

    setHoverIdx(closestIdx);
  };

  const content = (
    <>
      
      {/* Title */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f2fe]" />
          <div>
            <h2 className="text-sm font-display font-bold text-slate-200 uppercase tracking-[0.2em]">Water Quality Trend Chart</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Historical comparison of overall water safety vs pollution levels.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-300/90 bg-abyss-900/80 px-3 py-1 rounded-xl border border-cyan-500/20 shadow-inner">
            Station: <span className="font-bold text-cyan-300">{activeNodeId}</span>
          </span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white border border-transparent hover:border-white/20"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sparks Grid */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full periyar-glass-card rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(0,242,254,0.12)] hover:border-white/20 cursor-default group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-display font-bold text-slate-300 uppercase tracking-[0.2em]">Water Quality Index (WQI)</p>
              <p className="text-3xl font-display font-extrabold text-cyan-300 mt-1 tabular-nums drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">
                {lastWqi !== null ? lastWqi.toFixed(1) : <span className="text-slate-600">--</span>}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-cyan-300/80 bg-abyss-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/20 flex items-center gap-1.5 font-bold shadow-inner">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {wqiSeries.length} points
              </span>
            </div>
          </div>

          {wqiSeries.length >= 2 ? (
            <div className="relative pt-2 flex-1 min-h-[128px]">
              <svg 
                viewBox={`0 0 ${W} ${H}`} 
                className="w-full h-full overflow-visible cursor-crosshair"
                onMouseMove={(e) => handleMouseMove(e, wqiCoords, setHoveredWqiIdx)}
                onMouseLeave={() => setHoveredWqiIdx(null)}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="wqiChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Filled Gradient Underlay */}
                <path d={getAreaPathFromCoords(wqiCoords, H)} fill="url(#wqiChartGrad)" />

                {/* Core Sparkline */}
                <motion.path 
                  d={getPathFromCoords(wqiCoords)} 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />

                {/* Pulsing Live Ticker Point at the end */}
                {wqiCoords.length > 0 && (
                  <g>
                    <circle 
                      cx={wqiCoords[wqiCoords.length - 1].x} 
                      cy={wqiCoords[wqiCoords.length - 1].y} 
                      r="6" 
                      fill="#10b981" 
                      className="animate-pulse" 
                      opacity="0.6"
                    />
                    <circle 
                      cx={wqiCoords[wqiCoords.length - 1].x} 
                      cy={wqiCoords[wqiCoords.length - 1].y} 
                      r="3" 
                      fill="#10b981" 
                    />
                  </g>
                )}

                {/* Hover line and circles indicators */}
                {hoveredWqiIdx !== null && wqiCoords[hoveredWqiIdx] && (
                  <g>
                    {/* Vertical guideline */}
                    <line 
                      x1={wqiCoords[hoveredWqiIdx].x} 
                      y1={0} 
                      x2={wqiCoords[hoveredWqiIdx].x} 
                      y2={H} 
                      stroke="rgba(255,255,255,0.15)" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                    />
                    {/* Outer glowing point */}
                    <circle 
                      cx={wqiCoords[hoveredWqiIdx].x} 
                      cy={wqiCoords[hoveredWqiIdx].y} 
                      r="7" 
                      fill="#10b981" 
                      opacity="0.3" 
                    />
                    {/* Core point */}
                    <circle 
                      cx={wqiCoords[hoveredWqiIdx].x} 
                      cy={wqiCoords[hoveredWqiIdx].y} 
                      r="4" 
                      fill="#10b981" 
                      stroke="#030712"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </svg>

              {/* Tooltip Card Overlay */}
              {hoveredWqiIdx !== null && history[hoveredWqiIdx] && (
                <div 
                  className="absolute top-10 pointer-events-none z-30 transition-all duration-150"
                  style={{
                    left: `${(wqiCoords[hoveredWqiIdx].x / W) * 100}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] shadow-2xl text-xs font-mono whitespace-nowrap">
                    <p className="text-slate-400 font-bold">WQI: <span className="text-emerald-400">{history[hoveredWqiIdx].wqi}</span></p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{history[hoveredWqiIdx].time}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-500 font-mono text-xs">
              Awaiting telemetry history...
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full periyar-glass-card rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(0,242,254,0.12)] hover:border-white/20 cursor-default group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Pollution Level</p>
              <p className="text-3xl font-extrabold font-mono text-rose-450 mt-1.5 tabular-nums">
                {lastPi !== null ? lastPi.toFixed(2) : <span className="text-slate-655">--</span>}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.06] flex items-center gap-1.5 font-bold">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                Nemerow Max
              </span>
            </div>
          </div>

          {piSeries.length >= 2 ? (
            <div className="relative pt-2 flex-1 min-h-[128px]">
              <svg 
                viewBox={`0 0 ${W} ${H}`} 
                className="w-full h-full overflow-visible cursor-crosshair"
                onMouseMove={(e) => handleMouseMove(e, piCoords, setHoveredPiIdx)}
                onMouseLeave={() => setHoveredPiIdx(null)}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="piChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Filled Gradient Underlay */}
                <path d={getAreaPathFromCoords(piCoords, H)} fill="url(#piChartGrad)" />

                {/* Core Sparkline */}
                <motion.path 
                  d={getPathFromCoords(piCoords)} 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />

                {/* Pulsing Live Ticker Point at the end */}
                {piCoords.length > 0 && (
                  <g>
                    <circle 
                      cx={piCoords[piCoords.length - 1].x} 
                      cy={piCoords[piCoords.length - 1].y} 
                      r="6" 
                      fill="#f43f5e" 
                      className="animate-pulse" 
                      opacity="0.6"
                    />
                    <circle 
                      cx={piCoords[piCoords.length - 1].x} 
                      cy={piCoords[piCoords.length - 1].y} 
                      r="3" 
                      fill="#f43f5e" 
                    />
                  </g>
                )}

                {/* Hover guideline */}
                {hoveredPiIdx !== null && piCoords[hoveredPiIdx] && (
                  <g>
                    <line 
                      x1={piCoords[hoveredPiIdx].x} 
                      y1={0} 
                      x2={piCoords[hoveredPiIdx].x} 
                      y2={H} 
                      stroke="rgba(255,255,255,0.15)" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                    />
                    <circle 
                      cx={piCoords[hoveredPiIdx].x} 
                      cy={piCoords[hoveredPiIdx].y} 
                      r="7" 
                      fill="#f43f5e" 
                      opacity="0.3" 
                    />
                    <circle 
                      cx={piCoords[hoveredPiIdx].x} 
                      cy={piCoords[hoveredPiIdx].y} 
                      r="4" 
                      fill="#f43f5e" 
                      stroke="#030712"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </svg>

              {/* Tooltip Card Overlay */}
              {hoveredPiIdx !== null && history[hoveredPiIdx] && (
                <div 
                  className="absolute top-10 pointer-events-none z-30 transition-all duration-150"
                  style={{
                    left: `${(piCoords[hoveredPiIdx].x / W) * 100}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] shadow-2xl text-xs font-mono whitespace-nowrap">
                    <p className="text-slate-400 font-bold">PI: <span className="text-rose-400">{history[hoveredPiIdx].pi.toFixed(2)}</span></p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{history[hoveredPiIdx].time}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-500 font-mono text-xs">
              Awaiting telemetry history...
            </div>
          )}
        </motion.div>

      </div>
    </>
  );

  const baseView = (
    <div className="periyar-glass-card flex flex-col h-full p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(0,242,254,0.12)] hover:border-white/20 cursor-default group overflow-hidden">
      <div className="glint" />
      <div className="parallax-inner flex flex-col h-full space-y-4 w-full">
        {content}
      </div>
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
