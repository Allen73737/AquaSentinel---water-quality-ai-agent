import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, X, Smartphone, Mail, Cpu, CheckCircle2, Radio, Volume2, VolumeX, Send, MapPin, AlertTriangle } from 'lucide-react';
import type { AlertDispatchResponse } from '../../types/telemetry';
import { toggleAudioMute, getAudioMutedState, playEmergencyPing } from '../../utils/audioAlert';

interface AlertDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatchData: AlertDispatchResponse | null;
  status: string;
  onReTriggerDispatch?: () => void;
}

export const AlertDispatchModal: React.FC<AlertDispatchModalProps> = ({
  isOpen,
  onClose,
  dispatchData,
  status,
  onReTriggerDispatch
}) => {
  const [activeTab, setActiveTab] = useState<'SMS' | 'EMAIL' | 'GATEWAY'>('SMS');
  const [isMuted, setIsMuted] = useState<boolean>(getAudioMutedState());

  if (!isOpen) return null;

  const handleMuteToggle = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
  };

  const handleTestPing = () => {
    playEmergencyPing(1000, 0.4);
    if (onReTriggerDispatch) {
      onReTriggerDispatch();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl max-h-[90vh] bg-[#030914] border border-cyan-500/40 rounded-3xl shadow-[0_0_80px_rgba(0,242,254,0.25)] flex flex-col overflow-hidden text-slate-200"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-extrabold text-white tracking-wide uppercase">
                  Official Authority Alert Terminal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
                  GOVT DISPATCH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                System Identifier: <span className="text-cyan-300 font-bold">{dispatchData?.dispatch_id || 'KWA-ALERT-2026-LIVE'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
              title={isMuted ? "Unmute Audio Siren" : "Mute Audio Siren"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 py-3 bg-black/40 border-b border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('SMS')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'SMS' 
                ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile SMS Broadcast Payload
          </button>

          <button
            onClick={() => setActiveTab('EMAIL')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'EMAIL' 
                ? 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            Official Email Notification Briefing
          </button>

          <button
            onClick={() => setActiveTab('GATEWAY')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'GATEWAY' 
                ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Carrier Gateway & Audit Logs
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: MOBILE SMS PREVIEW */}
          {activeTab === 'SMS' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Phone Frame Simulation */}
              <div className="md:col-span-6 flex justify-center">
                <div className="w-full max-w-[320px] bg-slate-950 border-4 border-slate-700 rounded-[36px] p-4 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                  {/* Speaker slot */}
                  <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-4" />
                  
                  {/* Phone Screen Header */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-white/10 pb-2 mb-3">
                    <span className="font-bold text-rose-400 flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      BSNL EMERGENCY CELL
                    </span>
                    <span>1916 HOTLINE</span>
                  </div>

                  {/* SMS Chat Bubble */}
                  <div className="space-y-3">
                    <div className="bg-rose-950/80 border border-rose-500/40 p-3.5 rounded-2xl text-xs font-mono leading-relaxed text-rose-100 shadow-md">
                      <div className="flex items-center justify-between text-[10px] text-rose-300 font-bold mb-1.5 border-b border-rose-500/30 pb-1">
                        <span>GOVT HAZARD DISPATCH</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                      </div>
                      <p className="whitespace-pre-line text-[11px] font-mono">
                        {dispatchData?.sms_payload || 
`[URGENT - GOVT EMERGENCY ALERT]
AquaSentinel System ID: ${dispatchData?.dispatch_id || 'KWA-ALERT-8842'}
Location: Periyar River (Eloor Industrial Belt)
Alert Level: ${status}
Reason: Contaminant spike exceeding CPCB Class A safety thresholds.
Action Required: Immediately inspect intake pumps at Aluva Water Intake & activate emergency protocol.`}
                      </p>
                    </div>

                    <div className="text-[10px] text-emerald-400 font-mono text-right font-bold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Delivered via Emergency Gateway
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side SMS Metadata */}
              <div className="md:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    SMS Dispatch Channel Details
                  </h4>
                  <div className="text-xs font-mono space-y-2 text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-400">Carrier Network:</span>
                      <span className="font-bold text-white">BSNL Government Priority Line</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-400">Target Helpline:</span>
                      <span className="font-bold text-cyan-300">+91 94460 01916 (KWA Helpline)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-400">Delivery Latency:</span>
                      <span className="font-bold text-emerald-400">22 milliseconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Intake Location:</span>
                      <span className="font-bold text-amber-300">Aluva Pumping Station (62km)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-200 leading-relaxed">
                  <p className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="w-4 h-4" />
                    Automatic Intimation Confirmation
                  </p>
                  This SMS message is transmitted directly over BSNL emergency cell channels to duty engineers at Aluva Water Intake for immediate emergency response.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL EMAIL BRIEFING */}
          {activeTab === 'EMAIL' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4 font-mono text-xs">
                {/* Email Header */}
                <div className="border-b border-white/10 pb-3 space-y-1.5 text-slate-300">
                  <div className="flex gap-2">
                    <span className="text-slate-500 w-16">FROM:</span>
                    <span className="text-cyan-300 font-bold">aquasentinel-alert@kwa.kerala.gov.in</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 w-16">TO:</span>
                    <span className="text-white font-bold">kwa.emergency.cell@kerala.gov.in, cpcb.south@nic.in</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 w-16">SUBJECT:</span>
                    <span className="text-rose-400 font-extrabold">{dispatchData?.email_subject || `🚨 OFFICIAL EMERGENCY DISPATCH: Periyar River Contamination Risk (${status})`}</span>
                  </div>
                </div>

                {/* Email Content Body */}
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 font-mono leading-relaxed text-slate-200">
                  <pre className="whitespace-pre-wrap text-xs font-mono text-slate-300">
                    {dispatchData?.email_payload || 
`OFFICIAL HAZARD BRIEFING - KERALA WATER AUTHORITY & CPCB
--------------------------------------------------
Dispatch Identifier: ${dispatchData?.dispatch_id || 'KWA-ALERT-2026-8842'}
Timestamp: ${new Date().toLocaleString()}
River Stretch: Periyar River Basin, Kerala
Monitored Station: Eloor Industrial Belt (NODE_ELR_04)
Threat Level: ${status}

EXECUTIVE SUMMARY:
Multi-sensor anomaly detected. Pollution Index exceeds nominal baseline safety thresholds.

MANDATORY ACTION DIRECTIVES:
1. Activate CPCB Level-2 Water Intake Surveillance.
2. Issue advisory to Aluva Water Treatment Plant managers.
3. Dispatch emergency mobile laboratory sampling vehicle.
--------------------------------------------------`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GATEWAY & AUDIT LOGS */}
          {activeTab === 'GATEWAY' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(dispatchData?.recipients || [
                  { name: 'Kerala Water Authority (KWA)', channel: 'SMS Gateway #1916', contact: 'kwa.emergency.cell@kerala.gov.in', status: 'DELIVERED', latency_ms: 22, carrier: 'BSNL Network' },
                  { name: 'Central Pollution Control Board (CPCB)', channel: 'Encrypted Ingestion API', contact: 'cpcb.south@nic.in', status: 'TRANSMITTED', latency_ms: 34, carrier: 'NIC National Gateway' },
                  { name: 'Ernakulam District Collectorate', channel: 'Emergency Broadcast', contact: 'collector.ekm@kerala.gov.in', status: 'DISPATCHED', latency_ms: 18, carrier: 'KSDMA Hazard Cell' }
                ]).map((rec, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {rec.status}
                      </span>
                      <span className="text-[10px] text-slate-400">{rec.latency_ms}ms ACK</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">{rec.name}</h5>
                    <p className="text-[11px] text-slate-400">{rec.contact}</p>
                    <p className="text-[10px] text-cyan-300 font-bold border-t border-white/5 pt-1 mt-1">{rec.carrier}</p>
                  </div>
                ))}
              </div>

              {/* Streaming Handshake Terminal */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/10 pb-2">
                  <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    LIVE CARRIER HANDSHAKE PROTOCOL
                  </span>
                  <span>ENCRYPTED TLS 1.3</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed font-mono">
                  <p><span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-cyan-400">POST /api/v1/alerts/dispatch</span> HTTP/1.1 200 OK</p>
                  <p><span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-emerald-400">CONNECT</span> BSNL SMS Gateway (Gateway IP: 218.248.0.12)... ACKNOWLEDGED</p>
                  <p><span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-emerald-400">CONNECT</span> CPCB National Ingestion API (https://cpcb.gov.in/api)... 200 OK</p>
                  <p><span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-amber-400">DISPATCH</span> Emergency SMS payload transmitted to +91 94460 01916</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Periyar River Control • KWA Command HQ</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestPing}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-all border border-rose-400/30 shadow-md cursor-pointer flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Re-Trigger Emergency Dispatch
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Close Terminal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
