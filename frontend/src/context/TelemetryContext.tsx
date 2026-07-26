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

const createFallbackTelemetry = (): LatestTelemetryResponse => {
  const timestamp = new Date().toLocaleTimeString();
  const mockNodes: Record<string, any> = {
    NODE_BHT_01: {
      node_id: 'NODE_BHT_01',
      water_quality_index: 92.5,
      pollution_index: 0.18,
      cpcb_class: 'Class A',
      cpcb_description: 'Drinking water source without conventional treatment',
      status: 'HEALTHY',
      root_cause: 'Nominal Baseline',
      primary_pollutant: 'None',
      confidence: 99.2,
      forecast_30min_wqi: 92.5,
      forecast_30min_pi: 0.18,
      risk_trajectory: 'STABLE',
      downstream_impact: { next_target_station: 'NODE_NRM_02', distance_km: 24.5, estimated_arrival_hours: 17.5, plume_threat: 'LOW' },
      inference_time_ms: 3.2,
      suggested_action: 'MAINTAIN ROUTINE SURVEILLANCE',
      action_severity: 'LOW',
      readings: { ph: 7.3, do: 8.2, turbidity: 3.0, bod: 1.1, cod: 7.5, temp: 26.2, ec: 90 },
      console_logs: [{ timestamp, node_id: 'NODE_BHT_01', type: 'SUCCESS', message: 'Routine Telemetry Verified — WQI 92.5' }],
      timestamp
    },
    NODE_NRM_02: {
      node_id: 'NODE_NRM_02',
      water_quality_index: 88.0,
      pollution_index: 0.35,
      cpcb_class: 'Class A',
      cpcb_description: 'Drinking water source without conventional treatment',
      status: 'HEALTHY',
      root_cause: 'Nominal Baseline',
      primary_pollutant: 'None',
      confidence: 98.7,
      forecast_30min_wqi: 88.0,
      forecast_30min_pi: 0.35,
      risk_trajectory: 'STABLE',
      downstream_impact: { next_target_station: 'NODE_ALV_03', distance_km: 37.5, estimated_arrival_hours: 26.8, plume_threat: 'LOW' },
      inference_time_ms: 3.4,
      suggested_action: 'MAINTAIN ROUTINE SURVEILLANCE',
      action_severity: 'LOW',
      readings: { ph: 7.2, do: 8.0, turbidity: 3.5, bod: 1.3, cod: 9.5, temp: 26.8, ec: 105 },
      console_logs: [{ timestamp, node_id: 'NODE_NRM_02', type: 'SUCCESS', message: 'Routine Telemetry Verified — WQI 88.0' }],
      timestamp
    },
    NODE_ALV_03: {
      node_id: 'NODE_ALV_03',
      water_quality_index: 84.5,
      pollution_index: 0.18,
      cpcb_class: 'Class A',
      cpcb_description: 'Drinking water source without conventional treatment',
      status: 'HEALTHY',
      root_cause: 'Nominal Baseline',
      primary_pollutant: 'None',
      confidence: 99.1,
      forecast_30min_wqi: 84.5,
      forecast_30min_pi: 0.18,
      risk_trajectory: 'STABLE',
      downstream_impact: { next_target_station: 'NODE_ELR_04', distance_km: 12.5, estimated_arrival_hours: 8.9, plume_threat: 'LOW' },
      inference_time_ms: 2.8,
      suggested_action: 'MAINTAIN ROUTINE SURVEILLANCE',
      action_severity: 'LOW',
      readings: { ph: 7.2, do: 6.8, turbidity: 4.2, bod: 2.1, cod: 14.5, temp: 27.2, ec: 135 },
      console_logs: [{ timestamp, node_id: 'NODE_ALV_03', type: 'SUCCESS', message: 'Routine Telemetry Verified — WQI 84.5' }],
      timestamp
    },
    NODE_ELR_04: {
      node_id: 'NODE_ELR_04',
      water_quality_index: 74.0,
      pollution_index: 1.15,
      cpcb_class: 'Class C',
      cpcb_description: 'Drinking water source after conventional treatment',
      status: 'WARNING',
      root_cause: 'Elevated Industrial Load',
      primary_pollutant: 'COD',
      confidence: 97.8,
      forecast_30min_wqi: 74.0,
      forecast_30min_pi: 1.15,
      risk_trajectory: 'STABLE',
      downstream_impact: { next_target_station: 'NODE_KCH_05', distance_km: 13.5, estimated_arrival_hours: 9.6, plume_threat: 'MODERATE' },
      inference_time_ms: 4.1,
      suggested_action: 'INCREASE SAMPLING FREQUENCY',
      action_severity: 'MEDIUM',
      readings: { ph: 6.8, do: 5.8, turbidity: 11.0, bod: 4.2, cod: 31.0, temp: 28.2, ec: 360 },
      console_logs: [{ timestamp, node_id: 'NODE_ELR_04', type: 'WARNING', message: 'Elevated COD at Eloor Station' }],
      timestamp
    },
    NODE_KCH_05: {
      node_id: 'NODE_KCH_05',
      water_quality_index: 71.5,
      pollution_index: 1.25,
      cpcb_class: 'Class C',
      cpcb_description: 'Estuarine Tidal Mixing Zone',
      status: 'HEALTHY',
      root_cause: 'Tidal Salinity Influence',
      primary_pollutant: 'EC / Salinity',
      confidence: 98.4,
      forecast_30min_wqi: 71.5,
      forecast_30min_pi: 1.25,
      risk_trajectory: 'STABLE',
      downstream_impact: { next_target_station: 'Arabian Sea Estuary', distance_km: 0.0, estimated_arrival_hours: 0.0, plume_threat: 'DISPERSION_IN_OCEAN' },
      inference_time_ms: 3.5,
      suggested_action: 'MAINTAIN ESTUARINE SURVEILLANCE',
      action_severity: 'LOW',
      readings: { ph: 7.5, do: 5.9, turbidity: 14.0, bod: 4.0, cod: 27.0, temp: 28.8, ec: 1750 },
      console_logs: [{ timestamp, node_id: 'NODE_KCH_05', type: 'SUCCESS', message: 'Estuarine Salinity Verified' }],
      timestamp
    }
  };

  return {
    mode: 'HISTORICAL_REPLAY',
    tick: 1,
    evaluation: {
      agent_status: 'OFFLINE_SIMULATION_ACTIVE',
      agent_version: 'v3.0 Ultra-Cognitive Engine',
      uptime_seconds: 120,
      inferences_executed: 42,
      overall_status: 'HEALTHY',
      average_wqi: 84.5,
      max_pollution_index: 0.18,
      critical_node_count: 0,
      warning_node_count: 1,
      basin_summary: 'All 5 Periyar River stations reporting baseline parameters.',
      nodes: mockNodes,
      system_logs: [
        { timestamp, node_id: 'NODE_ALV_03', type: 'INFO', message: 'Connecting to live Flask API on Render...' },
        { timestamp, node_id: 'NODE_BHT_01', type: 'SUCCESS', message: 'Baseline Telemetry Loaded' }
      ]
    }
  };
};

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
      setData(prev => prev || createFallbackTelemetry());
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
