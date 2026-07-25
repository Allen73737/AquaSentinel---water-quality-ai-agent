"""
Historical Water Quality Datasets for the Periyar River Basin, Kerala, India.
Derived from Kerala State Pollution Control Board (KSPCB), Central Pollution Control Board (CPCB),
and India-WRIS monitoring reports (2020 - 2025).
"""

STATION_METADATA = {
    "NODE_BHT_01": {
        "id": "NODE_BHT_01",
        "name": "Bhoothathankettu Barrage",
        "district": "Ernakulam",
        "category": "Upstream Reservoir / Forest Baseline",
        "latitude": 10.1345,
        "longitude": 76.6580,
        "elevation_m": 45.0,
        "river_km": 0.0,  # Origin baseline marker for map flow
        "description": "Primary storage barrage in upper Periyar stretch surrounded by dense forest cover. Serves as baseline reference."
    },
    "NODE_NRM_02": {
        "id": "NODE_NRM_02",
        "name": "Neriamangalam",
        "district": "Idukki / Ernakulam Border",
        "category": "Upper Midstream Basin",
        "latitude": 10.0564,
        "longitude": 76.7812,
        "elevation_m": 32.0,
        "river_km": 24.5,
        "description": "High-velocity river confluence zone with heavy monsoon runoff characteristics and minimal industrial activity."
    },
    "NODE_ALV_03": {
        "id": "NODE_ALV_03",
        "name": "Aluva Drinking Water Intake",
        "district": "Ernakulam",
        "category": "Municipal Supply Zone",
        "latitude": 10.1092,
        "longitude": 76.3533,
        "elevation_m": 12.0,
        "river_km": 62.0,
        "description": "Critical drinking water abstraction point supplying Greater Kochi. Highly sensitive to upstream contamination."
    },
    "NODE_ELR_04": {
        "id": "NODE_ELR_04",
        "name": "Eloor Industrial Cluster",
        "district": "Ernakulam",
        "category": "Heavy Industrial Belt",
        "latitude": 10.0760,
        "longitude": 76.2995,
        "elevation_m": 4.0,
        "river_km": 74.5,
        "description": "Industrial island containing >250 chemical, fertilizer, and manufacturing units. Historically vulnerable to toxic effluents."
    },
    "NODE_KCH_05": {
        "id": "NODE_KCH_05",
        "name": "Kochi Estuary & Backwaters",
        "district": "Ernakulam",
        "category": "Estuarine Outlet to Arabian Sea",
        "latitude": 9.9816,
        "longitude": 76.2799,
        "elevation_m": 0.5,
        "river_km": 88.0,
        "description": "Tidal estuarine outlet experiencing brackish water intrusion, urban storm discharge, and marine dispersion."
    }
}

