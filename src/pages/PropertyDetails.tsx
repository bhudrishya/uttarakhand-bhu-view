import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import PropertyMap from "@/components/PropertyMap";
import proj4 from "proj4";

interface MapData {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  center_x: number;
  center_y: number;
  plotNo: string;
  info: string;
  plotInfoLinks: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [infoCollapsed, setInfoCollapsed] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!location.state) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bhulekh-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            act: 'getReport',
            ...location.state
          })
        });
        const data = await response.json();
        setHtmlContent(data.html || '');
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [location.state]);

  const handleViewOnMap = async () => {
    if (!location.state) return;
    
    setMapLoading(true);
    setShowMap(true);
    
    try {
      const { district_code, tehsil_code, village_code, khasra_number } = location.state;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bhulekh-proxy/scalar?plotno=${khasra_number}&levels=${district_code}&tehsil_code=${tehsil_code}&village_code=${village_code}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
    

      const toLatLon = (x: number, y: number) =>
      proj4("EPSG:3857", "EPSG:4326", [x * 66411.22723828269, y * 405870.1235128565]);

      const [lon, lat] = toLatLon(data.center_x, data.center_y);
      data.center_x=lon
      data.center_y=lat
      setMapData(data);
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setMapLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to="/search">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Property Details
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              variant="default" 
              size="lg" 
              className="text-lg px-8"
              onClick={handleViewOnMap}
              disabled={mapLoading}
            >
              <MapPin className="w-5 h-5" />
              {mapLoading ? 'Loading Map...' : 'View On Map'}
            </Button>
          </div>
          {showMap && mapData && mapData.center_x && mapData.center_y && (
            <Card className="mb-6">
              <CardContent className="p-0 relative">
                <div className="h-[600px] w-full">
                  <PropertyMap
                    xmin={mapData.xmin}
                    ymin={mapData.ymin}
                    xmax={mapData.xmax}
                    ymax={mapData.ymax}
                    center_x={mapData.center_x}
                    center_y={mapData.center_y }
                    plotNo={mapData.plotNo}
                  />
                </div>
                
                {/* Info Modal */}
                <div 
                  className={`absolute bottom-4 right-4 bg-background border rounded-lg shadow-lg transition-all ${
                    infoCollapsed ? 'w-12 h-12' : 'w-80 max-h-96'
                  }`}
                >
                  <div 
                    className="flex items-center justify-between p-3 cursor-pointer border-b"
                    onClick={() => setInfoCollapsed(!infoCollapsed)}
                  >
                    {!infoCollapsed && <span className="font-semibold">Plot Information</span>}
                    {infoCollapsed ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                  {!infoCollapsed && (
                    <div className="p-4 overflow-auto max-h-80">
                      <div className="space-y-2 text-sm">
                        <div><strong>Plot No:</strong> {mapData.plotNo}</div>
                        <div><strong>GIS Code:</strong> {(mapData as any).gisCode}</div>
                        {mapData.center_y && mapData.center_x && (
                          <div><strong>Center:</strong> {mapData.center_y.toFixed(6)}, {mapData.center_x.toFixed(6)}</div>
                        )}
                        {mapData.info && (
                          <div><strong>Info:</strong> {mapData.info}</div>
                        )}
                        {mapData.plotInfoLinks && (
                          <div 
                            className="pt-2 border-t"
                            dangerouslySetInnerHTML={{ __html: mapData.plotInfoLinks }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading property details...</p>
              </CardContent>
            </Card>
          ) : htmlContent ? (
            <Card>
              <CardContent className="p-0">
                <iframe
                  srcDoc={htmlContent}
                  className="w-full min-h-[800px] border-0"
                  title="Property Details Report"
                />
          
              </CardContent>
            </Card>
        
            
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No property details available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
