import type { OnboardingBrandKitData } from '../../../../types/onboarding';

export type SectionKey = 'characters' | 'poses' | 'backgrounds';
export type TabType = 'colors' | 'typography' | 'assets' | 'vibe';

export type ApiBrandItem = {
  _id?: string | null;
  image?: string | null;
  name?: string | null;
  tag?: string | null;
  instruction?: string | null;
};

export type ApiBrandData = {
  kit?: {
    colors?: {
      primary?: string[];
      secondary?: string[];
      others?: string[];
    };
    fonts?: string[];
    assets?: Partial<Record<SectionKey, ApiBrandItem[]>>;
    vibe?: {
      archetype?: string | null;
      description?: string | null;
      preferredTerms?: string[];
      forbiddenTerms?: string[];
      voice?: OnboardingBrandKitData['vibe']['voice'];
      writingStyle?: ApiBrandItem[];
    };
  };
};
