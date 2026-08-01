import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';

const PARTNER_BENEFITS = [
  {
    icon: 'solar:global-linear',
    title: 'Reach & Visibility',
    description: 'Get your products in front of a growing community of beauty shoppers.',
  },
  {
    icon: 'solar:scale-linear',
    title: 'Fair & Transparent Terms',
    description: 'Clear commission structure and policies applied the same way to everyone.',
  },
  {
    icon: 'solar:wallet-money-linear',
    title: 'Fast Payouts',
    description: 'Reliable, on-time payments so you can focus on running your business.',
  },
  {
    icon: 'solar:presentation-graph-linear',
    title: 'Marketing Support',
    description: 'Featured placements, campaigns, and content that help you get discovered.',
  },
  {
    icon: 'solar:verified-check-linear',
    title: 'Verified Trust Badge',
    description: 'Approved partners get a visible trust signal that shoppers recognize.',
  },
  {
    icon: 'solar:headphones-round-linear',
    title: 'Dedicated Partner Support',
    description: 'A real team to help with onboarding, listings, and anything in between.',
  },
] as const;

const PARTNERSHIP_TYPES = [
  {
    icon: 'solar:shop-2-linear',
    title: 'Sell Your Products',
    description: 'List your beauty products on our marketplace and reach shoppers directly.',
  },
  {
    icon: 'solar:diagram-up-linear',
    title: 'Brand Collaborations',
    description: 'Co-marketing campaigns, launches, and features with our team.',
  },
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Affiliate & Influencer Partners',
    description: 'Earn by recommending products you love to your own audience.',
  },
  {
    icon: 'solar:box-linear',
    title: 'Bulk / Wholesale Supply',
    description: 'Supply products at scale for our marketplace sellers to list and sell.',
  },
] as const;

const PARTNER_STEPS = [
  { title: 'Apply', description: 'Tell us about your business, products, and what you’re looking for.' },
  { title: 'Review', description: 'Our team reviews your application and product details.' },
  { title: 'Onboard', description: 'Get set up with everything you need — listings, payouts, and support.' },
  { title: 'Go Live', description: 'Your products or collaboration go live for our customers to discover.' },
] as const;

const REQUIREMENTS = [
  'Accurate business and product information, provided honestly and completely.',
  'Genuine, non-counterfeit products with correct ingredient and usage details.',
  'Agreement to our marketplace standards, covering quality, pricing, and customer service.',
] as const;

const PartnerWithUs = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:rocket-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Partner With Us"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          <GradientText
            type="accent"
            text="Together, we're Unstoppable!"
            className="font-medium italic"
          />{' '}
          Whether you sell beauty products, run a brand, or have an audience that loves beauty —
          there&apos;s a place for you on Beautinique.
        </p>
      </div>

      <Divider />

      {/* Benefits */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Why Partner With Us"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PARTNER_BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={benefit.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{benefit.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Types */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Ways to Partner"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PARTNERSHIP_TYPES.map((type) => (
            <div
              key={type.title}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={type.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{type.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{type.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="How It Works"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="flex flex-col gap-3">
          {PARTNER_STEPS.map((step, index) => (
            <div
              key={step.title}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4"
            >
              <span className="bg-accent-duo flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{step.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="What You'll Need"
          className="text-xl font-semibold sm:text-2xl"
        />
        <ul className="flex flex-col gap-3">
          {REQUIREMENTS.map((requirement) => (
            <li
              key={requirement}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-3 sm:p-4"
            >
              <Icon
                icon="solar:clipboard-check-linear"
                className="text-primary/60 mt-0.5 size-4.5 shrink-0"
              />
              <span className="text-secondary text-xs sm:text-sm">{requirement}</span>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Ready to Get Started?</p>
          <p className="text-secondary text-xs sm:text-sm">
            Apply as a seller, or reach out directly for brand and affiliate partnerships.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/become-seller"
            className="bg-accent-duo flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Icon icon="solar:shop-2-linear" className="size-4.5" />
            Become a Seller
          </Link>
          <a
            href="mailto:beautinique.bq@gmail.com"
            className="border-primary/20 hover:bg-primary-invert/60 text-primary flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Icon icon="solar:letter-linear" className="size-4.5" />
            beautinique.bq@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default PartnerWithUs;
