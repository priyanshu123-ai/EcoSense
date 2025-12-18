export const estimateTimeMinutes = (distanceKm, roadType = "city") => {
  // realistic average speeds
  const SPEEDS = {
    motorway: 60,
    primary: 45,
    secondary: 35,
    residential: 25,
    city: 30,
  };

  const speed = SPEEDS[roadType] || SPEEDS.city;
  return Math.round((distanceKm / speed) * 60);
};
