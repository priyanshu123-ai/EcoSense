import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const redIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
});

const blueIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
});

const RouteMap = ({ routes, selectedRouteId, origin, destination }) => {
  const originPos = [origin.lat, origin.lon];
  const destPos = [destination.lat, destination.lon];

  return (
    <MapContainer
      center={originPos}
      zoom={6}
      className="h-[450px] w-full rounded-2xl"
      style={{ background: "#1a2e1a" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      <Marker position={originPos} icon={redIcon}>
        <Popup>Origin: {origin.name}</Popup>
      </Marker>

      <Marker position={destPos} icon={blueIcon}>
        <Popup>Destination: {destination.name}</Popup>
      </Marker>

      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;
        const positions = route.geometry.map((p) => [p.lat, p.lon]);

        return (
          <Polyline
            key={route.id}
            positions={positions}
            pathOptions={{
              color: isSelected ? "#10b981" : route.color,
              weight: isSelected ? 7 : 4,
              opacity: isSelected ? 1 : 0.6,
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default RouteMap;
