import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  GoogleMap,
  Marker,
  Rectangle,
  useJsApiLoader,
} from "@react-google-maps/api";

interface MapData {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  center_x: number;
  center_y: number;
  plotNo: string;
  info?: string;
  plotInfoLinks?: string;
  gisCode?: string;
}

const PropertyMapView = () => {
  const location = useLocation();
  const mapData = location.state as MapData | null;
  const [infoCollapsed, setInfoCollapsed] = useState(false);

  // ✅ Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  if (!mapData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Link to="/search">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No map data available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const center = { lat: mapData.center_y, lng: mapData.center_x };

  const bounds = {
    north: mapData.ymax,
    south: mapData.ymin,
    east: mapData.xmax,
    west: mapData.xmin,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to="/property" state={location.state?.propertyState}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Property Details
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Property Map View
          </h1>

          <Card className="mb-6">
            <CardContent className="p-0 relative">
              <div className="h-[calc(100vh-250px)] w-full">
                {!isLoaded ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading Google Map...</p>
                  </div>
                ) : (
                  <GoogleMap
                    center={center}
                    zoom={18}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{
                      mapTypeId: "satellite",
                      zoomControl: true,
                      streetViewControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    {/* Highlight the khasra boundary */}
                    <Rectangle
                      bounds={bounds}
                      options={{
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#FF0000",
                        fillOpacity: 0.25,
                      }}
                    />

                    {/* Marker at center */}
                    <Marker position={center} label={mapData.plotNo} />
                  </GoogleMap>
                )}
              </div>

              {/* Info Drawer */}
              <div
                className={`absolute bottom-4 left-4 bg-background border rounded-lg shadow-lg transition-all ${
                  infoCollapsed ? "w-12 h-12" : "w-80 max-h-96"
                }`}
              >
                <div
                  className="flex items-center justify-between p-3 cursor-pointer border-b"
                  onClick={() => setInfoCollapsed(!infoCollapsed)}
                >
                  {!infoCollapsed && (
                    <span className="font-semibold">Plot Information</span>
                  )}
                  {infoCollapsed ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
                {!infoCollapsed && (
                  <div className="p-4 overflow-auto max-h-80">
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Plot No:</strong> {mapData.plotNo}
                      </div>
                      {mapData.gisCode && (
                        <div>
                          <strong>GIS Code:</strong> {mapData.gisCode}
                        </div>
                      )}
                      {mapData.center_y && mapData.center_x && (
                        <div>
                          <strong>Center:</strong>{" "}
                          {mapData.center_y.toFixed(6)},{" "}
                          {mapData.center_x.toFixed(6)}
                        </div>
                      )}
                      {mapData.info && (
                        <div>
                          <strong>Info:</strong> {mapData.info}
                        </div>
                      )}
                      {mapData.plotInfoLinks && (
                        <div
                          className="pt-2 border-t"
                          dangerouslySetInnerHTML={{
                            __html: mapData.plotInfoLinks,
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyMapView;
