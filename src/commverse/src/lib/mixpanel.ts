type MixpanelPeople = {
  set: (properties: Record<string, string>) => void;
};

type MixpanelClient = {
  identify: (distinctId: string) => void;
  people?: MixpanelPeople;
  track: (
    eventName: string,
    properties?: Record<string, string | number | boolean>
  ) => void;
};

declare global {
  interface Window {
    mixpanel?: MixpanelClient;
  }
}

const getMixpanel = () => {
  if (typeof window === 'undefined') return null;
  return window.mixpanel ?? null;
};

export const trackUserLogin = (email?: string | null) => {
  if (!email) return;

  const mixpanel = getMixpanel();
  if (!mixpanel) return;

  mixpanel.identify(email);
  mixpanel.people?.set({
    $user_id: email,
    $email: email,
  });
  mixpanel.track('log_in', {
    $user_id: email,
    $email: email,
  });
};

