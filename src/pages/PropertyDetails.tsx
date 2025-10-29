import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
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
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false);

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
      data.center_x=lon;
      data.center_y=lat;
      const [lonmax, latmax] = toLatLon(data.xmax, data.ymax);
      data.xmax=lonmax; 
      data.ymax=latmax;
      const [lonmin, latmin] = toLatLon(data.xmin, data.ymin);
      data.xmin=lonmin; 
      data.ymin=latmin;
      
      // Navigate to map view page with map data
      navigate('/property/map', { 
        state: { 
          ...data,
          propertyState: location.state 
        } 
      });
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
