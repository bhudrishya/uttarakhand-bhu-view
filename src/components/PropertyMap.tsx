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

  const MapContainerComponent = MapContainer as any;
  const TileLayerComponent = TileLayer as any;
  const RectangleComponent = Rectangle as any;
  const MarkerComponent = Marker as any;
  const PopupComponent = Popup as any;

  return (
    <MapContainerComponent
      center={center}
      zoom={18}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayerComponent
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RectangleComponent
        bounds={bounds}
        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
      />
      <MarkerComponent position={center}>
        <PopupComponent>
          Plot No: {plotNo}
        </PopupComponent>
      </MarkerComponent>
    </MapContainerComponent>
  );
};

export default PropertyMap;
