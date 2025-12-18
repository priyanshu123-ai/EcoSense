import { geocodeCity } from "../utils/geocodeCity.js";
import { getRoadsBetweenPoints } from "../utils/overpassService.js";
import { getAQIByCoords } from "../utils/getAQI.js";
import { getRouteDistanceAndTime } from "../utils/getRouteDistance.js";

/* AQI → COLOR (UI helper only) */
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

    // 1️⃣ Validate
    if (!originCity || !destinationCity) {
      return res.status(400).json({
        success: false,
        message: "Origin and destination required",
      });
    }

    // 2️⃣ Geocode cities
    const origin = await geocodeCity(originCity);
    const destination = await geocodeCity(destinationCity);

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: "Invalid city name",
      });
    }

    // 3️⃣ REAL distance & time (OSRM)
    const { distanceKm, durationMin } =
      await getRouteDistanceAndTime(origin, destination);

    // 4️⃣ Fetch nearby real roads (for AQI + map rendering)
    const roads = await getRoadsBetweenPoints(
      origin.lat,
      origin.lon,
      destination.lat,
      destination.lon
    );

    const routes = [];

    // 5️⃣ Build routes (limit 5)
    for (const road of roads.slice(0, 5)) {
      if (!road.geometry || road.geometry.length < 2) continue;

      // AQI from midpoint (REAL)
      const mid = road.geometry[Math.floor(road.geometry.length / 2)];
      const { aqi } = await getAQIByCoords(mid.lat, mid.lon);

      routes.push({
        id: road.id,
        name: road.tags?.name || "Route option",
        aqi,

        // ✅ CORRECT PLACE
        distance: `${distanceKm.toFixed(1)} km`,
        duration: `${durationMin} min`,

        maskAdvice:
          aqi === null
            ? "AQI unavailable"
            : aqi > 100
            ? "😷 Mask recommended"
            : "✅ No mask required",

        color: getAQIColor(aqi),
        geometry: road.geometry,
      });
    }

    // 6️⃣ Best route (lowest AQI)
    const bestRoute =
      routes
        .filter((r) => r.aqi !== null)
        .sort((a, b) => a.aqi - b.aqi)[0] || null;

    // 7️⃣ Response
    return res.json({
      success: true,
      origin,
      destination,
      bestRoute,
      routes,
    });
  } catch (err) {
    console.error("Route Controller Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Route calculation failed",
    });
  }
};
