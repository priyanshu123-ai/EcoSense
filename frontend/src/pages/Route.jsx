import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RouteMap from "../components/RouteMap";
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
  CheckCircle,
} from "lucide-react";

/* AQI → COLOR (HEX only) */
const getAQIColor = (aqi) => {
  if (aqi === null) return "#9CA3AF";
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#FACC15";
  if (aqi <= 150) return "#FB923C";
  if (aqi <= 200) return "#EF4444";
  return "#991B1B";
};

/* VISUAL SEGMENTS (NO FAKE AQI) */
const buildAQISegments = (geometry, aqi) => {
  if (!geometry || geometry.length < 2) return [];
  const count = Math.min(6, Math.floor(geometry.length / 3));
  return Array.from({ length: count }, () => ({ aqi }));
};

const Routes = () => {
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!destination) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/v2/routes", {
        originCity: origin,
        destinationCity: destination,
      });

      const enrichedRoutes = (res.data.routes || []).map((r) => ({
        ...r,
        segments: buildAQISegments(r.geometry, r.aqi),
      }));

      setRoutes(enrichedRoutes);
      setSelectedRoute(enrichedRoutes?.[0]?.id || null);
    } catch (err) {
      console.error("Route fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0c1210_0%,#060908_100%)] text-white">
      <Navbar />

      <main className="pt-24 pb-12 max-w-[1200px] mx-auto px-4">
        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-[linear-gradient(135deg,#1db954,#1fa8a1,#199fe6)] bg-clip-text text-transparent">
              AQI-Aware
            </span>{" "}
            Route Planner
          </h1>
          <p className="text-[rgba(255,255,255,0.6)]">
            Find the cleanest route to your destination
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* SEARCH */}
            <Card className="rounded-2xl bg-[rgba(15,25,23,0.75)] border border-[rgba(37,58,52,0.5)] backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(29,185,84)]" />
                  <Input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="From city"
                    className="pl-10 bg-[rgba(26,35,31,0.5)] border-[rgba(37,58,52,0.5)] text-white"
                  />
                </div>

                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(31,168,161)]" />
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="To city"
                    className="pl-10 bg-[rgba(26,35,31,0.5)] border-[rgba(37,58,52,0.5)] text-white"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={loading || !destination}
                  className="w-full font-semibold text-[#080d0b]
                  bg-[linear-gradient(135deg,#1db954,#1fa8a1)]"
                >
                  {loading ? "Finding clean routes..." : (
                    <>
                      <Search className="w-4 h-4" />
                      Find Clean Routes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* MAP */}
            <Card className="h-[360px] rounded-2xl bg-[rgba(15,25,23,0.75)] border border-[rgba(37,58,52,0.5)] overflow-hidden">
              {routes.length ? (
                <RouteMap routes={routes} />
              ) : (
                <div className="h-full flex items-center justify-center text-[rgba(255,255,255,0.4)]">
                  Enter destination to see routes
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {routes.map((route) => (
              <Card
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`rounded-2xl cursor-pointer transition-all
                bg-[rgba(15,25,23,0.75)] backdrop-blur-xl border
                ${
                  selectedRoute === route.id
                    ? "border-[rgb(29,185,84)] shadow-[0_0_35px_rgba(29,185,84,0.35)]"
                    : "border-[rgba(37,58,52,0.5)]"
                }`}
              >
                <CardContent className="p-4">
                  {/* HEADER */}
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-white truncate">
                      {route.name}
                    </h3>
                    <AQIBadge value={route.aqi} />
                  </div>

                  {/* META */}
                  <div className="flex items-center gap-4 text-sm text-[rgba(255,255,255,0.6)] mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {route.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Route className="w-4 h-4" /> {route.distance}
                    </span>
                  </div>

                  {/* AQI BAR */}
                  <div className="flex gap-1">
                    {route.segments.map((s, i) => (
                      <div
                        key={i}
                        className="flex-1 h-2 rounded-full"
                        style={{ backgroundColor: getAQIColor(s.aqi) }}
                      />
                    ))}
                  </div>

                  {/* MASK */}
                  {route.aqi > 100 && (
                    <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded
                      bg-[rgba(245,158,11,0.18)] text-[#F59E0B] text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      Mask recommended
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Routes;