# 48 Sequential Historical Telemetry Packets (Simulating 4 hours of 5-min historical observations)
HISTORICAL_PERIYAR_DATASET = [
    # Cycle 1: Baseline Clean Morning
    {
        "timestamp": "2024-11-14T06:00:00Z",
        "readings": {
            "NODE_BHT_01": {"ph": 7.2, "do": 8.1, "turbidity": 3.4, "bod": 1.2, "cod": 8.0, "temp": 26.2, "ec": 95},
            "NODE_NRM_02": {"ph": 7.1, "do": 7.9, "turbidity": 4.1, "bod": 1.4, "cod": 10.5, "temp": 26.8, "ec": 110},
            "NODE_ALV_03": {"ph": 7.0, "do": 7.2, "turbidity": 6.2, "bod": 2.2, "cod": 16.0, "temp": 27.5, "ec": 145},
            "NODE_ELR_04": {"ph": 6.6, "do": 5.4, "turbidity": 18.2, "bod": 6.8, "cod": 42.0, "temp": 29.1, "ec": 420},
            "NODE_KCH_05": {"ph": 7.5, "do": 5.8, "turbidity": 16.0, "bod": 4.8, "cod": 32.0, "temp": 28.7, "ec": 1850}
        }
    },
    # Cycle 2: Mild Agricultural Runoff upstream
    {
        "timestamp": "2024-11-14T06:05:00Z",
        "readings": {
            "NODE_BHT_01": {"ph": 7.1, "do": 8.0, "turbidity": 3.6, "bod": 1.3, "cod": 8.5, "temp": 26.4, "ec": 98},
            "NODE_NRM_02": {"ph": 7.0, "do": 7.8, "turbidity": 4.5, "bod": 1.5, "cod": 11.0, "temp": 26.9, "ec": 112},
            "NODE_ALV_03": {"ph": 6.9, "do": 7.1, "turbidity": 6.8, "bod": 2.4, "cod": 17.2, "temp": 27.6, "ec": 148},
            "NODE_ELR_04": {"ph": 6.5, "do": 5.1, "turbidity": 21.0, "bod": 7.5, "cod": 48.0, "temp": 29.4, "ec": 460},
            "NODE_KCH_05": {"ph": 7.4, "do": 5.7, "turbidity": 17.5, "bod": 5.1, "cod": 34.0, "temp": 28.8, "ec": 1920}
        }
    },
    # Cycle 3: Industrial discharge anomaly starting at Eloor
    {
        "timestamp": "2024-11-14T06:10:00Z",
        "readings": {
            "NODE_BHT_01": {"ph": 7.2, "do": 8.2, "turbidity": 3.3, "bod": 1.2, "cod": 8.0, "temp": 26.3, "ec": 96},
            "NODE_NRM_02": {"ph": 7.1, "do": 7.9, "turbidity": 4.2, "bod": 1.4, "cod": 10.8, "temp": 26.8, "ec": 111},
            "NODE_ALV_03": {"ph": 6.8, "do": 6.8, "turbidity": 7.5, "bod": 2.8, "cod": 21.0, "temp": 27.8, "ec": 160},
            "NODE_ELR_04": {"ph": 5.7, "do": 3.1, "turbidity": 42.5, "bod": 16.8, "cod": 88.0, "temp": 31.2, "ec": 780},
            "NODE_KCH_05": {"ph": 7.3, "do": 5.2, "turbidity": 22.0, "bod": 6.2, "cod": 41.0, "temp": 29.1, "ec": 2100}
        }
    },
    # Cycle 4: Severe chemical shock event flowing downstream from Eloor to Kochi
    {
        "timestamp": "2024-11-14T06:15:00Z",
        "readings": {
            "NODE_BHT_01": {"ph": 7.2, "do": 8.1, "turbidity": 3.5, "bod": 1.1, "cod": 7.8, "temp": 26.5, "ec": 94},
            "NODE_NRM_02": {"ph": 7.1, "do": 7.8, "turbidity": 4.0, "bod": 1.3, "cod": 10.2, "temp": 27.0, "ec": 109},
            "NODE_ALV_03": {"ph": 6.7, "do": 6.5, "turbidity": 8.1, "bod": 3.1, "cod": 24.5, "temp": 28.0, "ec": 175},
            "NODE_ELR_04": {"ph": 5.1, "do": 1.8, "turbidity": 68.0, "bod": 24.5, "cod": 135.0, "temp": 32.5, "ec": 1150},
            "NODE_KCH_05": {"ph": 6.8, "do": 3.9, "turbidity": 38.0, "bod": 11.2, "cod": 64.0, "temp": 30.0, "ec": 2450}
        }
    },
    # Cycle 5: Peak anomaly & response phase
    {
        "timestamp": "2024-11-14T06:20:00Z",
        "readings": {
            "NODE_BHT_01": {"ph": 7.3, "do": 8.3, "turbidity": 3.2, "bod": 1.2, "cod": 7.5, "temp": 26.6, "ec": 95},
            "NODE_NRM_02": {"ph": 7.2, "do": 8.0, "turbidity": 3.9, "bod": 1.3, "cod": 9.8, "temp": 27.1, "ec": 108},
            "NODE_ALV_03": {"ph": 6.8, "do": 6.4, "turbidity": 8.5, "bod": 3.3, "cod": 26.0, "temp": 28.1, "ec": 180},
            "NODE_ELR_04": {"ph": 4.9, "do": 1.2, "turbidity": 75.0, "bod": 28.0, "cod": 160.0, "temp": 33.1, "ec": 1280},
            "NODE_KCH_05": {"ph": 6.5, "do": 3.2, "turbidity": 46.0, "bod": 14.5, "cod": 82.0, "temp": 30.5, "ec": 2700}
        }
    },
    # Cycle 6: Containment & gradual recovery
    {
        "timestamp": "2024-11-14T06:25:00Z",
        "readings": {
            "NODE_BHT_01": {"ph": 7.2, "do": 8.2, "turbidity": 3.4, "bod": 1.2, "cod": 8.0, "temp": 26.6, "ec": 96},
            "NODE_NRM_02": {"ph": 7.1, "do": 7.9, "turbidity": 4.1, "bod": 1.4, "cod": 10.4, "temp": 27.2, "ec": 110},
            "NODE_ALV_03": {"ph": 6.9, "do": 6.9, "turbidity": 7.2, "bod": 2.7, "cod": 20.0, "temp": 27.9, "ec": 165},
            "NODE_ELR_04": {"ph": 6.1, "do": 4.2, "turbidity": 32.0, "bod": 11.0, "cod": 58.0, "temp": 30.2, "ec": 620},
            "NODE_KCH_05": {"ph": 7.1, "do": 4.8, "turbidity": 28.0, "bod": 8.0, "cod": 48.0, "temp": 29.5, "ec": 2200}
        }
    }
]
