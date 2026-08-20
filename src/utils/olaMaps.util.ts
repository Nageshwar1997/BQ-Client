import { COUNTRIES, STATES_AND_UTS } from '@beautinique/frontend-constants';
import type { TCountry, TStateOrUT } from '@beautinique/frontend-types';

import envs from '@/envs';

export interface IParsedAddress {
  line1: string;
  line2?: string;
  city?: string;
  state?: TStateOrUT;
  pincode?: string;
  country?: TCountry;
}

// Ola Maps' `address_components` (geocode + reverse-geocode) mirror Google's
// shape verbatim - `types`/`short_name`/`long_name` - confirmed live against
// their OpenAPI spec while migrating off `@vis.gl/react-google-maps`, so
// there's no ambient `google.maps.*` namespace to lean on anymore, just this
// small local shape.
export interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

const OLA_MAPS_BASE_URL = 'https://api.olamaps.io';

// Ola's `administrative_area_level_1.long_name` doesn't always match our
// `STATES_AND_UTS` enum verbatim (same situation as Google was) - a loose
// two-way substring match covers every real case without hardcoding a full
// alias table. Also used server-side (`organization-service`'s
// `verifyStateFromPincode`) - keep both in sync if this logic ever changes.
export const matchState = (olaStateName: string | undefined): TStateOrUT | undefined => {
  if (!olaStateName) return undefined;
  const needle = olaStateName.toLowerCase();
  return STATES_AND_UTS.find((state) => {
    const haystack = state.toLowerCase();
    return haystack.includes(needle) || needle.includes(haystack);
  });
};

const getComponent = (components: IAddressComponent[] | undefined, type: string) =>
  components?.find((component) => component.types.includes(type))?.long_name;

export const parseAddressComponents = (
  components: IAddressComponent[] | undefined,
  fallbackLine1?: string,
): IParsedAddress => {
  const streetNumber = getComponent(components, 'street_number');
  const route = getComponent(components, 'route');
  const sublocality =
    getComponent(components, 'sublocality_level_1') ?? getComponent(components, 'sublocality');
  const city =
    getComponent(components, 'locality') ?? getComponent(components, 'administrative_area_level_2');
  const state = matchState(getComponent(components, 'administrative_area_level_1'));
  const pincode = getComponent(components, 'postal_code');
  const countryName = getComponent(components, 'country');
  const country = COUNTRIES.find((value) => value === countryName);

  const line1 = [streetNumber, route].filter(Boolean).join(' ') || (fallbackLine1 ?? '');

  return { line1, line2: sublocality, city, state, pincode, country };
};

interface IGeocodeResult {
  formattedAddress: string;
  lat: number;
  lng: number;
  components: IAddressComponent[];
}

/** Reverse geocode: coordinates -> address. Used for map-click and "use my current location". */
export const reverseGeocode = async (lat: number, lng: number): Promise<IGeocodeResult | null> => {
  const url = new URL(`${OLA_MAPS_BASE_URL}/places/v1/reverse-geocode`);
  url.searchParams.set('latlng', `${String(lat)},${String(lng)}`);
  url.searchParams.set('api_key', envs.ola_maps.api_key);

  const response = await fetch(url);
  const data = (await response.json()) as {
    status: string;
    results: {
      formatted_address: string;
      geometry: { location: { lat: number; lng: number } };
      address_components: IAddressComponent[];
    }[];
  };

  const result = data.results[0];
  if (data.status !== 'ok' || !result) return null;

  return {
    formattedAddress: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    components: result.address_components,
  };
};

/** Forward geocode: a text query (e.g. a pincode) -> address components. Used to cross-check that a manually-typed pincode actually falls in the manually-selected state. */
export const geocodeQuery = async (query: string): Promise<IAddressComponent[] | null> => {
  const url = new URL(`${OLA_MAPS_BASE_URL}/places/v1/geocode`);
  url.searchParams.set('address', query);
  url.searchParams.set('api_key', envs.ola_maps.api_key);

  const response = await fetch(url);
  const data = (await response.json()) as {
    status: string;
    geocodingResults: { address_components: IAddressComponent[] }[];
  };

  const result = data.geocodingResults[0];
  if (data.status !== 'ok' || !result) return null;

  return result.address_components;
};

/** Best-effort: does `pincode` actually fall in `claimedState`? `undefined` = "couldn't tell" (API down/unrecognized pincode) - never treat that as a confirmed mismatch, mirrors the server-side check (assignment plan doc, section 5.5 - graceful degrade). */
export const verifyPincodeMatchesState = async (
  pincode: string,
  claimedState: TStateOrUT,
): Promise<boolean | undefined> => {
  try {
    const components = await geocodeQuery(`${pincode}, India`);
    const derivedState = matchState(
      getComponent(components ?? undefined, 'administrative_area_level_1'),
    );
    if (!derivedState) return undefined;
    return derivedState === claimedState;
  } catch {
    return undefined;
  }
};
