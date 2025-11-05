import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Ruler, IndianRupee, Phone, Mail, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Listing {
  id: string;
  district: string;
  tehsil: string;
  village: string;
  property_type: string;
  area: number;
  area_unit: string;
  expected_price: number;
  latitude: number;
  longitude: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string | null;
  description: string | null;
  created_at: string;
  photos?: { photo_url: string; is_primary: boolean }[];
}

interface District {
  name: string;
  code: string;
}

interface Tehsil {
  name: string;
  code: string;
}

interface Village {
  name: string;
  code: string;
}

const BrowseListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Location data for filters
  const [districts, setDistricts] = useState<District[]>([]);
  const [tehsils, setTehsils] = useState<Tehsil[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    district: '',
    tehsil: '',
    village: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
  });

  useEffect(() => {
    fetchListings();
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (filters.district) {
      fetchTehsils(filters.district);
    }
  }, [filters.district]);

  useEffect(() => {
    if (filters.tehsil) {
      fetchVillages(filters.district, filters.tehsil);
    }
  }, [filters.tehsil]);

  useEffect(() => {
    applyFilters();
  }, [listings, filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data: listingsData, error: listingsError } = await supabase
        .from('land_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;

      // Fetch photos for each listing
      const listingsWithPhotos = await Promise.all(
        (listingsData || []).map(async (listing) => {
          const { data: photos } = await supabase
            .from('land_listing_photos')
            .select('photo_url, is_primary')
            .eq('listing_id', listing.id)
            .order('is_primary', { ascending: false });

          return { ...listing, photos: photos || [] };
        })
      );

      setListings(listingsWithPhotos);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('bhulekh-proxy', {
        body: { action: 'fillDistrict' },
      });

      if (error) throw error;
      if (data?.districts) {
        setDistricts(data.districts);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchTehsils = async (districtCode: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('bhulekh-proxy', {
        body: { action: 'fillTehsil', districtCode },
      });

      if (error) throw error;
      if (data?.tehsils) {
        setTehsils(data.tehsils);
      }
    } catch (error) {
      console.error('Error fetching tehsils:', error);
    }
  };

  const fetchVillages = async (districtCode: string, tehsilCode: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('bhulekh-proxy', {
        body: { action: 'fillVillage', districtCode, tehsilCode },
      });

      if (error) throw error;
      if (data?.villages) {
        setVillages(data.villages);
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...listings];

    if (filters.district) {
      const districtName = districts.find((d) => d.code === filters.district)?.name;
      filtered = filtered.filter((l) => l.district === districtName);
    }

    if (filters.tehsil) {
      const tehsilName = tehsils.find((t) => t.code === filters.tehsil)?.name;
      filtered = filtered.filter((l) => l.tehsil === tehsilName);
    }

    if (filters.village) {
      const villageName = villages.find((v) => v.code === filters.village)?.name;
      filtered = filtered.filter((l) => l.village === villageName);
    }

    if (filters.propertyType) {
      filtered = filtered.filter((l) => l.property_type === filters.propertyType);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((l) => l.expected_price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((l) => l.expected_price <= parseFloat(filters.maxPrice));
    }

    if (filters.minArea) {
      filtered = filtered.filter((l) => l.area >= parseFloat(filters.minArea));
    }

    if (filters.maxArea) {
      filtered = filtered.filter((l) => l.area <= parseFloat(filters.maxArea));
    }

    setFilteredListings(filtered);
  };

  const resetFilters = () => {
    setFilters({
      district: '',
      tehsil: '',
      village: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
    });
    setTehsils([]);
    setVillages([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPropertyType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <Helmet>
        <title>Browse Land Listings - Uttarakhand BhuDrishya</title>
        <meta name="description" content="Browse and search land listings for sale in Uttarakhand. Filter by location, price, area, and property type to find your ideal land." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Browse Land Listings</h1>
            <p className="text-muted-foreground">Find your ideal land in Uttarakhand</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select
                    value={filters.district}
                    onValueChange={(value) => {
                      setFilters({ ...filters, district: value, tehsil: '', village: '' });
                      setTehsils([]);
                      setVillages([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Districts</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tehsil</Label>
                  <Select
                    value={filters.tehsil}
                    onValueChange={(value) => {
                      setFilters({ ...filters, tehsil: value, village: '' });
                      setVillages([]);
                    }}
                    disabled={!filters.district}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Tehsils" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Tehsils</SelectItem>
                      {tehsils.map((tehsil) => (
                        <SelectItem key={tehsil.code} value={tehsil.code}>
                          {tehsil.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Village</Label>
                  <Select
                    value={filters.village}
                    onValueChange={(value) => setFilters({ ...filters, village: value })}
                    disabled={!filters.tehsil}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Villages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Villages</SelectItem>
                      {villages.map((village) => (
                        <SelectItem key={village.code} value={village.code}>
                          {village.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={filters.propertyType}
                    onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="agricultural">Agricultural</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Min Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Area Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minArea}
                      onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxArea}
                      onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading listings...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No listings found matching your criteria.</p>
                <Button variant="link" onClick={resetFilters} className="mt-2">
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {listing.photos && listing.photos.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={listing.photos[0].photo_url}
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {formatPrice(listing.expected_price)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {listing.village}, {listing.tehsil}, {listing.district}
                        </CardDescription>
                      </div>
                      <Badge>{formatPropertyType(listing.property_type)}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {listing.area} {listing.area_unit.replace('_', ' ')}
                      </span>
                    </div>

                    {listing.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>
                    )}

                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${listing.contact_phone}`} className="hover:underline">
                          {listing.contact_phone}
                        </a>
                      </div>
                      {listing.contact_email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${listing.contact_email}`} className="hover:underline">
                            {listing.contact_email}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Map
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default BrowseListings;
