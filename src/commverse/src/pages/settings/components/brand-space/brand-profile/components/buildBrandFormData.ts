import { getChangedFields } from '../../../../../../lib/utils';

const SOCIAL_LINK_KEYS = [
  'instagram',
  'facebook',
  'x',
  'tiktok',
  'youtube',
  'linkedin',
] as const;

type BrandProfileBody = {
  photo: File | string | null | undefined;
  name: string | undefined;
  email: string | undefined;
  instagram: string | undefined;
  facebook: string | undefined;
  x: string | undefined;
  tiktok: string | undefined;
  youtube: string | undefined;
  linkedin: string | undefined;
};

const buildBrandFormData = ({
  oldBody,
  newBody,
}: {
  oldBody: BrandProfileBody;
  newBody: BrandProfileBody;
}) => {
  const changedFields = getChangedFields(oldBody, newBody);

  const formData = new FormData();
  const profile: Record<string, unknown> = {};
  const socialLinks: Partial<
    Record<(typeof SOCIAL_LINK_KEYS)[number], string>
  > = {};

  Object.entries(changedFields).forEach(([key, value]) => {
    if (key === 'photo') {
      if (value instanceof File) {
        formData.append('profilePhoto', value);
      } else if (value === null || value === '') {
        profile.profilePhoto = null;
      }
      return;
    }

    if ((key === 'name' || key === 'email') && typeof value === 'string') {
      profile[key] = value;
      return;
    }

    if (SOCIAL_LINK_KEYS.includes(key as (typeof SOCIAL_LINK_KEYS)[number])) {
      if (typeof value === 'string') {
        socialLinks[key as (typeof SOCIAL_LINK_KEYS)[number]] = value;
      }
    }
  });

  if (Object.keys(socialLinks).length > 0) {
    profile.socialLinks = socialLinks;
  }

  if (Object.keys(profile).length > 0) {
    formData.append('profile', JSON.stringify(profile));
  }

  return formData;
};

export default buildBrandFormData;
