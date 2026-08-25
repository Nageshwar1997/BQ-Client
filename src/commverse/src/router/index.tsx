import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import Loader from '../components/Loader';
import MainLayout from '../layout/MainLayout';
import AssetLibrary from '../pages/3d-asset-library';
import AssetLibraryDetails from '../pages/3d-asset-library/AssetLibraryDetails';
import Auth from '../pages/auth';
import PhoneVerification from '../pages/auth/phone-verification';
import Dashboard from '../pages/dashboard';
import PrivacyPolicy from '../pages/privacy-policy';
import Settings from '../pages/settings';
import BrandKit from '../pages/settings/components/brand-space/brand-kit';
import BrandProfile from '../pages/settings/components/brand-space/brand-profile';
import Login from '../pages/settings/components/personal-account/login';
import Profile from '../pages/settings/components/personal-account/profile';
import General from '../pages/settings/components/site-settings/general';
import ManageExperiences from '../pages/settings/components/site-settings/manage-experiences';
import TermsAndConditions from '../pages/terms-and-conditions';
import VirtualStore from '../pages/virtual-store';
import { authMiddleware, userExistsMiddleware } from './middlewares';

import ProductInventory from '../pages/product-inventory';
import ProductInventoryForm from '../pages/product-inventory/components/ProductInventoryForm';
import Assets from '../pages/settings/components/brand-space/brand-kit/components/assets';
import Colors from '../pages/settings/components/brand-space/brand-kit/components/colors';
import Typography from '../pages/settings/components/brand-space/brand-kit/components/typography';
import Vibe from '../pages/settings/components/brand-space/brand-kit/components/vibe';
import PlanAndBilling from '../pages/settings/components/payments/plan-and-billing';
import ThreeDAssetVisualizer from '../pages/threedvisualizer/ThreeDAssetVisualizer';

import { useEffect } from 'react';
import NotFoundPage from '../components/NotFoundPage';
import SiteFound from '../components/SiteFound';
import { getUser } from '../lib/utils';
import ARMarkerlessAssetVisualizer from '../pages/AR/Markerless/ARMarkerlessAssetVisualizer';
import AICreativeStudio from '../pages/ai-creative-studio';
import BannerDashboard from '../pages/dashboard/BannerDashboard';
import ExperienceSettings from '../pages/experience/settings';
import Onboarding from '../pages/onboarding';
import ProductInventoryDetail from '../pages/product-inventory/ProductInventoryDetail';
import TaggedExperiences from '../pages/settings/components/site-settings/manage-experiences/components/TaggedExperiences';
import UntaggedExperiences from '../pages/settings/components/site-settings/manage-experiences/components/UntaggedExperiences';
import TryOnEditMain from '../pages/virtual-tryon/tryon[category]/TryOnEditMain';

const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
};

const RootRedirect = () => {
  const user = getUser();

  return <Navigate to="/dashboard" replace />;
};

const VersaAI = lazy(() => import('../pages/versa-ai'));
const MarkerlessAR = lazy(() => import('../pages/AR/Markerless'));
const Visualizer3D = lazy(() => import('../pages/threedvisualizer'));
const ConfiguratorLoad = lazy(() => import('../pages/configurator'));
const VirtualTryOn = lazy(() => import('../pages/virtual-tryon'));
const TryOnCategory = lazy(
  () => import('../pages/virtual-tryon/tryon[category]')
);
const FashionTryOn = lazy(() => import('../pages/fashion-tryon'));

const ConfiguratorAssetVisualizer = lazy(
  () => import('../pages/configurator/configAssetVisualizer')
);

