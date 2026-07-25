<div align="center">

# 🛡️ AquaSentinel
### Autonomous Environmental Intelligence & River Health Platform

![React](https://img.shields.io/badge/React-18.3-00f2fe?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)
![CPCB](https://img.shields.io/badge/CPCB-Class_A--E_Standard-emerald?style=for-the-badge)

<br />

> **AquaSentinel** is an ultra-premium, AI-driven environmental monitoring platform built to safeguard the **Periyar River Basin in Kerala, India**. Combining **real-time 7-parameter hydro-chemical telemetry**, **3D WebGL volumetric current visualization**, **CPCB statutory compliance auditing**, and a **Chain-of-Thought (CoT) multi-agent cognitive engine**, AquaSentinel autonomously detects chemical anomalies, models downstream plume dispersion, and executes emergency authority dispatches.

</div>

---

## 💎 Key Highlights & Capabilities

### 1. 🌊 Interactive 3D River Transect & GIS Station Map
- **3D WebGL Volumetric Flow**: Real-time particle stream rendered with Three.js reflecting flow velocity, water quality index (WQI), and seasonal turbidity.
- **Periyar River Stations (88 km Transect)**:
  - `NODE_BHT_01`: Bhoothathankettu Dam Station (River km 0.0)
  - `NODE_NRM_02`: Neriamangalam Intake (River km 24.5)
  - `NODE_ALV_03`: Aluva Water Intake (River km 62.0 — Primary Municipal Intake)
  - `NODE_ELR_04`: Eloor Industrial Belt (River km 74.5 — Chemical Risk Zone)
  - `NODE_KCH_05`: Cochin Estuary Outlet (River km 88.0)

### 2. 🤖 Hyper-Cognitive AI Reasoning Engine
- **Chain-of-Thought (CoT) Diagnostics**: Generates step-by-step multi-station reasoning trees explaining root cause factors (e.g. Acidic Effluent, COD Spikes, Hypoxia Risk).
- **Statutory CPCB Classification**: Classifies water safety into **CPCB Class A to E** surface water grades.
- **Nemerow Pollution Index (PI)**: Evaluates multi-parameter stress using non-linear sub-index curves.
- **Predictive Risk Trajectories ($d/dt$)**: Forecasts 30-minute and 2-hour water quality trajectories based on telemetry rates of change.

### 3. 🧪 AI Hydro-Chemical Remediation Controller
- **Aeration Intervention**: Simulates high-flow micro-bubble oxygen diffusors boosting Dissolved Oxygen ($DO$) by $+3.2\text{ mg/L}$.
- **Chemical Neutralization**: Models calcium carbonate ($CaCO_3$) buffer injection to neutralize acidic leaks ($5.8 \rightarrow 7.4\text{ pH}$).
- **Hydraulic Flush Regulation**: Simulates Bhoothathankettu Dam sluice gate release ($+35\%\text{ freshwater flow}$) to accelerate chemical effluent dilution.

### 4. 🚨 Official Emergency Alert Broadcast
- **KWA & CPCB Automated Dispatch**: Generates official emergency briefing payloads sent via BSNL SMS Gateway and NIC National Cloud API.
- **Target Recipients**: Kerala Water Authority Emergency Cell (#1916), Central Pollution Control Board Regional Portal, and Ernakulam District Collectorate.

---

## 🎨 Design System & Aesthetics

AquaSentinel features an **ultra-premium dark glassmorphic design system**:
- **Background**: Deep Abyss Dark (`#050914`) with bioluminescent background mesh spotlights.
- **Cards & Tiles**: 28px blur backdrop filters, multi-layered inset highlight borders (`inset 0 1px 0 rgba(255, 255, 255, 0.12)`), and dynamic `.glint-effect` hover reflections.
- **Typography**: `Outfit` for display headings, `Inter` for interface body, and `JetBrains Mono` for sensor readouts and telemetry logs.

---

## 🛠️ Architecture & Technology Stack

```text
AquaSentinel Platform Architecture
├── Frontend (React + Vite + TailwindCSS + Three.js)
│   ├── Floating Header & Navigation Deck
│   ├── Status Banner (4-Tile KPI Summary)
│   ├── Station Map (3D Interactive Transect + HUD Reticles)
│   ├── Water Quality Grid (Live Sensor Metrics & Animated Counters)
│   ├── AI Assistant Console (Terminal Logs, CoT Tree, Query Deck)
│   ├── Environmental Hydro-Simulation Studio
│   └── Historical Trend Sparkline Charts
└── Backend (Flask REST API + Python AI Engine)
    ├── Environment Simulator (5-second Telemetry Tick & Overrides)
    ├── AquaSentinel AI Agent (WQI, Nemerow PI, CoT Inference)
    ├── Hydrodynamic Downstream Plume Dispersion Model
    └── Emergency Alert Dispatcher (SMS/Email Payload Generator)
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: `v18+` or `v20+`
- **Python**: `v3.10+` or `v3.11+`

### 1. Clone Repository
```bash
git clone https://github.com/Allen73737/AquaSentinel---water-quality-ai-agent.git
cd AquaSentinel---water-quality-ai-agent
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python app.py
```
> Backend REST server will start at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
> Frontend dev server will start at `http://localhost:5173`

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/v1/status` | `GET` | System operational status, uptime, and node counts |
| `/api/v1/telemetry/latest` | `GET` | Triggers telemetry tick and returns AI evaluation |
| `/api/v1/agent/query` | `POST` | Processes natural language queries & scenario prompts |
| `/api/v1/agent/remediate` | `POST` | Simulates chemical remediation strategies & WQI recovery |
| `/api/v1/simulation/mode` | `POST` | Updates simulation mode (`NORMAL`, `INDUSTRIAL`, `RAINFALL`) |
| `/api/v1/simulation/override` | `POST` | Applies manual sensor overrides for testing |
| `/api/v1/alerts/dispatch` | `POST` | Transmits emergency alert dispatches to authorities |

---

## 🛡️ License & Acknowledgments

Developed for environmental monitoring of the **Periyar River Basin, Kerala**. Adheres to **CPCB (Central Pollution Control Board)** Class A-E surface water standards.

Distributed under the MIT License. Created by [Allen](https://github.com/Allen73737).
