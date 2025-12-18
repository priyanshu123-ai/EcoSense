import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RouteMap = ({ routes }) => {
  if (!routes.length) return null;

  const center = [
    routes[0].geometry[0].lat,
    routes[0].geometry[0].lon,
  ];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-full w-full rounded-xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.geometry.map(p => [p.lat, p.lon])}
          pathOptions={{
            color: route.color,
            weight: 6,
            opacity: 0.9,
          }}
        />
      ))}
    </MapContainer>
  );
};

export default RouteMap;
