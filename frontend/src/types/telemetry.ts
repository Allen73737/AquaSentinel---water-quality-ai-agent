export interface SensorReadings {
  ph: number;
  do: number;
  turbidity: number;
  bod: number;
  cod: number;
  temp: number;
  ec: number;
}

export interface NodeMetadata {
  id: string;
  name: string;
  district: string;
  category: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  river_km: number;
  description: string;
}

export interface ConsoleLogEntry {
  timestamp: string;
  node_id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT' | 'CRITICAL' | 'ACTION';
  message: string;
}

export interface ChainOfThoughtStep {
  step: string;
  detail: string;
}

export interface DownstreamImpact {
  next_target_station: string;
  distance_km?: number;
  estimated_arrival_hours: number;
  plume_threat: string;
}

export interface NodeEvaluation {
  node_id: string;
  water_quality_index: number;
  pollution_index: number;
  cpcb_class?: string;
  cpcb_description?: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  root_cause?: string;
  primary_pollutant?: string;
  confidence: number;
  confidence_breakdown?: Record<string, number>;
  forecast_30min_wqi?: number;
  forecast_30min_pi?: number;
  risk_trajectory?: 'STABLE' | 'IMPROVING' | 'DETERIORATING';
  downstream_impact?: DownstreamImpact;
  inference_time_ms: number;
  suggested_action: string;
  action_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  action_rationale?: string;
  chain_of_thought?: ChainOfThoughtStep[];
  console_logs: ConsoleLogEntry[];
  timestamp: string;
  readings?: SensorReadings;
}

export interface NodeTelemetry {
  metadata: NodeMetadata;
  readings: SensorReadings;
}

export interface BasinReasoningTreeNode {
  node_id: string;
  status: string;
  wqi: number;
  root_cause: string;
  steps: ChainOfThoughtStep[];
}

export interface BasinEvaluation {
  agent_status: string;
  agent_version?: string;
  uptime_seconds: number;
  inferences_executed: number;
  overall_status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  average_wqi: number;
  max_pollution_index: number;
  critical_node_count: number;
  warning_node_count: number;
  basin_summary?: string;
  nodes: Record<string, NodeEvaluation>;
  basin_reasoning_tree?: BasinReasoningTreeNode[];
  system_logs: ConsoleLogEntry[];
}

export interface LatestTelemetryResponse {
  mode: SimulationMode;
  tick: number;
  evaluation: BasinEvaluation;
  node_readings?: Record<string, SensorReadings>;
}

export type SimulationMode = 
  | 'HISTORICAL_REPLAY'
  | 'NORMAL_CONDITIONS'
  | 'INDUSTRIAL_DISCHARGE'
  | 'HEAVY_RAINFALL'
  | 'MANUAL_TESTING'
  | 'DEVELOPER_MODE';

export interface HistoricalReadingEntry extends SensorReadings {
  time: string;
  tick: number;
}

export interface AgentQueryResult {
  query: string;
  answer: string;
  overall_status: string;
  reasoning_steps: string[];
  confidence: number;
  timestamp: string;
}

export interface AlertRecipient {
  name: string;
  channel: string;
  contact: string;
  status: 'DELIVERED' | 'TRANSMITTED' | 'DISPATCHED' | 'QUEUED';
  latency_ms: number;
  carrier: string;
}

export interface AlertDispatchPayload {
  node_id?: string;
  urgency?: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  reason?: string;
}

export interface AlertDispatchResponse {
  success: boolean;
  dispatch_id: string;
  timestamp: string;
  urgency: string;
  station_id: string;
  sms_payload: string;
  email_subject: string;
  email_payload: string;
  recipients: AlertRecipient[];
  delivery_acknowledged: boolean;
}
