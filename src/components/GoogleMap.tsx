
import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  address: string;
  theme: 'dark' | 'light';
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ address, theme }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  useEffect(() => {
    // Define initMap function for the window object
    window.initMap = function() {
      if (mapRef.current) {
        const mapOptions: google.maps.MapOptions = {
          zoom: 15,
          center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: true,
          scaleControl: true,
          streetViewControl: true,
          styles: theme === 'dark' ? [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
            { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
            { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
          ] : []
        };
        
        mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
        geocoderRef.current = new google.maps.Geocoder();
      }
    };
    
    // Load Google Maps API with the updated API key
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD3SUZZIXsUR620thfkUqa-v08YrOQB52k&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      // Clean up
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Fix the TypeScript error by assigning a function instead of null
      window.initMap = function() {};
    };
  }, [theme]);
  
  // Update map when address changes
  useEffect(() => {
    if (mapInstanceRef.current && geocoderRef.current && address) {
      geocoderRef.current.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          
          // Fix the TypeScript error by checking if mapInstanceRef.current exists
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(location);
            
            new google.maps.Marker({
              map: mapInstanceRef.current,
              position: location
            });
          }
        }
      });
    }
  }, [address, mapInstanceRef.current, geocoderRef.current]);
  
  return (
    <div className={`w-full h-full rounded-lg border ${borderColor} overflow-hidden`} ref={mapRef}></div>
  );
};

declare global {
  interface Window {
    initMap: () => void;
  }
}
