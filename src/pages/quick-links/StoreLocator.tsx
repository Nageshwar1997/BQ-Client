import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [hoveredStore, setHoveredStore] = useState<Store | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 19.0,
    lng: 77.0,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Error getting user location:", err);
        }
      );
    }
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Map Section */}
      <div className="w-full lg:w-2/3 h-[600px] rounded-xl overflow-hidden shadow-lg">
        <GoogleMap
          zoom={6.5}
          center={center}
          mapContainerClassName="w-full h-full"
        >
          {stores.map((store) => (
            <Marker
              onMouseOver={() => setHoveredStore(store)}
              onMouseOut={() => setHoveredStore(null)}
              key={store.id}
              position={{ lat: store.lat, lng: store.lng }}
              title={store.name}
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`,
                  "_blank"
                )
              }
            />
          ))}
        </GoogleMap>
      </div>
      {/* Store Details */}
      <div className="w-full lg:w-1/3 space-y-4">
        {stores.map((store) => (
          <div key={store.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">{store.name}</h3>
            <p>{store.address}</p>
            <p>Phone: {store.phone}</p>
            <p>Hours: {store.hours}</p>
            <Link
              to={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 underline hover:text-blue-800"
            >
              Get Directions
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreLocator;
