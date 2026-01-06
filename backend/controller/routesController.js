import axios from "axios";
import { geocodeCity } from "../utils/geocodeCity.js";
import { getAQIByCoords } from "../utils/getAQI.js";

const getAQIColor = (aqi) => {
  if (aqi === null) return "#9CA3AF";
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#FACC15";
  if (aqi <= 150) return "#FB923C";
  if (aqi <= 200) return "#EF4444";
  return "#991B1B";
};

export const routeController = async (req, res) => {
  try {
    const { originCity, destinationCity } = req.body;

    if (!originCity || !destinationCity) {
      return res.status(400).json({
        success: false,
        message: "originCity and destinationCity required",
      });
    }

    const origin = await geocodeCity(originCity);
    const destination = await geocodeCity(destinationCity);

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: "Invalid city name",
      });
    }

    // ✅ OSRM URL (tested)
    const osrmURL = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson&alternatives=true`;

    const osrmRes = await axios.get(osrmURL, { timeout: 15000 });

    if (!osrmRes.data?.routes?.length) {
      return res.status(500).json({
        success: false,
        message: "No routes returned from OSRM",
      });
    }

    const routes = [];

    for (let i = 0; i < osrmRes.data.routes.length; i++) {
      const r = osrmRes.data.routes[i];

      const geometry = r.geometry.coordinates.map(([lon, lat]) => ({
        lat,
        lon,
      }));

      // 🟡 AQI SAFE CALL
      let aqi = null;
      try {
        const mid = geometry[Math.floor(geometry.length / 2)];
        const aqiRes = await getAQIByCoords(mid.lat, mid.lon);
        aqi = aqiRes?.aqi ?? null;
      } catch (e) {
        console.warn("AQI fetch failed, continuing...");
      }

      routes.push({
        id: i,
        name: `Route ${i + 1}`,
        distance: `${(r.distance / 1000).toFixed(1)} km`,
        duration: `${Math.round(r.duration / 60)} min`,
        aqi,
        color: getAQIColor(aqi),
        geometry,
      });
    }

    res.json({
      success: true,
      origin,
      destination,
      routes,
    });
  } catch (err) {
    console.error("ROUTE ERROR FULL:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: err?.response?.data || err.message,
    });
  }
};
