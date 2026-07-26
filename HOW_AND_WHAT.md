# AquaSentinel: Complete Technical, Algorithmic & Architectural Guide (`HOW_AND_WHAT.md`)

Welcome to the definitive internal and external technical documentation for **AquaSentinel** — an autonomous, multi-agent hydro-environmental intelligence system designed for real-time telemetry monitoring, chemical anomaly detection, predictive risk modeling, and statutory compliance enforcement across river basins.

---

## 📸 Executive Visual Overview

### 1. Main System Dashboard UI
![AquaSentinel Dashboard UI](docs/images/dashboard_ui.png)
*The primary Glassmorphism HUD interface displaying live telemetry, river network topologies, Water Quality Index (WQI) gauges, and multi-sensor sparklines.*

### 2. Cognitive AI Reasoning & CoT Terminal
![AquaSentinel AI Console](docs/images/ai_console.png)
*The autonomous AI agent console showing live step-by-step Chain-of-Thought (CoT) diagnostic steps, CPCB statutory compliance scoring, and automated alert dispatch.*

---

## 📍 1. What is AquaSentinel?

AquaSentinel is an end-to-end AI-powered environmental monitoring platform specifically configured for the **88 km main stem of the Periyar River Basin in Kerala, India** (from the headworks at Bhoothathankettu Dam to the industrial belt at Eloor and the Cochin Estuary mouth).

The system continuously ingests 7 core hydro-chemical parameters from 5 strategic river monitoring nodes, runs multi-variate statistical and thermodynamic diagnostic algorithms, forecasts downstream contaminant plumes, and recommends immediate statutory remediation actions.

---

## 🏗️ 2. System Architecture & Telemetry Pipeline

AquaSentinel utilizes a decoupled, micro-service architecture comprising a **High-Performance React/Vite Frontend** and a **Python/Flask Cognitive AI Backend**.

