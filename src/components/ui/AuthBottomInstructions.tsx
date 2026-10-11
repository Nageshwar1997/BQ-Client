import { AuthBottomInstructions as AuthInstructions } from '@beautinique/frontend-components/auth';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.constants';

/** The small print under the auth forms: the package's, with the routes of this app. */
const AuthBottomInstructions = () => (
  <AuthInstructions
    as={Link}
    terms={{ to: `/${ROUTES.LEGAL.TERMS_CONDITIONS}` }}
    privacy={{ to: `/${ROUTES.LEGAL.PRIVACY_POLICY}` }}
  />
);

export default AuthBottomInstructions;
