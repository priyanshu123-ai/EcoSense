import axios from "axios";

const OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter";

export const detectPollutionSources = async (bbox) => {
  const [south, north, west, east] = bbox;

 const query = `
  [out:json][timeout:60];
  (
    way["highway"~"motorway|trunk|primary|secondary"](${south},${west},${north},${east});
    way["landuse"="industrial"](${south},${west},${north},${east});
    node["power"="plant"](${south},${west},${north},${east});
    way["construction"](${south},${west},${north},${east});
  );
  out tags;
`;


  const res = await axios.post(OVERPASS_URL, query, {
    headers: { "Content-Type": "text/plain" },
  });

  let transport = 0;
  let industry = 0;
  let power = 0;
  let construction = 0;

  for (const el of res.data.elements) {
    if (el.tags?.highway) transport++;
    if (el.tags?.landuse === "industrial") industry++;
    if (el.tags?.power === "plant") power++;
    if (el.tags?.construction) construction++;
  }

  return { transport, industry, power, construction };
};
