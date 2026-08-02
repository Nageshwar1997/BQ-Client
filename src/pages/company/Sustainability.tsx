import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

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

const BeautiniqueLink = () => (
  <Link to={ROUTES.HOME} className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);

const Sustainability = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:leaf-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Sustainability at Beautinique"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Beauty shouldn&apos;t cost the planet. Here&apos;s how we&apos;re working to make{' '}
          <BeautiniqueLink /> a little kinder to the environment, one order at a time.
        </p>
      </div>

      <Divider />

      {/* Our Commitment */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Our Commitment"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We know the beauty industry has a real environmental footprint &mdash; from packaging
          waste to shipping emissions. We can&apos;t fix that overnight, but we&apos;re building
          sustainability into how we choose sellers, package orders, and ship products, and we
          intend to keep improving as we grow.
        </p>
      </section>

      {/* Pillars */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Our Sustainability Pillars"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SUSTAINABILITY_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={pillar.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{pillar.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packaging & Waste */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Packaging & Waste Reduction"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We package orders to minimize excess material while still keeping your products safe in
          transit, and we favor recyclable packaging wherever we can. When a seller offers a
          refillable or low-waste version of a product, we make that clear on the listing so you can
          choose it over the standard packaging.
        </p>
      </section>

      {/* Cruelty-Free & Ethical Sourcing */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Cruelty-Free & Ethical Sourcing"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          As a marketplace, we don&apos;t manufacture every product we sell &mdash; but we do choose
          who we work with. We prioritize sellers and brands that avoid animal testing and are
          transparent about where their ingredients come from, so you can shop with a clearer
          conscience.
        </p>
      </section>

      {/* Carbon-Conscious Operations */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Carbon-Conscious Operations"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Where possible, we consolidate shipments and work with carriers on optimized delivery
          routes to reduce the number of trips needed to get your order to you. It&apos;s a small
          lever, but one we intend to keep pulling as our seller and delivery network grows.
        </p>
      </section>

      {/* Responsible Seller Standards */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Responsible Seller Standards"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Every seller on our platform goes through a review before their products go live. As part
          of that process, we encourage sellers to share information about their sourcing,
          packaging, and environmental practices, and we highlight the ones who go the extra mile.
        </p>
      </section>

      {/* Community & Education */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Community & Education"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Small changes add up. Through our Beauty Insights articles and product guides, we share
          tips on recycling empties, choosing refillable products, and building a lower-waste beauty
          routine &mdash; so sustainability becomes part of how you shop, not just what we promise.
        </p>
      </section>

      {/* Looking Ahead */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Looking Ahead"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          This is an ongoing journey, not a finished checklist. We&apos;re continuing to work with
          sellers on more sustainable packaging options, explore lower-carbon delivery choices, and
          expand the resources we share with our community &mdash; and we&apos;ll keep this page
          updated as those efforts grow.
        </p>
      </section>

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">
            Curious About Our Standards?
          </p>
          <p className="text-secondary text-xs sm:text-sm">
            Read our{' '}
            <Link to={`/${ROUTES.COMPANY.ETHICS}`} className="inline">
              <GradientText type="accent" text="ethics standards" className="font-medium" />
            </Link>{' '}
            or get in touch if you have questions or ideas for us.
          </p>
        </div>
        <a
          href="mailto:beautinique.bq@gmail.com"
          className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Icon icon="solar:letter-linear" className="size-4.5" />
          beautinique.bq@gmail.com
        </a>
      </section>
    </div>
  );
};

export default Sustainability;
