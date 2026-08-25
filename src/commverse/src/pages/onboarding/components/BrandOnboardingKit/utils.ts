import type { OnboardingBrandKitData } from '../../../../types/onboarding';
import { getImageUrl } from '../../../../lib/utils';
import type { ApiBrandData, ApiBrandItem } from './types';

export const mapBrandDataToKitData = (
  brand: ApiBrandData | undefined,
  fallback: OnboardingBrandKitData
): OnboardingBrandKitData => {
  const kit = brand?.kit;
  const characters = ((kit?.assets?.characters ?? []) as ApiBrandItem[]).map(
    (item) => ({
      id: item._id ?? crypto.randomUUID(),
      image: getImageUrl(item.image, '') ?? '',
      name: item.name ?? '',
      tag: item.tag ?? '',
    })
  );
  const poses = ((kit?.assets?.poses ?? []) as ApiBrandItem[]).map((item) => ({
    id: item._id ?? crypto.randomUUID(),
    image: getImageUrl(item.image, '') ?? '',
    name: item.name ?? '',
    tag: item.tag ?? '',
  }));
  const backgrounds = ((kit?.assets?.backgrounds ?? []) as ApiBrandItem[]).map(
    (item) => ({
      id: item._id ?? crypto.randomUUID(),
      image: getImageUrl(item.image, '') ?? '',
      name: item.name ?? '',
      tag: item.tag ?? '',
    })
  );
  const writingStyle = (kit?.vibe?.writingStyle ?? []).map((item) => ({
    id: item._id ?? crypto.randomUUID(),
    name: item.name ?? '',
    instruction: item.instruction ?? '',
    tag: item.tag ?? '',
  }));

  return {
    colors: {
      primary: kit?.colors?.primary?.length
        ? kit.colors.primary
        : fallback.colors.primary,
      secondary: kit?.colors?.secondary?.length
        ? kit.colors.secondary
        : fallback.colors.secondary,
      others: kit?.colors?.others?.length
        ? kit.colors.others
        : fallback.colors.others,
    },
    fonts: kit?.fonts?.length ? kit.fonts : fallback.fonts,
    assets: {
      characters: characters.length ? characters : fallback.assets.characters,
      poses: poses.length ? poses : fallback.assets.poses,
      backgrounds: backgrounds.length
        ? backgrounds
        : fallback.assets.backgrounds,
    },
    vibe: {
      ...fallback.vibe,
      archetype: kit?.vibe?.archetype ?? fallback.vibe.archetype,
      description: kit?.vibe?.description ?? fallback.vibe.description,
      preferredTerms: kit?.vibe?.preferredTerms?.length
        ? kit.vibe.preferredTerms
        : fallback.vibe.preferredTerms,
      forbiddenTerms: kit?.vibe?.forbiddenTerms?.length
        ? kit.vibe.forbiddenTerms
        : fallback.vibe.forbiddenTerms,
      voice: {
        ...fallback.vibe.voice,
        ...(kit?.vibe?.voice ?? {}),
      },
      writingStyle: writingStyle.length ? writingStyle : null,
    },
  };
};
