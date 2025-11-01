import { useEffect, useRef, useState } from "react";

interface PropertyMapProps {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  center_x: number;
  center_y: number;
  plotNo: string;
}

declare const google: any;

const PropertyMap = ({
  xmin,
  ymin,
  xmax,
  ymax,
  center_x,
  center_y,
  plotNo,
}: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // --- Load Google Maps ---
  useEffect(() => {
    if (!(window as any).google) {
      const script = document.createElement("script");
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleMapsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  // --- Initialize Map ---
  useEffect(() => {
    if (!mapRef.current || !isGoogleMapsLoaded) return;

    // Normalize bounds (handle inverted coordinates)
    const south = Math.min(ymin, ymax);
    const north = Math.max(ymin, ymax);
    const west = Math.min(xmin, xmax);
    const east = Math.max(xmin, xmax);

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(south, west),
      new google.maps.LatLng(north, east)
    );

    // Initialize or reuse the map
    const map =
      mapInstanceRef.current ||
      new google.maps.Map(mapRef.current, {
        center: { lat: center_y, lng: center_x },
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
      });

    // --- Add Rectangle ---
    new google.maps.Rectangle({
      bounds,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map,
    });

    // --- Add Marker ---
    const marker = new google.maps.Marker({
      position: { lat: center_y, lng: center_x },
      map,
      title: `Plot No: ${plotNo}`,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div><strong>Plot No:</strong> ${plotNo}</div>`,
    });

    marker.addListener("click", () => infoWindow.open(map, marker));

    // --- Fit Bounds ---
    map.fitBounds(bounds);
    mapInstanceRef.current = map;
  }, [xmin, ymin, xmax, ymax, center_x, center_y, plotNo, isGoogleMapsLoaded]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
};

export default PropertyMap;
