
// Add Google Maps API types to the global namespace
declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    addListener(event: string, callback: Function): MapsEventListener;
  }

  class Marker {
    constructor(options?: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(latLng: LatLng | LatLngLiteral): void;
  }

  class Geocoder {
    geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeId?: string;
    styles?: any[];
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string;
    animation?: number; // Changed from Animation to number to match the actual type
  }

  interface GeocoderRequest {
    address?: string;
    location?: LatLng | LatLngLiteral;
    placeId?: string;
    bounds?: LatLngBounds;
    region?: string;
  }

  interface GeocoderResult {
    geometry: {
      location: LatLng;
    };
    formatted_address: string;
  }

  interface MapsEventListener {
    remove(): void;
  }

  interface LatLngBounds {}

  const MapTypeId: {
    ROADMAP: string;
    SATELLITE: string;
    HYBRID: string;
    TERRAIN: string;
  };

  const Animation: {
    BOUNCE: number;
    DROP: number;
  };

  const GeocoderStatus: {
    OK: string;
    ZERO_RESULTS: string;
    OVER_QUERY_LIMIT: string;
    REQUEST_DENIED: string;
    INVALID_REQUEST: string;
    UNKNOWN_ERROR: string;
  };
}

