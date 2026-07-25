import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { LatestTelemetryResponse, SimulationMode } from '../types/telemetry';
import { fetchLatestTelemetry, setSimulationMode as apiSetSimulationMode, setManualOverride as apiSetManualOverride } from '../api/telemetryService';

interface TelemetryContextType {
  data: LatestTelemetryResponse | null;
  loading: boolean;
  error: string | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  activeMode: SimulationMode;
  changeMode: (mode: SimulationMode) => Promise<void>;
  applyOverride: (nodeId: string, readings: Record<string, number>) => Promise<void>;
  refreshTelemetry: () => Promise<void>;
  nodeHistoryMap: Record<string, any[]>;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<LatestTelemetryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<SimulationMode>('HISTORICAL_REPLAY');
  const [nodeHistoryMap, setNodeHistoryMap] = useState<Record<string, any[]>>({});

  const refreshTelemetry = useCallback(async () => {
    try {
      const res = await fetchLatestTelemetry();
      setData(res);
      setActiveMode(res.mode);
      setError(null);

      const timestamp = new Date().toLocaleTimeString();
      setNodeHistoryMap(prev => {
        const nextMap = { ...prev };
        if (res.evaluation && res.evaluation.nodes) {
          Object.entries(res.evaluation.nodes).forEach(([nodeId, evalData]) => {
            const currentHistory = nextMap[nodeId] || [];
            const newPoint = {
              time: timestamp,
              wqi: evalData.water_quality_index,
              pi: evalData.pollution_index,
              status: evalData.status,
            };
            const updated = [...currentHistory, newPoint].slice(-20);
            nextMap[nodeId] = updated;
          });
        }
        return nextMap;
      });
    } catch (err: any) {
      console.warn("Backend poll error (retrying in 5s):", err);
      setError("Connecting to AquaSentinel Flask API...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTelemetry();
    const interval = setInterval(refreshTelemetry, 5000);
    return () => clearInterval(interval);
  }, [refreshTelemetry]);

  const changeMode = async (mode: SimulationMode) => {
    try {
      await apiSetSimulationMode(mode);
      setActiveMode(mode);
      await refreshTelemetry();
    } catch (err: any) {
      console.error("Failed to change simulation mode:", err);
    }
  };

  const applyOverride = async (nodeId: string, readings: Record<string, number>) => {
    try {
      await apiSetManualOverride(nodeId, readings);
      setActiveMode('MANUAL_TESTING');
      await refreshTelemetry();
    } catch (err: any) {
      console.error("Failed to apply override:", err);
    }
  };

  return (
    <TelemetryContext.Provider value={{
      data,
      loading,
      error,
      selectedNodeId,
      setSelectedNodeId,
      activeMode,
      changeMode,
      applyOverride,
      refreshTelemetry,
      nodeHistoryMap,
    }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
