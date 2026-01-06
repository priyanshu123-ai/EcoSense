import axios from "axios";

/* State → Capital fallback */
const stateToCapital = {
  punjab: "Chandigarh",
  rajasthan: "Jaipur",
  maharashtra: "Mumbai",
  gujarat: "Gandhinagar",
  haryana: "Chandigarh",
  "uttar pradesh": "Lucknow",
  up: "Lucknow",
  mp: "Bhopal",
  "madhya pradesh": "Bhopal",
  bihar: "Patna",
  "west bengal": "Kolkata",
  "tamil nadu": "Chennai",
  karnataka: "Bengaluru",
  kerala: "Thiruvananthapuram",
  telangana: "Hyderabad",
  "andhra pradesh": "Amaravati",
  odisha: "Bhubaneswar",
};

export const geocodeCity = async (input) => {
  try {
    if (!input) return null;

    let query = input.trim().toLowerCase();

    // Convert state → capital if needed
    if (stateToCapital[query]) {
      query = stateToCapital[query];
    }

    const res = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "EcoSense-AQI-App",
        },
        timeout: 10000,
      }
    );

    if (!res.data || res.data.length === 0) {
      return null;
    }

    const data = res.data[0];

    return {
      name: input,
      lat: Number(data.lat),
      lon: Number(data.lon),

      // ✅ REQUIRED FOR POLLUTION SOURCES
      bbox: [
        Number(data.boundingbox[0]), // south
        Number(data.boundingbox[1]), // north
        Number(data.boundingbox[2]), // west
        Number(data.boundingbox[3]), // east
      ],
    };
  } catch (err) {
    console.error("Geocode error:", err.message);
    return null;
  }
};
