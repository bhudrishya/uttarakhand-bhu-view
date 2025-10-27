import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, MapPin, User, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

type District = {
  district_name: string;
  district_code_census: string;
  district_name_english: string;
};

type Tehsil = {
  tehsil_name: string;
  tehsil_code_census: string;
  tehsil_name_english: string;
};

type Village = {
  vname: string;
  village_code_census: string;
  vname_eng: string;
  pname: string;
  flg_chakbandi: string;
  flg_survey: string;
  pargana_code_new: string;
};

type PropertyResult = {
  khata_number: string;
  khasra_number: string;
  unique_gata_id: string;
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"khasra" | "owner">("khasra");
  const [results, setResults] = useState<PropertyResult[]>([]);
  
  const [districts, setDistricts] = useState<District[]>([]);
  const [tehsils, setTehsils] = useState<Tehsil[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (selectedDistrict) {
      fetchTehsils(selectedDistrict);
      setSelectedTehsil("");
      setSelectedVillage("");
      setTehsils([]);
      setVillages([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedDistrict && selectedTehsil) {
      fetchVillages(selectedDistrict, selectedTehsil);
      setSelectedVillage("");
      setVillages([]);
    }
  }, [selectedTehsil]);

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bhulekh-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ act: 'fillDistrict' })
      });
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTehsils = async (districtCode: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bhulekh-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ act: 'fillTehsil', district_code: districtCode })
      });
      const data = await response.json();
      setTehsils(data);
    } catch (error) {
      console.error('Error fetching tehsils:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVillages = async (districtCode: string, tehsilCode: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bhulekh-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          act: 'fillVillage', 
          district_code: districtCode, 
          tehsil_code: tehsilCode 
        })
      });
      const data = await response.json();
      setVillages(data);
    } catch (error) {
      console.error('Error fetching villages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    if (!selectedVillage) {
      console.error('Please select a village before searching');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bhulekh-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          act: 'sbksn',
          kcn: searchQuery,
          vcc: selectedVillage
        })
      });
      const data = await response.json();
      console.log('Search response:', data);
      setResults(data || []);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
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
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">District</label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict} onOpenChange={(open) => open && districts.length === 0 && fetchDistricts()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.district_code_census} value={district.district_code_census}>
                            {district.district_name_english}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tehsil</label>
                    <Select value={selectedTehsil} onValueChange={setSelectedTehsil} disabled={!selectedDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Tehsil" />
                      </SelectTrigger>
                      <SelectContent>
                        {tehsils.map((tehsil) => (
                          <SelectItem key={tehsil.tehsil_code_census} value={tehsil.tehsil_code_census}>
                            {tehsil.tehsil_name_english}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Village</label>
                    <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedTehsil}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Village" />
                      </SelectTrigger>
                      <SelectContent>
                        {villages.map((village) => (
                          <SelectItem key={village.village_code_census} value={village.village_code_census}>
                            {village.vname_eng}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-2">
                    <Button
                      variant={searchType === "khasra" ? "default" : "outline"}
                      onClick={() => setSearchType("khasra")}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Khasra
                    </Button>
                    <Button
                      variant={searchType === "owner" ? "default" : "outline"}
                      onClick={() => setSearchType("owner")}
                    >
                      <User className="w-4 h-4 mr-2" />
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
                  <Button onClick={handleSearch} disabled={loading}>
                    <SearchIcon className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
              {results.map((property, index) => {
                const selectedVillageData = villages.find(v => v.village_code_census === selectedVillage);
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span>Khasra No: {property.khasra_number}</span>
                        <Link 
                          to={`/property/`}
                          state={{
                            khata_number: property.khata_number,
                            district_code: selectedDistrict,
                            tehsil_code: selectedTehsil,
                            village_code: selectedVillage,
                            pargana_code: selectedVillageData?.pargana_code_new || '',
                            fasli_code: '999'
                          }}
                        >
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Khata Number:</span>{" "}
                          <span className="font-medium">{property.khata_number}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Unique Gata ID:</span>{" "}
                          <span className="font-medium">{property.unique_gata_id}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
