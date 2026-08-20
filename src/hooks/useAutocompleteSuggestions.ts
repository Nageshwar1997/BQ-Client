import { useEffect, useRef, useState } from 'react';

import envs from '@/envs';

export interface IPlacePrediction {
  description: string;
  mainText: string;
  secondaryText: string;
  lat: number;
  lng: number;
}

interface IOlaAutocompleteResponse {
  status: string;
  predictions: {
    description: string;
    structured_formatting: { main_text: string; secondary_text: string };
    geometry: { location: { lat: number; lng: number } };
  }[];
}

// Unlike the old Google-based hook, Ola Maps' Autocomplete API needs no
// session-token dance (not part of its request shape at all - confirmed
// against the live OpenAPI spec) and returns each prediction's lat/lng
// inline, so there's no separate "place details" round-trip needed to
// resolve a click into coordinates (see `LocationPickerModal.tsx`'s
// `handleSuggestionClick`) - a plain debounced-input-in, fetch-out hook.
const useAutocompleteSuggestions = (inputString: string) => {
  const [suggestions, setSuggestions] = useState<IPlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Guards against an in-flight request for a stale `inputString` resolving
  // after a newer one and clobbering its results.
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!inputString.trim()) {
      // Clearing suggestions as the input empties is a genuine
      // sync-to-external-input-prop case, not computable during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);

    // No region-restriction param to set here (unlike Google's old
    // `includedRegionCodes`) - Ola Maps is India-only by design, which
    // already matches this wizard's `STATES_AND_UTS` (India-only too).
    const url = new URL('https://api.olamaps.io/places/v1/autocomplete');
    url.searchParams.set('input', inputString);
    url.searchParams.set('api_key', envs.ola_maps.api_key);

    fetch(url)
      .then((response) => response.json() as Promise<IOlaAutocompleteResponse>)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setSuggestions(
          data.status === 'ok'
            ? data.predictions.map((prediction) => ({
                description: prediction.description,
                mainText: prediction.structured_formatting.main_text,
                secondaryText: prediction.structured_formatting.secondary_text,
                lat: prediction.geometry.location.lat,
                lng: prediction.geometry.location.lng,
              }))
            : [],
        );
      })
      .catch(() => {
        if (requestId === requestIdRef.current) setSuggestions([]);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });
  }, [inputString]);

  return { suggestions, isLoading };
};

export default useAutocompleteSuggestions;
