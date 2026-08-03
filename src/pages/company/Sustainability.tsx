import { Link } from 'react-router-dom';

import {
  BeautiniqueLink,
  EmailUsAction,
  InfoCardGrid,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const SUSTAINABILITY_PILLARS = [
  {
    icon: 'solar:box-linear',
    title: 'Sustainable Packaging',
    description: 'Recyclable and reduced packaging across products we ship directly.',
  },
  {
    icon: 'solar:hand-heart-linear',
    title: 'Cruelty-Free & Ethical',
    description: 'We favor sellers and brands who never test on animals.',
  },
  {
    icon: 'solar:delivery-linear',
    title: 'Carbon-Conscious Delivery',
    description: 'Consolidated shipments and optimized routes to cut emissions.',
  },
  {
    icon: 'solar:refresh-circle-linear',
    title: 'Refill & Reuse',
    description: 'We highlight refillable and reusable packaging options where available.',
  },
  {
    icon: 'solar:shield-check-linear',
    title: 'Responsible Sellers',
    description: 'Sellers are encouraged to disclose sourcing and environmental practices.',
  },
  {
    icon: 'solar:book-linear',
    title: 'Community Education',
    description: 'Guides and articles that help you make more sustainable beauty choices.',
  },
] as const;

const Sustainability = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:leaf-linear"
        title="Sustainability at Beautinique"
        description={
          <>
            Beauty shouldn&apos;t cost the planet. Here&apos;s how we&apos;re working to make{' '}
            <BeautiniqueLink /> a little kinder to the environment, one order at a time.
          </>
        }
      />

      <Divider />

      <StaticPageSection title="Our Commitment" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We know the beauty industry has a real environmental footprint &mdash; from packaging
          waste to shipping emissions. We can&apos;t fix that overnight, but we&apos;re building
          sustainability into how we choose sellers, package orders, and ship products, and we
          intend to keep improving as we grow.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Our Sustainability Pillars">
        <InfoCardGrid items={SUSTAINABILITY_PILLARS} />
      </StaticPageSection>

      <StaticPageSection title="Packaging & Waste Reduction" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We package orders to minimize excess material while still keeping your products safe in
          transit, and we favor recyclable packaging wherever we can. When a seller offers a
          refillable or low-waste version of a product, we make that clear on the listing so you can
          choose it over the standard packaging.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Cruelty-Free & Ethical Sourcing" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          As a marketplace, we don&apos;t manufacture every product we sell &mdash; but we do choose
          who we work with. We prioritize sellers and brands that avoid animal testing and are
          transparent about where their ingredients come from, so you can shop with a clearer
          conscience.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Carbon-Conscious Operations" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Where possible, we consolidate shipments and work with carriers on optimized delivery
          routes to reduce the number of trips needed to get your order to you. It&apos;s a small
          lever, but one we intend to keep pulling as our seller and delivery network grows.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Responsible Seller Standards" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Every seller on our platform goes through a review before their products go live. As part
          of that process, we encourage sellers to share information about their sourcing,
          packaging, and environmental practices, and we highlight the ones who go the extra mile.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Community & Education" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Small changes add up. Through our Beauty Insights articles and product guides, we share
          tips on recycling empties, choosing refillable products, and building a lower-waste beauty
          routine &mdash; so sustainability becomes part of how you shop, not just what we promise.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Looking Ahead" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          This is an ongoing journey, not a finished checklist. We&apos;re continuing to work with
          sellers on more sustainable packaging options, explore lower-carbon delivery choices, and
          expand the resources we share with our community &mdash; and we&apos;ll keep this page
          updated as those efforts grow.
        </p>
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Curious About Our Standards?"
        description={
          <>
            Read our{' '}
            <Link to={`/${ROUTES.COMPANY.ETHICS}`} className="inline">
              <GradientText type="accent" text="ethics standards" className="font-medium" />
            </Link>{' '}
            or get in touch if you have questions or ideas for us.
          </>
        }
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default Sustainability;
