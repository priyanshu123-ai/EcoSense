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
        "User-Agent": "city-pollution-app"
      }
    }
  );

  if (!res.data.length) return null;

  const place = res.data[0];

  return {
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
    bbox: place.boundingbox.map(Number), // [south, north, west, east]
  };
};
