import type {
  OnboardingBrandKitData,
  OnboardingSession,
  VoiceValue,
} from '../../../types/onboarding';

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const toVoiceValue = (value: unknown, fallback: VoiceValue): VoiceValue =>
  value === 'high' || value === 'moderate' || value === 'low'
    ? value
    : fallback;

export const buildBrandKitData = (
  session: OnboardingSession,
  rawData?: Record<string, unknown>
): OnboardingBrandKitData => {
  const rawBrand = toRecord(rawData?.brand);
  const rawBrandVibe = toRecord(rawBrand.vibe);
  const rawVibe = toRecord(rawData?.vibe);
  const rawVoice = toRecord(rawBrandVibe.voice ?? rawVibe.voice);
  const sessionVoice = toRecord(session.brand?.vibe?.voice);
  const typography = toRecord(rawData?.typography);
  const primaryColors = toStringArray(rawData?.primaryColors);
  const secondaryColors = toStringArray(rawData?.secondaryColors);
  const brandName = toString(rawData?.brandName);
  const logoText = toString(rawData?.logoText);
  const vibe = toString(rawData?.vibe);
  const vibeKeywords = toStringArray(rawData?.vibeKeywords);
  const rawVibeKeywords = toStringArray(rawVibe.keywords);
  const heading = toString(typography.heading);
  const body = toString(typography.body);
  const typographyDescription = toString(typography.description);
  const sessionPrimaryColors = session.brand?.colors?.primary ?? [];
  const sessionSecondaryColors = session.brand?.colors?.secondary ?? [];
  const sessionOthersColors = session.brand?.colors?.others ?? [];
  const rawOthersFlat = toStringArray(rawData?.others);
  const rawBrandColors = toRecord(rawBrand.colors);
  const othersFromBrand = toStringArray(rawBrandColors.others);
  const sessionFonts = session.brand?.fonts ?? [];
  const sessionPreferredTerms = session.brand?.vibe?.preferredTerms ?? [];
  const sessionLogos = session.brand?.logos ?? [];
  const sessionProfilePhoto = session.brand?.profilePhoto ?? null;

  return {
    profilePhoto: sessionProfilePhoto,
    logos: sessionLogos,
    colors: {
      primary: primaryColors.length
        ? primaryColors
        : sessionPrimaryColors.length
          ? sessionPrimaryColors
          : [],
      secondary: secondaryColors.length
        ? secondaryColors
        : sessionSecondaryColors.length
          ? sessionSecondaryColors
          : [],
      others: rawOthersFlat.length
        ? rawOthersFlat
        : othersFromBrand.length
          ? othersFromBrand
          : sessionOthersColors.length
            ? sessionOthersColors
            : [],
    },
    fonts:
      heading || body
        ? [heading, body].filter(Boolean)
        : sessionFonts.length
          ? sessionFonts
          : [],
    assets: {
      characters: [],
      poses: [],
      backgrounds: [],
    },
    vibe: {
      archetype:
        brandName ||
        logoText ||
        session.brand?.vibe?.archetype ||
        vibeKeywords[0] ||
        rawVibeKeywords[0] ||
        '',
      description:
        vibe || typographyDescription || session.brand?.vibe?.description || '',
      preferredTerms: vibeKeywords.length
        ? vibeKeywords
        : sessionPreferredTerms.length
          ? sessionPreferredTerms
          : [],
      forbiddenTerms: [],
      voice: {
        confident: toVoiceValue(
          rawVoice.confident ?? sessionVoice.confident,
          'low'
        ),
        energetic: toVoiceValue(
          rawVoice.energetic ?? sessionVoice.energetic,
          'low'
        ),
        professional: toVoiceValue(
          rawVoice.professional ?? sessionVoice.professional,
          'low'
        ),
        trust: toVoiceValue(rawVoice.trust ?? sessionVoice.trust, 'low'),
        friendly: toVoiceValue(
          rawVoice.friendly ?? sessionVoice.friendly,
          'low'
        ),
        authority: toVoiceValue(
          rawVoice.authority ?? sessionVoice.authority,
          'low'
        ),
      },
      writingStyle: [],
    },
  };
};
