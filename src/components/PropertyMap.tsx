import { MapContainer, TileLayer, Rectangle, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
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
  const center: LatLngExpression = [center_y, center_x];
  const bounds: LatLngBoundsExpression = [
    [ymin, xmin],
    [ymax, xmax]
  ];

  return (
    <MapContainer
      center={center}
      zoom={18}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      {...({} as any)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        {...({} as any)}
      />
      <Rectangle
        bounds={bounds}
        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
        {...({} as any)}
      />
      <Marker position={center} {...({} as any)}>
        <Popup {...({} as any)}>
          Plot No: {plotNo}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default PropertyMap;
