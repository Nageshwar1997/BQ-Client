import { Link } from 'react-router-dom';

import {
  BeautiniqueLink,
  EmailUsAction,
  HighlightNote,
  InfoCardGrid,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const ETHICAL_PRINCIPLES = [
  {
    icon: 'solar:eye-linear',
    title: 'Honesty & Transparency',
    description: 'Product descriptions, pricing, and policies say exactly what they mean.',
  },
  {
    icon: 'solar:forbidden-circle-linear',
    title: 'Zero Tolerance for Counterfeits',
    description: 'Sellers found listing counterfeit or misrepresented products are removed.',
  },
  {
    icon: 'solar:scale-linear',
    title: 'Fair Seller Treatment',
    description: 'Clear, consistent rules applied the same way to every seller on the platform.',
  },
  {
    icon: 'solar:lock-keyhole-linear',
    title: 'Data Privacy',
    description: 'Your personal data is handled with care and never sold to third parties.',
  },
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Inclusive & Non-Discriminatory',
    description: 'A platform that welcomes every shopper and seller, regardless of background.',
  },
  {
    icon: 'solar:hand-heart-linear',
    title: 'Cruelty-Free Commitment',
    description: 'We prioritize brands and sellers who don’t test their products on animals.',
  },
] as const;

const Ethics = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:shield-star-linear"
        title="Our Ethics Standards"
        description="Running a marketplace means people trust us with their money, their data, and their time. Here's how we try to earn that trust, every day."
      />

      <Divider />

      <StaticPageSection title="Our Ethical Principles">
        <InfoCardGrid items={ETHICAL_PRINCIPLES} />
      </StaticPageSection>

      <StaticPageSection title="Seller Code of Conduct" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Every seller on <BeautiniqueLink /> agrees to list only genuine products with accurate
          descriptions, honor the return and refund policies shown at checkout, and disclose
          sourcing and ingredient information honestly. Sellers who mislead shoppers, misrepresent
          products, or manipulate reviews are removed from the marketplace.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Customer Data Ethics" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We collect only the data we actually need to run the platform, we never sell it, and we
          give you control over your own information &mdash; from editing your profile to requesting
          deletion. The specifics live in our{' '}
          <Link to={`/${ROUTES.LEGAL.PRIVACY_POLICY}`} className="inline">
            <GradientText type="accent" text="Privacy Policy" className="font-medium" />
          </Link>
          .
        </p>
      </StaticPageSection>

      <StaticPageSection title="Inclusion & Non-Discrimination" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Beauty comes in every shade, budget, and identity. We hold sellers, staff, and our own
          product decisions to the same standard: no discrimination based on race, gender, religion,
          disability, sexual orientation, or any other protected characteristic &mdash; whether in
          hiring, seller onboarding, or how products are marketed on our platform.
        </p>
      </StaticPageSection>

      <HighlightNote title="Reporting a Concern">
        If you come across a listing, seller, or review that feels dishonest, discriminatory, or
        unsafe, please tell us. Every report is reviewed by our team, and we take appropriate action
        &mdash; up to and including removing the seller or listing involved.
      </HighlightNote>

      <StaticPageSection title="Related Policies" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          These standards work alongside our{' '}
          <Link to={`/${ROUTES.LEGAL.TERMS_CONDITIONS}`} className="inline">
            <GradientText type="accent" text="Terms & Conditions" className="font-medium" />
          </Link>
          ,{' '}
          <Link to={`/${ROUTES.LEGAL.PRIVACY_POLICY}`} className="inline">
            <GradientText type="accent" text="Privacy Policy" className="font-medium" />
          </Link>
          , and{' '}
          <Link to={`/${ROUTES.COMPANY.SUSTAINABILITY}`} className="inline">
            <GradientText type="accent" text="Sustainability Commitments" className="font-medium" />
          </Link>
          .
        </p>
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="See Something Off?"
        description="Reach out and let us know — we take every report seriously."
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default Ethics;
