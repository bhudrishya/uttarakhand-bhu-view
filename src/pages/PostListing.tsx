import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MapPin, Upload, IndianRupee, Ruler } from 'lucide-react';
import Navbar from '@/components/Navbar';

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

const PostListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Location data
  const [districts, setDistricts] = useState<District[]>([]);
  const [tehsils, setTehsils] = useState<Tehsil[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    district: '',
    tehsil: '',
    village: '',
    propertyType: 'residential' as 'residential' | 'commercial' | 'agricultural' | 'industrial',
    area: '',
    areaUnit: 'sq_meters',
    expectedPrice: '',
    latitude: '',
    longitude: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (formData.district) {
      fetchTehsils(formData.district);
    }
  }, [formData.district]);

  useEffect(() => {
    if (formData.tehsil) {
      fetchVillages(formData.district, formData.tehsil);
    }
  }, [formData.tehsil]);

  const fetchDistricts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('bhulekh-proxy', {
        body: { action: 'fillDistrict' },
      });

      if (error) throw error;
      if (data?.districts) {
        setDistricts(data.districts);
      }
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error fetching villages:', error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 photos');
      return;
    }
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to post a listing');
      navigate('/login');
      return;
    }

    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error('Please provide location coordinates');
      return;
    }

    setLoading(true);

    try {
      // Create listing
      const { data: listing, error: listingError } = await supabase
        .from('land_listings')
        .insert({
          user_id: user.id,
          district: districts.find(d => d.code === formData.district)?.name || formData.district,
          tehsil: tehsils.find(t => t.code === formData.tehsil)?.name || formData.tehsil,
          village: villages.find(v => v.code === formData.village)?.name || formData.village,
          property_type: formData.propertyType,
          area: parseFloat(formData.area),
          area_unit: formData.areaUnit,
          expected_price: parseFloat(formData.expectedPrice),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          description: formData.description,
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload photos
      setUploading(true);
      const photoUrls: string[] = [];

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.id}/${listing.id}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('land-listings')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('land-listings')
          .getPublicUrl(fileName);

        photoUrls.push(publicUrl);

        // Insert photo record
        await supabase.from('land_listing_photos').insert({
          listing_id: listing.id,
          photo_url: publicUrl,
          is_primary: i === 0,
        });
      }

      toast.success('Listing posted successfully!');
      navigate('/browse-listings');
    } catch (error: any) {
      console.error('Error posting listing:', error);
      toast.error(error.message || 'Failed to post listing');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Post Land Listing - Uttarakhand BhuDrishya</title>
        <meta name="description" content="Post your land for sale in Uttarakhand. Add details, photos, and location to connect with potential buyers." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Post Land Listing</CardTitle>
              <CardDescription>
                Fill in the details below to list your land for sale in Uttarakhand
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => {
                          setFormData({ ...formData, district: value, tehsil: '', village: '' });
                          setTehsils([]);
                          setVillages([]);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.code} value={district.code}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tehsil">Tehsil *</Label>
                      <Select
                        value={formData.tehsil}
                        onValueChange={(value) => {
                          setFormData({ ...formData, tehsil: value, village: '' });
                          setVillages([]);
                        }}
                        disabled={!formData.district}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Tehsil" />
                        </SelectTrigger>
                        <SelectContent>
                          {tehsils.map((tehsil) => (
                            <SelectItem key={tehsil.code} value={tehsil.code}>
                              {tehsil.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="village">Village *</Label>
                      <Select
                        value={formData.village}
                        onValueChange={(value) => setFormData({ ...formData, village: value })}
                        disabled={!formData.tehsil}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Village" />
                        </SelectTrigger>
                        <SelectContent>
                          {villages.map((village) => (
                            <SelectItem key={village.code} value={village.code}>
                              {village.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 30.0668"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 79.0193"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Property Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value: any) => setFormData({ ...formData, propertyType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="agricultural">Agricultural</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">Area *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="area"
                          type="number"
                          step="any"
                          placeholder="e.g., 1000"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          required
                        />
                        <Select
                          value={formData.areaUnit}
                          onValueChange={(value) => setFormData({ ...formData, areaUnit: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sq_meters">Sq. Meters</SelectItem>
                            <SelectItem value="acres">Acres</SelectItem>
                            <SelectItem value="hectares">Hectares</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedPrice">Expected Price (₹) *</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="expectedPrice"
                        type="number"
                        step="any"
                        placeholder="e.g., 5000000"
                        className="pl-10"
                        value={formData.expectedPrice}
                        onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide additional details about the property..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        type="text"
                        placeholder="Your Name"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+91 XXXXXXXXXX"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email (Optional)</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Property Photos *
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="photos">Upload Photos (Max 5)</Label>
                    <Input
                      id="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                      disabled={photos.length >= 5}
                    />
                    <p className="text-sm text-muted-foreground">
                      {photos.length}/5 photos selected
                    </p>
                  </div>

                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading || uploading}>
                  {uploading ? 'Uploading Photos...' : loading ? 'Posting...' : 'Post Listing'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default PostListing;
