import GradientText from './GradientText';

const AuthBottomInstructions = () => {
  return (
    <p className="text-tertiary text-xs">
      Your entry or registration on the site means acceptance of the{' '}
      <GradientText
        text="Terms & Conditions"
        type="accent"
        path="/terms-conditions"
        className="font-medium"
      />{' '}
      of use It is one of Flytoday services and{' '}
      <GradientText
        text="Privacy Policy"
        type="accent"
        path="/privacy-policy"
        className="font-medium"
      />{' '}
      rules.
    </p>
  );
};

export default AuthBottomInstructions;
