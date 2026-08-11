import { ROUTES } from '@/constants/routes.constants';

import GradientText from './GradientText';

const AuthBottomInstructions = () => {
  return (
    <p className="text-tertiary text-xs">
      Your entry or registration on the site means acceptance of the{' '}
      <GradientText
        text="Terms & Conditions"
        type="accent"
        path={`/${ROUTES.LEGAL.TERMS_CONDITIONS}`}
        className="font-medium"
      />{' '}
      of use It is one of Flytoday services and{' '}
      <GradientText
        text="Privacy Policy"
        type="accent"
        path={`/${ROUTES.LEGAL.PRIVACY_POLICY}`}
        className="font-medium"
      />{' '}
      rules.
    </p>
  );
};

export default AuthBottomInstructions;
