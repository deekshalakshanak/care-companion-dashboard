import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import LocationMap from './LocationMap';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    name: string;
    address: string;
    patientName?: string;
    type?: string;
    time?: string;
  };
}

const LocationModal = ({ isOpen, onClose, location }: LocationModalProps) => {
  const handleGetDirections = () => {
    const query = encodeURIComponent(location.address);
    window.open(`https://www.openstreetmap.org/search?query=${query}`, '_blank');
  };

  const mapLocations = [{
    id: "1",
    name: location.name,
    address: location.address,
    patientName: location.patientName,
    type: location.type,
    time: location.time,
  }];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {location.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {location.address}
          </div>
          
          <LocationMap locations={mapLocations} className="h-80 w-full" />
          
          <div className="flex gap-2">
            <Button 
              onClick={handleGetDirections}
              className="flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;