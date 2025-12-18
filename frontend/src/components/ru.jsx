import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RouteMap from "../components/RouteMap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AQIBadge from "../components/AQIBadge";
import {
  MapPin,
  Navigation,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const Routes = () => {
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!destination) return;

    setIsSearching(true);

    try {
      const res = await axios.post("http://localhost:3000/api/v2/routes", {
        originCity: origin,
        destinationCity: destination,
      });

      setRoutes(res.data.routes || []);
      setSelectedRoute(res.data.routes?.[0]?.id);
    } catch (err) {
      console.error("Failed to fetch routes", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6">

            {/* LEFT SIDE */}
            <div className="space-y-6">
              <Card variant="glass">
                <CardContent className="p-6 space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <Input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="From city"
                      className="pl-10"
                    />
                  </div>

                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="To city"
                      className="pl-10"
                    />
                  </div>

                  <Button
                    variant="eco"
                    className="w-full"
                    onClick={handleSearch}
                    disabled={isSearching || !destination}
                  >
                    {isSearching ? "Finding clean routes..." : (
                      <>
                        <Search className="w-4 h-4" />
                        Find Clean Routes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* MAP */}
              <Card variant="glass" className="h-[360px] overflow-hidden">
                {routes.length ? (
                  <RouteMap routes={routes} />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Enter destination to view routes
                  </div>
                )}
              </Card>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">
              {routes.map((route) => (
                <Card
                  key={route.id}
                  variant={selectedRoute === route.id ? "glow" : "glass"}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{route.name}</h3>
                      <AQIBadge value={route.aqi} />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      AQI Level based eco route
                    </div>

                    {route.aqi > 100 && (
                      <div className="flex items-center gap-2 mt-3 p-2 rounded bg-eco-amber/10 text-eco-amber text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        Mask recommended
                      </div>
                    )}

                    {selectedRoute === route.id && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                        <CheckCircle className="w-3 h-3" />
                        Selected Route
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Routes;
