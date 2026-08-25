import { Navigate } from 'react-router';
import BrandOnBoardingSuccess from './index';

const STORAGE_KEY = 'onboarding-success-payload';

type BrandOnBoardingSuccessPayload = {
    sessionId?: string;
    immersivePdpProps: Parameters<typeof BrandOnBoardingSuccess>[0]['immersivePdpProps'];
};

const BrandOnBoardingSuccessPage = () => {
    const raw =
        typeof sessionStorage !== 'undefined'
            ? sessionStorage.getItem(STORAGE_KEY)
            : null;

    if (!raw) {
        return <Navigate to="/onboarding" replace />;
    }

    try {
        const payload = JSON.parse(raw) as BrandOnBoardingSuccessPayload;
        return <BrandOnBoardingSuccess {...payload} />;
    } catch {
        return <Navigate to="/onboarding" replace />;
    }
};

export default BrandOnBoardingSuccessPage;
