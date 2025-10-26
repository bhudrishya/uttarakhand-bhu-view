import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Layers, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockMarkers = [
  { id: 1, lat: 30.3165, lng: 78.0322, title: "Property 245/1", owner: "Rajesh Kumar Sharma" },
  { id: 2, lat: 29.9457, lng: 78.1642, title: "Property 156/3", owner: "Sunita Devi" },
];

const MapView = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Interactive Map View</h1>
          <p className="text-muted-foreground">
            Explore land parcels with cadastral boundaries and satellite imagery
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Map Layers</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Cadastral Boundaries</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Satellite Imagery</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Property Labels</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold">Recent Searches</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 rounded hover:bg-muted cursor-pointer">
                    <p className="font-medium">Khasra 245/1</p>
                    <p className="text-muted-foreground text-xs">Dehradun</p>
                  </div>
                  <div className="p-2 rounded hover:bg-muted cursor-pointer">
                    <p className="font-medium">Khasra 156/3</p>
                    <p className="text-muted-foreground text-xs">Haridwar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="h-[600px] w-full bg-muted relative">
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Navigation className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        GIS-enabled map view will be integrated here
                      </p>
                      <Button variant="default">
                        Enable Full Map View
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Property Markers List */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  {mockMarkers.map((marker) => (
                    <Card key={marker.id} className="bg-background/95 backdrop-blur">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{marker.title}</p>
                          <p className="text-sm text-muted-foreground">{marker.owner}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <MapPin className="w-4 h-4" />
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
