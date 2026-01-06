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
    if (!input || typeof input !== "string") return null;

    // ✅ normalize input
    let query = input
      .trim()
      .replace(/[^a-zA-Z\s]/g, "")
      .toLowerCase();

    // state → capital
    if (stateToCapital[query]) {
      query = stateToCapital[query];
    }

    // Capitalize first letter (Nominatim prefers this)
    query = query
      .split(" ")
      .map(
        (w) => w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join(" ");

    const res = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `${query}, India`, // ✅ country hint
          format: "json",
          limit: 1,
          addressdetails: 1,
          countrycodes: "in",
        },
        headers: {
          "User-Agent": "EcoSense-App (priyanshu)",
          "Accept-Language": "en",
        },
        timeout: 15000,
      }
    );

    if (!Array.isArray(res.data) || res.data.length === 0) {
      console.warn("Geocode failed for:", query);
      return null;
    }

    const data = res.data[0];

    return {
      name: input,
      lat: Number(data.lat),
      lon: Number(data.lon),
      bbox: data.boundingbox
        ? [
            Number(data.boundingbox[0]),
            Number(data.boundingbox[1]),
            Number(data.boundingbox[2]),
            Number(data.boundingbox[3]),
          ]
        : null,
    };
  } catch (err) {
    console.error("Geocode error:", err.message);
    return null;
  }
};
