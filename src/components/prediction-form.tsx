import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyFeatures } from '@/lib/ml-models';
import { Home, MapPin, Building, Bed, Bath, Calendar, Building2 } from 'lucide-react';

interface PredictionFormProps {
  onSubmit: (features: PropertyFeatures) => void;
  isLoading: boolean;
}

const CITIES = [
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'pune', label: 'Pune' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'gurgaon', label: 'Gurgaon' },
  { value: 'noida', label: 'Noida' },
  { value: 'kolkata', label: 'Kolkata' },
  { value: 'ahmedabad', label: 'Ahmedabad' },
];

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'builder-floor', label: 'Builder Floor' },
];

const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'fully-furnished', label: 'Fully Furnished' },
];

const AMENITIES = [
  { value: 'parking', label: 'Parking' },
  { value: 'gym', label: 'Gym' },
  { value: 'swimming-pool', label: 'Swimming Pool' },
  { value: 'security', label: '24/7 Security' },
  { value: 'power-backup', label: 'Power Backup' },
  { value: 'elevator', label: 'Elevator' },
  { value: 'garden', label: 'Garden' },
  { value: 'club-house', label: 'Club House' },
  { value: 'children-play-area', label: 'Children Play Area' },
  { value: 'shopping-center', label: 'Shopping Center' },
];

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState({
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: '',
    location: '',
    age: 5,
    floor: 3,
    furnishing: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features: PropertyFeatures = {
      ...formData,
      amenities: selectedAmenities,
    };
    onSubmit(features);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities(prev => 
      checked 
        ? [...prev, amenity]
        : prev.filter(a => a !== amenity)
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl bg-gradient-to-r from-ml-gradient-start to-ml-gradient-end bg-clip-text text-transparent">
          <Home className="h-6 w-6 text-primary" />
          Property Details
        </CardTitle>
        <CardDescription>
          Enter your property information to get an AI-powered price prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Area (sq ft)
              </Label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Bedrooms
              </Label>
              <Input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Bath className="h-4 w-4" />
                Bathrooms
              </Label>
              <Input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Property Age (years)
              </Label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Floor
              </Label>
              <Input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({...formData, floor: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                City
              </Label>
              <Select onValueChange={(value) => setFormData({...formData, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select onValueChange={(value) => setFormData({...formData, propertyType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Furnishing Status</Label>
            <Select onValueChange={(value) => setFormData({...formData, furnishing: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select furnishing status" />
              </SelectTrigger>
              <SelectContent>
                {FURNISHING_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES.map((amenity) => (
                <div key={amenity.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.value}
                    checked={selectedAmenities.includes(amenity.value)}
                    onCheckedChange={(checked) => 
                      handleAmenityChange(amenity.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={amenity.value}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-ml-gradient-start to-ml-gradient-end hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? 'Calculating...' : 'Predict Price'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}