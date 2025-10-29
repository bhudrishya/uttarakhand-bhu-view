import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyMapProps {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  center_x: number;
  center_y: number;
  plotNo: string;
}

const PropertyMap = ({ xmin, ymin, xmax, ymax, center_x, center_y, plotNo }: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([center_y, center_x], 18);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add rectangle for property bounds
    const bounds: L.LatLngBoundsExpression = [
      [ymin, xmin],
      [ymax, xmax]
    ];
    L.rectangle(bounds, {
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.2
    }).addTo(map);

    // Add marker at center
    const marker = L.marker([center_y, center_x]).addTo(map);
    marker.bindPopup(`Plot No: ${plotNo}`);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [xmin, ymin, xmax, ymax, center_x, center_y, plotNo]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default PropertyMap;