```
[ Sensor Telemetry Stream / Hydro Engine ]
                  │
                  ▼
   ┌─────────────────────────────┐
   │  Periyar River Simulation   │ ── (6 Simulation Modes & Micro-Jitter)
   └──────────────┬──────────────┘
                  │
                  ▼
   ┌─────────────────────────────┐
   │  AquaSentinel AI Agent      │ ── (WQI, Nemerow PI, Covariance, CoT, Forecast)
   └──────────────┬──────────────┘
                  │
                  ▼
   ┌─────────────────────────────┐
   │   Flask REST API Server     │ ── (CORS, Endpoints on Port 5000/Render)
   └──────────────┬──────────────┘
                  │  HTTP / JSON (5-second polling interval)
                  ▼
   ┌─────────────────────────────┐
   │  React Telemetry Context    │ ── (Global State Management)
   └──────────────┬──────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Glassmorphic HUD Frontend                  │
│ ┌───────────────┐ ┌───────────────┐ ┌─────────────────┐ │
│ │  StationMap   │ │ NodeInfoPanel │ │    AiConsole    │ │
│ └───────────────┘ └───────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Key API Endpoint Specifications (`backend/app.py` & `backend/api/routes.py`)

* `GET /api/v1/telemetry/latest`: Fetches active status across all 5 nodes, current WQI, Nemerow PI, CPCB grades, and recent system log streams.
* `POST /api/v1/agent/query`: Accepts natural language queries (e.g., *"Is Aluva water safe to drink?"* or *"What is the threat at Eloor?"*) and returns step-by-step CoT reasoning steps.
* `POST /api/v1/agent/remediate`: Triggers physical simulation interventions (e.g., Aeration Barges, Calcium Carbonate Buffer, Sluice Gate Flush).
* `POST /api/v1/simulation/mode`: Changes physical simulation modes (`HISTORICAL_REPLAY`, `INDUSTRIAL_DISCHARGE`, etc.).
* `GET /api/v1/nodes/<node_id>/history`: Returns 30-tick historical telemetry arrays for sparklines and rate-of-change math.

---

## 🌊 3. Periyar River Monitoring Stations

The river network is modeled along 5 critical stations:

| Node ID | Station Name | River Location | Primary Significance & Environmental Risk |
| :--- | :--- | :--- | :--- |
| **`NODE_BHT_01`** | **Bhoothathankettu Dam** | River km 0.0 | **Headworks Baseline**: High DO, pristine upstream forest runoff. |
| **`NODE_NRM_02`** | **Neriamangalam Bridge** | River km 24.5 | **Agricultural Stem**: Pesticide/fertilizer runoff & turbidity spikes. |
| **`NODE_ALV_03`** | **Aluva Water Intake** | River km 62.0 | **Municipal Drinking Water**: Abstraction point for Kerala Water Authority (KWA). |
| **`NODE_ELR_04`** | **Eloor Industrial Belt** | River km 74.5 | **Heavy Chemical Zone**: Concentrated industrial effluents (FACT, TCC, acidic/COD leaks). |
| **`NODE_KCH_05`** | **Cochin Estuary** | River km 88.0 | **Tidal Mouth**: Estuarine salinity/EC mixing, final ocean discharge. |

---

## 🧠 4. How the AI Agent Works (Algorithms & Mathematics)

The core brain of AquaSentinel resides in `backend/core/ai_agent.py` (`AquaSentinelAgent` class). It combines statutory standards, empirical thermodynamics, and multi-variate statistical modeling.

### 4.1 Water Quality Index (WQI) Algorithm

The Water Quality Index ($WQI$) aggregates 6 weighted sub-indices into a single unified health score from **0.0 (Extremely Hazardous)** to **100.0 (Pristine)**:

$$WQI = \sum_{i=1}^{n} w_i \cdot q_i$$

Where:
* $w_{\text{pH}} = 0.15$
* $w_{\text{DO}} = 0.25$
* $w_{\text{turbidity}} = 0.15$
* $w_{\text{BOD}} = 0.20$
* $w_{\text{COD}} = 0.15$
* $w_{\text{EC}} = 0.10$

#### Sub-Index Curves ($q_i$):
* **pH Sub-Index ($q_{\text{pH}}$)**:
  $$q_{\text{pH}} = \begin{cases} 100 - |\text{pH} - 7.5| \times 10 & 6.5 \le \text{pH} \le 8.5 \\ \max(0, 100 - (6.5 - \text{pH}) \times 40) & \text{pH} < 6.5 \\ \max(0, 100 - (\text{pH} - 8.5) \times 45) & \text{pH} > 8.5 \end{cases}$$
* **Dissolved Oxygen Sub-Index ($q_{\text{DO}}$)**:
  $$q_{\text{DO}} = \min\left(100, \frac{\text{DO}}{6.0} \times 100\right)$$
* **Turbidity Sub-Index ($q_{\text{turb}}$)**:
  $$q_{\text{turb}} = \max(0, 100 - (\text{Turbidity} - 5.0) \times 3.0) \quad \text{if Turbidity } > 5.0 \text{ else } 100$$
* **BOD Sub-Index ($q_{\text{BOD}}$)**:
  $$q_{\text{BOD}} = \max(0, 100 - (\text{BOD} - 2.0) \times 7.5) \quad \text{if BOD } > 2.0 \text{ else } 100$$
* **COD Sub-Index ($q_{\text{COD}}$)**:
  $$q_{\text{COD}} = \max(0, 100 - (\text{COD} - 15.0) \times 1.5) \quad \text{if COD } > 15.0 \text{ else } 100$$

---

### 4.2 Nemerow Pollution Index (PI) Algorithm

While WQI gives an overall average, the **Nemerow Pollution Index ($PI$)** highlights extreme localized single-parameter spikes (preventing severe toxic spills from being masked by good ratings in other parameters):

$$PI = \sqrt{\frac{R_{\max}^2 + R_{\text{avg}}^2}{2}}$$

Where $R_i$ represents the relative pollution ratio of parameter $i$ compared to statutory safety limits:
* $PI < 1.0$: Clean / Nominal
* $1.0 \le PI \le 2.5$: Moderate Pollution
* $PI > 2.5$: Severe Environmental Hazard

---

### 4.3 CPCB Statutory Surface Water Grading Rules

AquaSentinel maps readings directly to the **Central Pollution Control Board (CPCB)** India Statutory Classification:

* **Class A**: $WQI \ge 88.0$, $\text{DO} \ge 6.0\text{ mg/L}$, $\text{BOD} \le 2.0\text{ mg/L}$ $\rightarrow$ *Drinking water source without conventional treatment*.
* **Class B**: $WQI \ge 75.0$, $\text{DO} \ge 5.0\text{ mg/L}$, $\text{BOD} \le 3.0\text{ mg/L}$ $\rightarrow$ *Outdoor bathing & recreational use*.
* **Class C**: $WQI \ge 60.0$, $\text{DO} \ge 4.0\text{ mg/L}$, $\text{BOD} \le 3.0\text{ mg/L}$ $\rightarrow$ *Drinking water source after treatment & disinfection*.
* **Class D**: $WQI \ge 45.0$, $\text{DO} \ge 4.0\text{ mg/L}$ $\rightarrow$ *Propagation of Wildlife & Fisheries*.
* **Class E**: $WQI \ge 30.0$ $\rightarrow$ *Irrigation & Industrial Cooling*.
* **BELOW E**: $WQI < 30.0$ or $PI \ge 2.5$ $\rightarrow$ *Severe Hazard / Hazardous Contamination*.

---

### 4.4 Multi-Sensor Thermodynamic Covariance Verification

To prevent false positive alerts caused by faulty sensors, the agent checks physical thermodynamic consistency:

1. **Temperature vs. DO Maximum Solubility Curve**:
   $$\text{DO}_{\text{max}}(T) \approx 14.6 - 0.2 \cdot T$$
   If measured $\text{DO} > \text{DO}_{\text{max}}(T)$, the confidence score drops due to supersaturation noise.
2. **BOD vs. COD Stoichiometric Check**:
   In natural water chemistry, Chemical Oxygen Demand ($COD$) must be equal to or greater than Biochemical Oxygen Demand ($BOD$). If $BOD > COD$, the system flags a sensor reporting discrepancy.

Confidence output formula:
$$\text{Confidence} = 0.5 \times \text{Consistency}_{\text{DO}} + 0.5 \times \text{Consistency}_{\text{BOD/COD}}$$

---

### 4.5 30-Minute Predictive Risk Trajectory ($d/dt$)

The agent maintains a rolling 12-reading window per station to calculate the rate of change ($\frac{d}{dt}$):

$$\Delta WQI = WQI_{t} - WQI_{t-1}$$
$$WQI_{30m} = \max\left(5.0, \min\left(99.9, WQI_{t} + 3.5 \times \Delta WQI\right)\right)$$

* If $\Delta WQI < -2.0$, trajectory is classified as **`DETERIORATING`**.
* If $\Delta WQI > 2.0$, trajectory is classified as **`IMPROVING`**.
* Otherwise, trajectory is classified as **`STABLE`**.

---

### 4.6 Downstream Hydrodynamic Plume Modeling

The Periyar River flow velocity is modeled at an average speed of $v = 1.4 \text{ km/h}$. When an anomaly occurs at station $S_A$, the agent calculates the time of arrival ($T_{\text{arrival}}$) at downstream station $S_B$:

$$\Delta d = d(S_B) - d(S_A)$$
$$T_{\text{arrival}} = \frac{\Delta d}{1.4 \text{ km/h}}$$

For example, an acidic chemical leak at **Eloor (`NODE_ELR_04`, km 74.5)** will reach the **Cochin Estuary (`NODE_KCH_05`, km 88.0)** ($13.5 \text{ km}$) in:

$$T_{\text{arrival}} = \frac{13.5}{1.4} \approx 9.6 \text{ hours}$$

---

### 4.7 Chain-of-Thought (CoT) Reasoning Engine

For every inference tick, the agent constructs a 5-step Chain-of-Thought reasoning path:

1. **Step 1**: Telemetry Ingestion & Covariance Verification
2. **Step 2**: Hydro-Chemical Index & CPCB Grading
3. **Step 3**: Fingerprinting & Anomaly Root Cause Analysis
4. **Step 4**: Downstream Hydrodynamic Plume Modeling
5. **Step 5**: Predictive Trajectory & Governance Directive

---

## 🎮 5. Hydro-Environmental Simulation Engine

The physical simulation engine (`backend/core/environment.py`) provides 6 distinct operational modes:

1. **`HISTORICAL_REPLAY`**: Replays historical sensor telemetry recorded along the Periyar River with organic micro-jitter ($ \pm 0.05 $ pH, $ \pm 0.1 $ DO).
2. **`NORMAL_CONDITIONS`**: Simulates smooth sine-wave diurnal oxygen oscillations ($ \sin(t) $).
3. **`INDUSTRIAL_DISCHARGE`**: Simulates a heavy chemical discharge at Eloor (`NODE_ELR_04`) with COD spiking to $170\text{ mg/L}$, pH dropping to $3.8$, and DO collapsing to $0.8\text{ mg/L}$.
4. **`HEAVY_RAINFALL`**: Simulates monsoon deluge with turbidity rising to $>70\text{ NTU}$ across upstream stations.
5. **`MANUAL_TESTING`**: Allows developers to inject custom sensor values via UI sliders.
6. **`DEVELOPER_MODE`**: Generates high-stress chaotic edge-case values ($4.0 \le \text{pH} \le 9.5$) to verify AI resilience.

---

## 💻 6. Frontend Tech Stack & UX Design

* **Framework**: React 18, Vite, TypeScript, Tailwind CSS.
* **Animations**: Framer Motion for smooth modal transitions, status pulses, and sparklines.
* **Icons**: Lucide React.
* **State Management**: `TelemetryContext` with auto-polling (5000ms intervals).
* **Design Philosophy**: Cyber-industrial dark mode glassmorphism with high-contrast indicator glow (`#00F2FE` Cyan, `#10B981` Emerald, `#F59E0B` Amber, `#F43F5E` Rose).

---

## 🚀 7. Hosting & Deployment Architecture

AquaSentinel is designed for separate production hosting:

* **Frontend**: Hosted on **Vercel** (Global Edge CDN, static asset caching, SPA routing via `vercel.json`).
* **Backend**: Hosted on **Render** (Python 3.11 container powered by `gunicorn "app:create_app()"` WSGI server).

---

*AquaSentinel — Autonomous Hydro-Environmental Intelligence for Sustainable River Basins.*
