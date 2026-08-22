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

/**
 * `line1`/`line2` are derived from the plain `formattedAddress` string, not
 * from individually-typed `address_components` - Ola's per-component
 * `types` tagging turned out too unreliable to build them from directly
 * (`street_number`/`route` never actually appear in practice, `locality`
 * sometimes names a *bigger* area than what shows up in the formatted
 * string - e.g. `locality` "Nanded Waghala" while the formatted address
 * itself only ever says "Nanded", confirmed live). Instead: split
 * `formattedAddress` on commas, drop every segment that exactly matches
 * `city`/`state`/`pincode`/`country` (checked against every admin-level
 * component - `locality` AND `administrative_area_level_1/2/3` - not just
 * whichever one `city` ends up picking, since the formatted string can echo
 * any of them), and split whatever's left evenly across `line1`/`line2`.
 */
export const parseAddressComponents = (
  formattedAddress: string,
  components: IAddressComponent[] | undefined,
): IParsedAddress => {
  const city =
    getComponent(components, 'locality') ?? getComponent(components, 'administrative_area_level_2');
  const stateRaw = getComponent(components, 'administrative_area_level_1');
  const state = matchState(stateRaw);
  const pincode = getComponent(components, 'postal_code');
  const countryRaw = getComponent(components, 'country');
  const country = COUNTRIES.find((value) => value === countryRaw);

  const excludedValues = new Set(
    [
      getComponent(components, 'locality'),
      stateRaw,
      getComponent(components, 'administrative_area_level_2'),
      getComponent(components, 'administrative_area_level_3'),
      pincode,
      countryRaw,
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.trim().toLowerCase()),
  );

  const remainingParts = formattedAddress
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part && !excludedValues.has(part.toLowerCase()));

  const midpoint = Math.ceil(remainingParts.length / 2);

  return {
    line1: remainingParts.slice(0, midpoint).join(', '),
    line2: remainingParts.slice(midpoint).join(', ') || undefined,
    city,
    state,
    pincode,
    country,
  };
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
