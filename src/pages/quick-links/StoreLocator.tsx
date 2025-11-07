import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

interface Store {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
}

const stores: Store[] = [
  {
    id: 1,
    name: "Store A",
    address: "Mumbai, India",
    lat: 19.076,
    lng: 72.8777,
    phone: "+91 12345 67890",
    hours: "10 AM - 8 PM",
  },
  {
    id: 2,
    name: "Store B",
    address: "Pune, India",
    lat: 18.5204,
    lng: 73.8567,
    phone: "+91 98765 43210",
    hours: "11 AM - 7 PM",
  },
];

const StoreLocator = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 19.0,
    lng: 77.0,
  });
  const [hoveredStore, setHoveredStore] = useState<Store | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.error("Error getting location:", err)
      );
    }
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Map */}
      <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
        <GoogleMap
          zoom={5.3}
          center={center}
          mapContainerClassName="w-full h-full"
        >
          {stores.map((store) => (
            <Marker
              key={store.id}
              position={{ lat: store.lat, lng: store.lng }}
              onMouseOver={() => setHoveredStore(store)}
            />
          ))}
          {hoveredStore && (
            <InfoWindow
              position={{ lat: hoveredStore.lat, lng: hoveredStore.lng }}
              onCloseClick={() => setHoveredStore(null)}
            >
              <div className="p-2 border border-[red]"
              >
                <h3 className="font-bold">{hoveredStore.name}</h3>
                <p>{hoveredStore.address}</p>
                <p>Phone: {hoveredStore.phone}</p>
                <p>Hours: {hoveredStore.hours}</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${hoveredStore.lat},${hoveredStore.lng}`,
                      "_blank"
                    )
                  }
                >Navigate</button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default StoreLocator;
