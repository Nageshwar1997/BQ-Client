import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import "./GoogleMap.css";
import Button from "../../../components/button/Button";
import { NavigationIcon } from "../../../icons";
import ShowApiStatus from "../../../components/api-status/ShowApiStatus";

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
    name: "Jaishambho Beauty Store",
    address: "Amdura, Nanded, India",
    lat: 19.0,
    lng: 77.0,
    phone: "+91 12345 67890",
    hours: "10 AM - 8 PM",
  },
];

const StoresGMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 19.12875937998702,
    lng: 77.40966032992965,
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
        (err) => console.error("Error getting location:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    if (isLoaded && hoveredStore) {
      // wait for InfoWindow DOM to be inserted
      const timer = setTimeout(() => {
        const imgDiv = document.querySelector(".gm-style-iw-ch");
        const closeIconDiv = document.querySelector(".gm-ui-hover-effect");
        if (imgDiv && !imgDiv.querySelector("img.custom-logo")) {
          const img = document.createElement("img");
          img.src = "/images/logo/BQ_gradient_logo.webp";
          img.alt = "Appended Image";
          img.className = "custom-logo";
          img.loading = "eager";
          imgDiv.prepend(img);
        }

        if (closeIconDiv && !closeIconDiv.querySelector(".custom-close-icon")) {
          const closeIcon = document.createElement("img");
          closeIcon.src = `/icons/close.svg`;
          closeIcon.alt = "Appended Image";
          closeIcon.className = "custom-close-icon";
          closeIcon.loading = "eager";
          closeIconDiv.prepend(closeIcon);
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [hoveredStore, isLoaded]);
  return (
    <div className="w-full h-[50dvh] md:h-[40dvh] lg:h-[500px] rounded-xl overflow-hidden shadow-lg shadow-primary-30">
      {isLoaded ? (
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
              <div className="relative p-2 border border-primary-30 rounded-lg text-xs font-metropolis">
                <h3 className="font-bold mb-1">{hoveredStore.name}</h3>
                <p className="text-[11px]">{hoveredStore.address}</p>
                <p className="text-[11px]">Phone: {hoveredStore.phone}</p>
                <p className="text-[11px]">Hours: {hoveredStore.hours}</p>
                <Link
                  to={`https://www.google.com/maps/dir/?api=1&destination=${hoveredStore.lat},${hoveredStore.lng}`}
                  target="_blank"
                  className="block mt-2"
                >
                  <Button
                    content="Navigate"
                    pattern="primary"
                    className="!py-1 !px-2 !rounded !text-xs max-w-40 mx-auto gap-1.5"
                    rightIcon={
                      <NavigationIcon
                        className="w-4 h-4 stroke-white"
                        strokeWidth={2.2}
                      />
                    }
                  />
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <ShowApiStatus
          headingText="Something went wrong!"
          descriptionText="Please try again later."
          loadingText="Loading G-Map"
          type={loadError ? "error" : "loading"}
        />
      )}
    </div>
  );
};

export default StoresGMap;
