import { geocodeCity } from "../utils/geocodeCity.js";
import { detectPollutionSources } from "../utils/detectPollutionSources.js";
import { calculateSectorContribution } from "../utils/calculateSectorContribution.js";
import { getAQIByCoords } from "../utils/getAQI.js";

export const cityPollutionController = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ success: false, message: "City required" });
    }

    // 1️⃣ City → lat/lon (YOU ALREADY HAVE THIS)
    const location = await geocodeCity(city);

    if (!location) {
      return res.status(400).json({ success: false, message: "Invalid city" });
    }

    // 2️⃣ Real AQI
    const { aqi } = await getAQIByCoords(location.lat, location.lon);

    // 3️⃣ Detect pollution sources dynamically
   const sources = await detectPollutionSources(location.bbox);

    // 4️⃣ Calculate contribution
    const contribution = calculateSectorContribution(sources);

    // 5️⃣ Response
    res.json({
      success: true,
      city,
      coordinates: location,
      aqi,
      contribution,
      detectedSources: sources,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Failed to calculate pollution contribution",
    });
  }
};
