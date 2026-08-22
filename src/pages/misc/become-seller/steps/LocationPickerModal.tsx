import { Icon } from '@iconify/react';
import { OlaMaps } from 'olamaps-web-sdk';
import { useEffect, useRef, useState } from 'react';

import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import Button from '@/components/ui/Button';
import envs from '@/envs';
import useAutocompleteSuggestions, {
  type IPlacePrediction,
} from '@/hooks/useAutocompleteSuggestions';
import useDebounce from '@/hooks/useDebounce';
import useLocationPicker, { type ISelectedLocation } from '@/hooks/useLocationPicker';

// India, roughly centered - shown before the applicant has picked/searched
// anything. MapLibre (which `olamaps-web-sdk` wraps) orders coordinates
// `[lng, lat]`, unlike the old `@vis.gl/react-google-maps` API which took
// `{ lat, lng }` objects - every coordinate pair below follows that order.
const DEFAULT_CENTER: [number, number] = [78.6677, 22.3511];
const DEFAULT_ZOOM = 4.5;
const SELECTED_ZOOM = 16;

interface ILocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: ISelectedLocation) => void;
}

// -------- Search box + live suggestions --------
const LocationSearch = ({
  onPlaceSelect,
}: {
  onPlaceSelect: (lat: number, lng: number) => void;
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounce = useDebounce({ callback: setDebouncedQuery, delay: 400 });
  const { suggestions, isLoading } = useAutocompleteSuggestions(debouncedQuery);

  const handleSuggestionClick = (suggestion: IPlacePrediction) => {
    setQuery('');
    setDebouncedQuery('');
    onPlaceSelect(suggestion.lat, suggestion.lng);
  };

  return (
    <div className="relative">
      <div className="border-primary/10 bg-secondary-invert flex items-center gap-2 rounded-lg border px-3">
        <Icon icon="solar:magnifer-linear" className="text-primary/40 size-4 shrink-0" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            debounce(event.target.value);
          }}
          placeholder="Search for your business address..."
          className="text-primary placeholder:text-primary/30 min-w-0 flex-1 border-none bg-transparent py-2.5 text-sm outline-hidden"
        />
      </div>

      {(isLoading || !!suggestions.length) && (
        <ul className="border-primary/10 bg-secondary-invert absolute inset-x-0 top-full z-10 mt-1.5 max-h-56 overflow-y-auto rounded-lg border shadow-lg">
          {isLoading ? (
            <li className="text-tertiary p-3 text-center text-xs">Searching...</li>
          ) : (
            suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="hover:bg-primary/5 border-primary/5 flex cursor-pointer items-start gap-2 border-b p-3 text-left last:border-none"
                onClick={() => {
                  handleSuggestionClick(suggestion);
                }}
              >
                <Icon
                  icon="solar:map-point-linear"
                  className="text-primary/40 mt-0.5 size-4 shrink-0"
                />
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="text-primary truncate text-sm font-medium">
                    {suggestion.mainText}
                  </span>
                  <span className="text-tertiary truncate text-xs">{suggestion.secondaryText}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

// `olamaps-web-sdk` ships loose `any` types for everything past `init()`
// (it's a thin wrapper around MapLibre GL, not a fully-typed SDK) - these
// narrow local shapes replace `google.maps.*` as the one place that
// looseness gets cast away, so the rest of this component stays type-safe.
interface IOlaMapInstance {
  on: {
    (event: 'click', handler: (event: { lngLat: { lat: number; lng: number } }) => void): void;
    (event: 'error', handler: (event: { error?: Error }) => void): void;
    (event: 'styleimagemissing', handler: (event: { id: string }) => void): void;
  };
  addImage: (id: string, image: { width: number; height: number; data: Uint8Array }) => void;
  flyTo: (options: { center: [number, number]; zoom: number }) => void;
  remove: () => void;
}

interface IOlaMarkerInstance {
  setLngLat: (lngLat: [number, number]) => IOlaMarkerInstance;
  addTo: (map: IOlaMapInstance) => IOlaMarkerInstance;
  remove: () => void;
}

// -------- Interactive map (click-to-place marker) --------
// Thin imperative wrapper around `olamaps-web-sdk` - unlike
// `@vis.gl/react-google-maps`, it's not a React component library, it's a
// MapLibre GL wrapper you init/tear-down yourself. Init on mount, tear down
// on unmount; the modal's contents fully unmount when closed
// (`ModalWrapper` returns `null` while `!isOpen`), so this always gets a
// clean lifecycle - no "is this the same map as last time" bookkeeping.
const MapCanvas = ({
  selected,
  onMapClick,
}: {
  selected: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<IOlaMapInstance | null>(null);
  const sdkRef = useRef<OlaMaps | null>(null);
  const markerRef = useRef<IOlaMarkerInstance | null>(null);
  // Kept in a ref so the mount effect below always calls the latest
  // `onMapClick` without needing to re-initialize the map on every change -
  // assigned from its own effect (runs after every render) rather than
  // during render, refs aren't meant to be written mid-render.
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    // Plain 2D map - this is just an address-picker, no need for the 3D
    // building tileset (`mode: '3d'` + `threedTileset`), and it was the
    // likely trigger for a style bug in Ola's own hosted default style (see
    // the `error` handler below).
    const sdk = new OlaMaps({ apiKey: envs.ola_maps.api_key });
    sdkRef.current = sdk;

    sdk
      .init({
        container,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
      })
      .then((map: IOlaMapInstance) => {
        if (cancelled) return;
        mapRef.current = map;
        map.on('click', (event) => {
          onMapClickRef.current(event.lngLat.lat, event.lngLat.lng);
        });
        // Defensive fallback (not expected to fire with `positron`, see the
        // note above) - a transparent 1x1 pixel beats MapLibre's default
        // "Image ... could not be loaded" console warning for any icon a
        // style references but doesn't actually ship in its sprite sheet.
        map.on('styleimagemissing', (event) => {
          map.addImage(event.id, { width: 1, height: 1, data: new Uint8Array(4) });
        });
        // Non-fatal style/tile errors (if any) already log through
        // MapLibre's other internal warnings - no need for a second,
        // redundant console entry from the unhandled-`error`-event default.
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        map.on('error', () => {});
      })
      .catch(() => {
        // Map tiles/style failing to load (e.g. API key not yet whitelisted
        // for this domain) shouldn't crash the wizard - `locationError` from
        // `useLocationPicker` already covers "couldn't resolve a location",
        // and every field stays manually editable regardless.
      });

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const sdk = sdkRef.current;
    if (!map || !sdk || !selected) return;

    if (markerRef.current) {
      markerRef.current.setLngLat([selected.lng, selected.lat]);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- `addMarker()`'s return type is an untyped `any`, see the note above `IOlaMapInstance`
      const marker: IOlaMarkerInstance = sdk.addMarker({ color: '#dc2626' });
      markerRef.current = marker.setLngLat([selected.lng, selected.lat]).addTo(map);
    }

    map.flyTo({ center: [selected.lng, selected.lat], zoom: SELECTED_ZOOM });
  }, [selected]);

  return <div ref={containerRef} id="map" className="h-full w-full" />;
};

const LocationPickerModal = ({ isOpen, onClose, onConfirm }: ILocationPickerModalProps) => {
  const {
    selectedLocation,
    selectFromCoordinates,
    useCurrentLocation,
    isFetchingLocation,
    locationError,
  } = useLocationPicker();

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      header={{ title: 'Pick your business address', showCloseIcon: true }}
      className="max-w-2xl"
    >
      <div className="flex w-full flex-col gap-3">
        <LocationSearch
          onPlaceSelect={(lat, lng) => {
            void selectFromCoordinates(lat, lng);
          }}
        />

        <div className="border-primary/10 relative h-80 overflow-hidden rounded-lg border">
          <MapCanvas
            selected={
              selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : null
            }
            onMapClick={(lat, lng) => {
              void selectFromCoordinates(lat, lng);
            }}
          />

          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={isFetchingLocation}
            className="bg-secondary-invert border-primary/10 text-primary absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold shadow-md disabled:opacity-60"
          >
            <Icon
              icon={isFetchingLocation ? 'solar:refresh-linear' : 'solar:gps-linear'}
              className={`size-4 ${isFetchingLocation ? 'animate-spin' : ''}`}
            />
            Use current location
          </button>
        </div>

        {locationError && <p className="text-primary-red text-xs">{locationError}</p>}

        {selectedLocation && (
          <p className="text-tertiary text-xs">
            <span className="text-primary font-medium">Selected: </span>
            {selectedLocation.formattedAddress}
          </p>
        )}

        <Button
          pattern="primary"
          content="Use this location"
          buttonProps={{
            disabled: !selectedLocation || isFetchingLocation,
            onClick: () => {
              if (selectedLocation) onConfirm(selectedLocation);
            },
          }}
        />
      </div>
    </ModalWrapper>
  );
};

export default LocationPickerModal;