const BrandOnBoardingSuccessPage = lazy(
  () => import('../pages/onboarding/BrandOnBoardingSuccess/page')
);
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/auth',
    element: <Auth />,
    middleware: [userExistsMiddleware()],
  },
  {
    path: '/auth/phone-verification',
    element: <PhoneVerification />,
    middleware: [authMiddleware('private')],
  },
  {
    path: '/terms-and-conditions',
    element: <TermsAndConditions />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
    middleware: [authMiddleware('private')],
  },
  {
    path: '/onboarding/success',
    element: <BrandOnBoardingSuccessPage />,
    middleware: [authMiddleware('private')],
  },
  {
    path: '/site-not-found',
    element: <SiteFound />,
  },
  {
    path: '/site-not-found',
    element: <SiteFound />,
  },
  {
    element: <MainLayout />,
    middleware: [authMiddleware('private')],
    children: [
      { path: '/home', element: <Dashboard /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/virtual-store', element: <VirtualStore /> },
      { path: '/create', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard/:bannerId', element: <BannerDashboard /> },
      { path: '/3d-asset-library', element: <AssetLibrary /> },
      { path: '/3d-asset-library/:id', element: <AssetLibraryDetails /> },
      { path: '/product-inventory', element: <ProductInventory /> },
      { path: '/product-inventory/add', element: <ProductInventoryForm /> },
      { path: '/ai-creative-studio', element: <AICreativeStudio /> },
      {
        path: '/product-inventory/edit/:id',
        element: <ProductInventoryForm />,
      },

      {
        path: '/3d-visualizer',
        element: (
          <Suspense fallback={<Loader section="3d-visualizer" />}>
            <Visualizer3D />
          </Suspense>
        ),
      },
      {
        path: '/3d-visualizer/:id',
        element: (
          <Suspense fallback={<Loader section="3d-visualizer" />}>
            <ThreeDAssetVisualizer />
          </Suspense>
        ),
      },
      {
        path: '/configurator',
        element: (
          <Suspense fallback={<Loader section="configurator" />}>
            <ConfiguratorLoad />
          </Suspense>
        ),
      },
      {
        path: '/configurator/:id',
        element: (
          <Suspense fallback={<Loader section="configurator" />}>
            <ConfiguratorAssetVisualizer />
          </Suspense>
        ),
      },
      {
        path: '/versa-ai',
        element: (
          <Suspense fallback={<Loader section="versa-ai" />}>
            <VersaAI />
          </Suspense>
        ),
      },
      {
        path: '/ar-experience',
        element: (
          <Suspense fallback={<Loader section="ar-experience" />}>
            <MarkerlessAR />
          </Suspense>
        ),
      },
      {
        path: '/ar-experience/:id',
        element: (
          <Suspense fallback={<Loader section="ar-experience" />}>
            <ARMarkerlessAssetVisualizer />
          </Suspense>
        ),
      },
      {
        path: '/product-inventory',
        element: <ProductInventory />,
      },
      { path: '/product-inventory/:id', element: <ProductInventoryDetail /> },
      {
        path: '/virtual-try-on',
        element: (
          <Suspense fallback={<Loader section="virtual-try-on" />}>
            <Outlet />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader section="virtual-try-on" />}>
                <VirtualTryOn />
              </Suspense>
            ),
          },
          {
            path: 'fashion',
            element: (
              <Suspense fallback={<Loader section="virtual-try-on" />}>
                <FashionTryOn />
              </Suspense>
            ),
          },
          {
            path: ':category/:subCategory',
            element: (
              <Suspense fallback={<Loader section="virtual-try-on" />}>
                <TryOnCategory />
              </Suspense>
            ),
          },
          {
            path: ':expId',
            element: (
              <Suspense fallback={<Loader section="virtual-try-on" />}>
                <TryOnEditMain />
              </Suspense>
            ),
          },
          {
            path: '*',
            element: <Navigate to="/404" replace />,
          },
        ],
      },
      {
        path: '/:experienceType/:id/settings',
        element: <ExperienceSettings />,
      },
      {
        path: '/settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <Navigate to="personal-account" replace />,
          },
          {
            path: 'personal-account',
            children: [
              {
                index: true,
                element: <Navigate to="profile" replace />,
              },
              {
                path: 'profile',
                element: <Profile />,
              },
              {
                path: 'login',
                element: <Login />,
              },
              // {
              //   path: 'accessibility',
              //   element: <Accessibility />,
              // },
            ],
          },
          {
            path: 'brand-space',
            children: [
              {
                index: true,
                element: <Navigate to="brand-profile" replace />,
              },
              {
                path: 'brand-profile',
                element: <BrandProfile />,
              },
              {
                path: 'brand-kit',
                element: <BrandKit />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="colors" replace />,
                  },
                  {
                    path: 'colors',
                    element: <Colors />,
                  },
                  {
                    path: 'typography',
                    element: <Typography />,
                  },
                  {
                    path: 'assets',
                    element: <Assets />,
                  },
                  {
                    path: 'vibe',
                    element: <Vibe />,
                  },
                ],
              },
            ],
          },
          {
            path: 'site-settings',
            children: [
              {
                index: true,
                element: <Navigate to="general" replace />,
              },
              {
                path: 'general',
                element: <General />,
              },
              {
                path: 'manage-experiences',
                element: <ManageExperiences />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="tagged" replace />,
                  },
                  {
                    path: 'tagged',
                    element: <TaggedExperiences />,
                  },
                  {
                    path: 'untagged',
                    element: <UntaggedExperiences />,
                  },
                ],
              },
            ],
          },
          {
            path: 'payments',
            children: [
              {
                index: true,
                element: <Navigate to="plan-and-billing" replace />,
              },
              {
                path: 'plan-and-billing',
                element: <PlanAndBilling />,
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to="/404" replace />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);
