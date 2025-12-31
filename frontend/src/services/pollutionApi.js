import axios from "axios";

export const getCityPollution = async (city) => {
  const res = await axios.post("http://localhost:3000/api/v5/city", {
    city,
  });
  console.log(res.data)
  return res.data;
};
