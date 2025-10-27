import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const PropertyDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

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
