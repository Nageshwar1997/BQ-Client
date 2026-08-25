import { getChangedFields } from '../../../../../../lib/utils';

const buildSettingsFormData = ({
  oldBody,
  newBody,
}: {
  oldBody: Record<string, any>;
  newBody: Record<string, any>;
}) => {
  const changedFields = getChangedFields(oldBody, newBody);

  const formData = new FormData();
  const settings: Record<string, any> = {};

  Object.entries(changedFields).forEach(([key, value]) => {
    if (key === 'lightFavicon') {
      if (value instanceof File) {
        formData.append('favicon_light', value);
      } else if (value === null) {
        formData.append('favicon_light', '');
      }
      return;
    }

    if (key === 'darkFavicon') {
      if (value instanceof File) {
        formData.append('favicon_dark', value);
      } else if (value === null) {
        formData.append('favicon_dark', '');
      }
      return;
    }

    if (key === 'socialSharingImage') {
      if (value instanceof File) {
        formData.append('socialImage', value);
      } else if (value === null) {
        formData.append('socialImage', '');
      }
      return;
    }

    if (key === 'domains') {
      settings.domains = value;
      return;
    }

    if (key === 'enableCookies') {
      settings.cookieConsent = value;
      return;
    }

    if (key === 'googleAnalyticsId') {
      settings.googleAnalyticsMeasurementId = value;
      return;
    }

    if (key === 'title' || key === 'description' || key === 'language') {
      settings.site = settings.site || {};
      settings.site[key] = value;
      return;
    }

    settings[key] = value;
  });

  if (Object.keys(settings).length > 0) {
    formData.append('settings', JSON.stringify(settings));
  }

  return formData;
};

export default buildSettingsFormData;
