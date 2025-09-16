import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  locations: Array<{
    id: string;
    name: string;
    address: string;
    lat?: number;
    lng?: number;
    type?: string;
    time?: string;
    patientName?: string;
  }>;
  className?: string;
}

const LocationMap = ({ locations, className = "h-96 w-full" }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: [40.7128, -74.0060], // Default to NYC
      zoom: 12,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer);
      }
    });

    if (locations.length === 0) return;

    const markers: L.Marker[] = [];
    const bounds = L.latLngBounds([]);

    // Add markers for each location
    locations.forEach((location) => {
      // For demo purposes, generate coordinates based on location name hash
      // In a real app, you'd geocode the address or have coordinates stored
      const lat = location.lat || (40.7128 + (Math.random() - 0.5) * 0.1);
      const lng = location.lng || (-74.0060 + (Math.random() - 0.5) * 0.1);

      const marker = L.marker([lat, lng]).addTo(map.current!);
      
      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-48">
          <h3 class="font-semibold text-foreground mb-2">${location.name}</h3>
          <p class="text-sm text-muted-foreground mb-1">${location.address}</p>
          ${location.patientName ? `<p class="text-sm"><strong>Patient:</strong> ${location.patientName}</p>` : ''}
          ${location.type ? `<p class="text-sm"><strong>Type:</strong> ${location.type}</p>` : ''}
          ${location.time ? `<p class="text-sm"><strong>Time:</strong> ${location.time}</p>` : ''}
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markers.push(marker);
      bounds.extend([lat, lng]);
    });

    // Fit map to show all markers
    if (markers.length > 1) {
      map.current.fitBounds(bounds, { padding: [20, 20] });
    } else if (markers.length === 1) {
      map.current.setView(markers[0].getLatLng(), 15);
    }
  }, [locations]);

  return (
    <div className={`${className} rounded-lg overflow-hidden shadow-card`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default LocationMap;