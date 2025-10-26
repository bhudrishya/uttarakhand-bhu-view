import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, User, FileText, Calendar, Download } from "lucide-react";
import Navbar from "@/components/Navbar";

const mockProperty = {
  id: "1",
  khasraNumber: "245/1",
  ownerName: "Rajesh Kumar Sharma",
  area: "1200 sq.m",
  location: "Dehradun, Uttarakhand",
  district: "Dehradun",
  tehsil: "Sadar",
  village: "Rajpur",
  mutationDate: "15 March 2024",
  landUse: "Residential",
  coordinates: "30.3165° N, 78.0322° E",
};

const PropertyDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/search">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Property Details
            </h1>
            <p className="text-muted-foreground">
              Complete information for Khasra No: {mockProperty.khasraNumber}
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <FileText className="w-4 h-4" />
                      Khasra Number
                    </div>
                    <p className="font-semibold text-lg">{mockProperty.khasraNumber}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="w-4 h-4" />
                      Owner Name
                    </div>
                    <p className="font-semibold">{mockProperty.ownerName}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                    <p className="font-semibold">{mockProperty.location}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Area</p>
                    <p className="font-semibold">{mockProperty.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Land Use</p>
                    <p className="font-semibold">{mockProperty.landUse}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      Last Mutation
                    </div>
                    <p className="font-semibold">{mockProperty.mutationDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Administrative Details</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">District</p>
                  <p className="font-semibold">{mockProperty.district}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tehsil</p>
                  <p className="font-semibold">{mockProperty.tehsil}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Village</p>
                  <p className="font-semibold">{mockProperty.village}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Coordinates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-lg">{mockProperty.coordinates}</p>
                <div className="mt-4 flex gap-4">
                  <Link to="/map">
                    <Button variant="outline">
                      <MapPin className="w-4 h-4" />
                      View on Map
                    </Button>
                  </Link>
                  <Button variant="outline">
                    <Download className="w-4 h-4" />
                    Download RoR
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
