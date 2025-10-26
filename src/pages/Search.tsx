import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, MapPin, User, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const mockProperties = [
  {
    id: "1",
    khasraNumber: "245/1",
    ownerName: "Rajesh Kumar Sharma",
    area: "1200 sq.m",
    location: "Dehradun, Uttarakhand",
    district: "Dehradun",
    tehsil: "Sadar",
    village: "Rajpur",
  },
  {
    id: "2",
    khasraNumber: "156/3",
    ownerName: "Sunita Devi",
    area: "800 sq.m",
    location: "Haridwar, Uttarakhand",
    district: "Haridwar",
    tehsil: "Roorkee",
    village: "Manglaur",
  },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"khasra" | "owner">("khasra");
  const [results, setResults] = useState<typeof mockProperties>([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setResults(mockProperties);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Property Search</h1>
          <p className="text-muted-foreground mb-8">
            Search by Khasra number, owner name, or location
          </p>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex gap-2">
                  <Button
                    variant={searchType === "khasra" ? "default" : "outline"}
                    onClick={() => setSearchType("khasra")}
                  >
                    <FileText className="w-4 h-4" />
                    Khasra
                  </Button>
                  <Button
                    variant={searchType === "owner" ? "default" : "outline"}
                    onClick={() => setSearchType("owner")}
                  >
                    <User className="w-4 h-4" />
                    Owner
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder={
                    searchType === "khasra"
                      ? "Enter Khasra number (e.g., 245/1)"
                      : "Enter owner name"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <SearchIcon className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
              {results.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span>Khasra No: {property.khasraNumber}</span>
                      <Link to={`/property/${property.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Owner:</span>
                          <span className="font-medium">{property.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{property.location}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Area:</span>{" "}
                          <span className="font-medium">{property.area}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Village:</span>{" "}
                          <span className="font-medium">{property.village}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {results.length === 0 && searchQuery && (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  Try searching with a different {searchType === "khasra" ? "Khasra number" : "owner name"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
