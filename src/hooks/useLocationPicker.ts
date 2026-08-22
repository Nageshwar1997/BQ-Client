import { useState } from 'react';

import { type IParsedAddress, parseAddressComponents, reverseGeocode } from '@/utils/olaMaps.util';

export interface ISelectedLocation extends IParsedAddress {
  lat: number;
  lng: number;
  formattedAddress: string;
}

// Adapted from `solar-host`'s hook of the same name - centralizes the two ways
// a location can be picked (clicking the map, "use my current location"),
// both of which need the same reverse-geocode-then-parse step.
const useLocationPicker = () => {
  const [selectedLocation, setSelectedLocation] = useState<ISelectedLocation | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');

  const selectFromCoordinates = async (lat: number, lng: number) => {
    setIsFetchingLocation(true);
    setLocationError('');

    try {
      const result = await reverseGeocode(lat, lng);

      if (!result) {
        setLocationError("Couldn't find an address for that spot - try somewhere else on the map.");
        return;
      }

      setSelectedLocation({
        lat: result.lat,
        lng: result.lng,
        formattedAddress: result.formattedAddress,
        ...parseAddressComponents(result.formattedAddress, result.components),
      });
    } catch {
      setLocationError('Something went wrong looking up that location. Please try again.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const useCurrentLocation = () => {
    setIsFetchingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        void selectFromCoordinates(coords.latitude, coords.longitude);
      },
      () => {
        setIsFetchingLocation(false);
        setLocationError(
          'Could not access your location - check your browser/device permissions and try again.',
        );
      },
    );
  };

  return {
    selectedLocation,
    setSelectedLocation,
    selectFromCoordinates,
    useCurrentLocation,
    isFetchingLocation,
    locationError,
  };
};

export default useLocationPicker;
