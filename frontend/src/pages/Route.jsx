import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import RouteMap from "@/components/RouteMap";
import AQIBadge from "../components/AQIBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Navigation,
  Search,
  Clock,
  Route,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { serverUrl } from "@/main";

/* AQI color helper */
const getAQIColor = (aqi) => {
  if (aqi === null) return "#9CA3AF";
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#FACC15";
  if (aqi <= 150) return "#FB923C";
  if (aqi <= 200) return "#EF4444";
  return "#991B1B";
};

/* Fake AQI segments (UI only) */
const buildAQISegments = (geometry, aqi) => {
  if (!geometry || geometry.length < 2) return [];
  const count = Math.min(6, Math.floor(geometry.length / 3));
  return Array.from({ length: count }, () => ({ aqi }));
};

const Routes = () => {
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!destination) return;
    setLoading(true);

    try {
      const res = await axios.post(`${serverUrl}/api/v2/routes`, {
        originCity: origin,
        destinationCity: destination,
      });

      const enrichedRoutes = (res.data.routes || []).map((r) => ({
        ...r,
        segments: buildAQISegments(r.geometry, r.aqi),
      }));

      setRoutes(enrichedRoutes);
      setSelectedRoute(0);
      setOriginCoords(res.data.origin);
      setDestinationCoords(res.data.destination);
    } catch (err) {
      console.error("Route fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0f0d" }}>
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-emerald-400">AQI-Aware</span>{" "}
            <span className="text-white">Route Planner</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Find the cleanest route to your destination
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Card */}
            <Card className="border-0" style={{ background: "rgba(15,25,23,0.9)" }}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <Input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="From city"
                      className="pl-10 bg-transparent border-emerald-500/30 text-white"
                    />
                  </div>

                  <div className="relative flex-1">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="To city"
                      className="pl-10 bg-transparent border-emerald-500/30 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finding...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Find Routes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-0 overflow-hidden" style={{ background: "rgba(15,25,23,0.9)" }}>
              <CardContent className="p-4">
                {routes.length > 0 && originCoords && destinationCoords ? (
                  <RouteMap
                    routes={routes}
                    selectedRouteId={selectedRoute}
                    origin={originCoords}
                    destination={destinationCoords}
                  />
                ) : (
                  <div className="h-[450px] flex items-center justify-center border-2 border-dashed border-emerald-500/20">
                    <Route className="w-16 h-16 text-emerald-500/30" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Available Routes</h2>

            {routes.map((route) => (
              <Card
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`cursor-pointer border-2 ${
                  selectedRoute === route.id
                    ? "border-emerald-500"
                    : "border-transparent"
                }`}
                style={{ background: "rgba(15,25,23,0.9)" }}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between mb-3">
                    <h3 className="text-white font-semibold">{route.name}</h3>
                    <AQIBadge value={route.aqi} size="sm" />
                  </div>

                  <div className="flex gap-4 text-gray-400 text-sm mb-3">
                    <span className="flex gap-1">
                      <Clock className="w-4 h-4" />
                      {route.duration}
                    </span>
                    <span className="flex gap-1">
                      <Route className="w-4 h-4" />
                      {route.distance}
                    </span>
                  </div>

                  <div className="flex gap-1 mb-3">
                    {route.segments.map((s, i) => (
                      <div
                        key={i}
                        className="flex-1 h-2 rounded-full"
                        style={{ backgroundColor: getAQIColor(s.aqi) }}
                      />
                    ))}
                  </div>

                  {route.aqi > 100 && (
                    <div className="flex gap-2 text-amber-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Mask recommended
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation Button */}
        {routes.length > 0 && (
  <div className="fixed bottom-8 right-6">
    <Button
      onClick={() =>
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
          "_blank"
        )
      }
      className="bg-emerald-500 px-8 py-6 rounded-full shadow-lg"
    >
      <Navigation className="w-5 h-5 mr-2" />
      Start Navigation
    </Button>
  </div>
)}

      </div>
    </div>
  );
};

export default Routes;
