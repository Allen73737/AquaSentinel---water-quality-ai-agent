import type { LatestTelemetryResponse, SimulationMode, HistoricalReadingEntry } from '../types/telemetry';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function fetchLatestTelemetry(): Promise<LatestTelemetryResponse> {
  const response = await fetch(`${API_BASE_URL}/telemetry/latest`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export async function setSimulationMode(mode: SimulationMode): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/simulation/mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode }),
  });
  if (!response.ok) {
    throw new Error(`Failed to change mode to ${mode}`);
  }
}

export async function setManualOverride(nodeId: string, readings: Record<string, number>): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/simulation/override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ node_id: nodeId, readings }),
  });
  if (!response.ok) {
    throw new Error(`Failed to set override for ${nodeId}`);
  }
}

export async function fetchNodeHistory(nodeId: string): Promise<HistoricalReadingEntry[]> {
  const response = await fetch(`${API_BASE_URL}/nodes/${nodeId}/history`);
  if (!response.ok) {
    throw new Error(`Failed to fetch history for ${nodeId}`);
  }
  const data = await response.json();
  return data.history || [];
}

export async function dispatchEmergencyAlert(payload: { node_id?: string; urgency?: string; reason?: string }) {
  const response = await fetch(`${API_BASE_URL}/alerts/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to execute alert dispatch');
  }
  return response.json();
}
