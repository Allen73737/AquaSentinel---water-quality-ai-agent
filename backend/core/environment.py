"""
Periyar River Hydro-Environmental Simulation Engine.
Manages physical river station states, pollutant dispersion, historical dataset replay,
and simulation mode transitions for the 5 Periyar River monitoring nodes.
"""

import time
import math
import random
from typing import Dict, Any, List
from core.datasets import STATION_METADATA, HISTORICAL_PERIYAR_DATASET


class PeriyarRiverEnvironment:
    """
    Simulates physical water quality dynamics along the 88km main stem of the Periyar River.
    """
    MODES = [
        "HISTORICAL_REPLAY",
        "NORMAL_CONDITIONS",
        "INDUSTRIAL_DISCHARGE",
        "HEAVY_RAINFALL",
        "MANUAL_TESTING",
        "DEVELOPER_MODE"
    ]

    def __init__(self, mode: str = "HISTORICAL_REPLAY"):
        self.mode = mode if mode in self.MODES else "HISTORICAL_REPLAY"
        self.replay_index = 0
        self.tick_count = 0
        self.manual_overrides: Dict[str, Dict[str, float]] = {}
        
        # Buffer to keep historical telemetry history per node (for sparklines/charts)
        self.history_buffers: Dict[str, List[Dict[str, Any]]] = {
            node_id: [] for node_id in STATION_METADATA.keys()
        }
        
        # Initialize initial node states
        self.current_state = self._generate_initial_state()
        self._record_history()

    def _generate_initial_state(self) -> Dict[str, Dict[str, Any]]:
        initial_packet = HISTORICAL_PERIYAR_DATASET[0]["readings"]
        state = {}
        for node_id, meta in STATION_METADATA.items():
            base_readings = initial_packet.get(node_id, {
                "ph": 7.0, "do": 7.0, "turbidity": 5.0, "bod": 2.0, "cod": 15.0, "temp": 27.0, "ec": 150
            })
            state[node_id] = {
                "metadata": meta,
                "readings": dict(base_readings)
            }
        return state

    def set_simulation_mode(self, mode: str) -> bool:
        if mode in self.MODES:
            self.mode = mode
            if mode == "HISTORICAL_REPLAY":
                self.replay_index = 0
            return True
        return False

    def apply_manual_override(self, node_id: str, sensor_updates: Dict[str, float]) -> bool:
        if node_id in STATION_METADATA:
            if node_id not in self.manual_overrides:
                self.manual_overrides[node_id] = {}
            self.manual_overrides[node_id].update(sensor_updates)
            self.mode = "MANUAL_TESTING"
            return True
        return False

    def clear_manual_overrides(self):
        self.manual_overrides.clear()

    def tick(self) -> Dict[str, Dict[str, Any]]:
        """
        Advances the river simulation by one clock tick (5-second intervals).
        """
        self.tick_count += 1
        
        if self.mode == "HISTORICAL_REPLAY":
            self._tick_historical_replay()
        elif self.mode == "NORMAL_CONDITIONS":
            self._tick_normal_conditions()
        elif self.mode == "INDUSTRIAL_DISCHARGE":
            self._tick_industrial_discharge()
        elif self.mode == "HEAVY_RAINFALL":
            self._tick_heavy_rainfall()
        elif self.mode == "MANUAL_TESTING":
            self._tick_manual_testing()
        elif self.mode == "DEVELOPER_MODE":
            self._tick_developer_mode()
            
        self._record_history()
        return self.current_state

    def _tick_historical_replay(self):
        dataset_len = len(HISTORICAL_PERIYAR_DATASET)
        packet = HISTORICAL_PERIYAR_DATASET[self.replay_index % dataset_len]
        readings_map = packet["readings"]
        
        for node_id in STATION_METADATA:
            if node_id in readings_map:
                # Add micro-jitter for organic realistic flow
                base = readings_map[node_id]
                self.current_state[node_id]["readings"] = {
                    "ph": round(base["ph"] + random.uniform(-0.05, 0.05), 2),
                    "do": round(max(0.5, base["do"] + random.uniform(-0.1, 0.1)), 2),
                    "turbidity": round(max(0.5, base["turbidity"] + random.uniform(-0.3, 0.3)), 2),
                    "bod": round(max(0.5, base["bod"] + random.uniform(-0.1, 0.1)), 2),
                    "cod": round(max(2.0, base["cod"] + random.uniform(-0.5, 0.5)), 2),
                    "temp": round(base["temp"] + random.uniform(-0.1, 0.1), 1),
                    "ec": int(base["ec"] + random.randint(-5, 5))
                }
        self.replay_index = (self.replay_index + 1) % dataset_len

    def _tick_normal_conditions(self):
        t = self.tick_count * 0.1
        # Baseline pristine parameters for Periyar river
        baselines = {
            "NODE_BHT_01": {"ph": 7.3, "do": 8.2, "turbidity": 3.0, "bod": 1.1, "cod": 7.5, "temp": 26.2, "ec": 90},
            "NODE_NRM_02": {"ph": 7.2, "do": 8.0, "turbidity": 3.5, "bod": 1.3, "cod": 9.5, "temp": 26.8, "ec": 105},
            "NODE_ALV_03": {"ph": 7.0, "do": 7.3, "turbidity": 5.5, "bod": 2.0, "cod": 15.0, "temp": 27.4, "ec": 140},
            "NODE_ELR_04": {"ph": 6.8, "do": 6.1, "turbidity": 12.0, "bod": 4.5, "cod": 32.0, "temp": 28.5, "ec": 380},
            "NODE_KCH_05": {"ph": 7.5, "do": 5.9, "turbidity": 14.0, "bod": 4.2, "cod": 28.0, "temp": 28.8, "ec": 1800}
        }
        for node_id, base in baselines.items():
            sine = math.sin(t + hash(node_id) % 10)
            self.current_state[node_id]["readings"] = {
                "ph": round(base["ph"] + sine * 0.08, 2),
                "do": round(base["do"] + sine * 0.15, 2),
                "turbidity": round(max(1.0, base["turbidity"] + sine * 0.4), 2),
                "bod": round(max(0.5, base["bod"] + sine * 0.1), 2),
                "cod": round(max(2.0, base["cod"] + sine * 0.8), 2),
                "temp": round(base["temp"] + sine * 0.2, 1),
                "ec": int(base["ec"] + sine * 10)
            }

    def _tick_industrial_discharge(self):
        # Simulates chemical effluent dump at Eloor (NODE_ELR_04) flowing to Kochi (NODE_KCH_05)
        self._tick_normal_conditions()
        cycle_phase = (self.tick_count % 30) / 30.0  # 30 tick cycle wave
        intensity = math.sin(cycle_phase * math.pi)

        # Severe contamination at Eloor
        elr_readings = self.current_state["NODE_ELR_04"]["readings"]
        elr_readings["ph"] = round(max(3.8, 6.8 - intensity * 2.5), 2)
        elr_readings["do"] = round(max(0.8, 6.1 - intensity * 4.8), 2)
        elr_readings["turbidity"] = round(12.0 + intensity * 65.0, 2)
        elr_readings["bod"] = round(4.5 + intensity * 22.0, 2)
        elr_readings["cod"] = round(32.0 + intensity * 140.0, 2)
        elr_readings["temp"] = round(28.5 + intensity * 4.2, 1)
        elr_readings["ec"] = int(380 + intensity * 850)

        # Downstream lag dispersion at Kochi
        kch_readings = self.current_state["NODE_KCH_05"]["readings"]
        kch_readings["do"] = round(max(2.1, 5.9 - intensity * 2.8), 2)
        kch_readings["turbidity"] = round(14.0 + intensity * 35.0, 2)
        kch_readings["bod"] = round(4.2 + intensity * 11.5, 2)
        kch_readings["cod"] = round(28.0 + intensity * 65.0, 2)

    def _tick_heavy_rainfall(self):
        # High turbidity & dilution starting upstream (Bhoothathankettu & Neriamangalam)
        self._tick_normal_conditions()
        surge = math.sin((self.tick_count % 20) / 20.0 * math.pi) * 1.5
        
        for node_id in ["NODE_BHT_01", "NODE_NRM_02", "NODE_ALV_03"]:
            r = self.current_state[node_id]["readings"]
            r["turbidity"] = round(r["turbidity"] + surge * 35.0, 2)
            r["do"] = round(min(9.5, r["do"] + surge * 0.8), 2)
            r["bod"] = round(max(0.8, r["bod"] - surge * 0.3), 2)
            r["ec"] = int(max(40, r["ec"] - surge * 30))

    def _tick_manual_testing(self):
        self._tick_normal_conditions()
        for node_id, overrides in self.manual_overrides.items():
            if node_id in self.current_state:
                self.current_state[node_id]["readings"].update(overrides)

    def _tick_developer_mode(self):
        # Random chaotic oscillations to verify AI robustness across edge cases
        for node_id in STATION_METADATA:
            self.current_state[node_id]["readings"] = {
                "ph": round(random.uniform(4.0, 9.5), 2),
                "do": round(random.uniform(0.5, 10.0), 2),
                "turbidity": round(random.uniform(1.0, 100.0), 2),
                "bod": round(random.uniform(0.5, 35.0), 2),
                "cod": round(random.uniform(5.0, 200.0), 2),
                "temp": round(random.uniform(24.0, 36.0), 1),
                "ec": random.randint(50, 3000)
            }

    def _record_history(self):
        timestamp = time.strftime("%H:%M:%S")
        for node_id, data in self.current_state.items():
            entry = {
                "time": timestamp,
                "tick": self.tick_count,
                **data["readings"]
            }
            buf = self.history_buffers[node_id]
            buf.append(entry)
            if len(buf) > 30:
                buf.pop(0)

    def get_node_history(self, node_id: str) -> List[Dict[str, Any]]:
        return self.history_buffers.get(node_id, [])
