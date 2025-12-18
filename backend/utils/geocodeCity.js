import axios from "axios";

export const geocodeCity = async (city) => {
  const res = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: city,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "EcoSense-App",
      },
    }
  );

  if (!res.data.length) return null;

  return {
    lat: parseFloat(res.data[0].lat),
    lon: parseFloat(res.data[0].lon),
  };
};
