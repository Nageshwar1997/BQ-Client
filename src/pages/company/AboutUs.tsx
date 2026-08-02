import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const WHAT_WE_STAND_FOR = [
  {
    icon: 'solar:medal-star-linear',
    title: 'Curated Quality',
    description: 'Every product on our shelves is chosen and vetted for genuine quality.',
  },
  {
    icon: 'solar:heart-linear',
    title: 'Inclusive Beauty',
    description: 'Beauty for every skin tone, skin type, and budget — no exceptions.',
  },
  {
    icon: 'solar:shield-check-linear',
    title: 'Trusted Marketplace',
    description: 'Every seller on our platform is verified before their products go live.',
  },
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Community-Driven',
    description: 'Real reviews from real customers guide what we carry and recommend.',
  },
  {
    icon: 'solar:leaf-linear',
    title: 'Sustainability-Minded',
    description: 'We favor sellers and brands who care about their environmental footprint.',
  },
  {
    icon: 'solar:hand-stars-linear',
    title: 'Customer-First',
    description: 'From browsing to delivery, every decision starts with your experience.',
  },
] as const;

const OUR_VALUES = [
  {
    icon: 'solar:verified-check-linear',
    title: 'Authenticity',
    description: 'What you see is what you get — no counterfeit products, ever.',
  },
  {
    icon: 'solar:hand-heart-linear',
    title: 'Integrity',
    description: 'Honest pricing, honest descriptions, and honest customer support.',
  },
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Inclusivity',
    description: 'A platform where every shade, skin type, and shopper feels represented.',
  },
  {
    icon: 'solar:lightbulb-linear',
    title: 'Innovation',
    description: 'From virtual try-on to smart recommendations, we keep pushing forward.',
  },
] as const;

const WHY_SHOP_WITH_US = [
  {
    icon: 'solar:shop-2-linear',
    title: 'Verified Marketplace Sellers',
    description: 'Every seller is reviewed before they can list products on Beautinique.',
  },
  {
    icon: 'solar:magic-stick-2-linear',
    title: 'Virtual Try-On',
    description: 'Preview shades and products live through your camera before you buy.',
  },
  {
    icon: 'solar:chat-round-line-linear',
    title: 'Genuine Reviews',
    description: 'Ratings and reviews come only from customers who actually bought the product.',
  },
  {
    icon: 'solar:lock-keyhole-linear',
    title: 'Secure Checkout',
    description: 'Your payment and account data are encrypted, every step of the way.',
  },
  {
    icon: 'solar:undo-left-linear',
    title: 'Easy Returns',
    description: 'A straightforward return and refund policy, with no hidden conditions.',
  },
  {
    icon: 'solar:delivery-linear',
    title: 'Reliable Delivery',
    description: 'Clear delivery timelines so you always know when your order will arrive.',
  },
] as const;

const BeautiniqueLink = () => (
  <Link to={ROUTES.HOME} className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);

const AboutUs = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:bag-heart-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="About Beautinique"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Pronounced <GradientText type="accent" text="Beauty-Unique" className="font-medium" />{' '}
          &mdash; a marketplace built around one idea: everyone deserves beauty products that
          actually work for them.
        </p>
      </div>

      <Divider />

      {/* Our Story */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Our Story"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <BeautiniqueLink /> started with a simple frustration: shopping for cosmetics online often
          meant guessing whether a shade would actually suit you, whether a seller could be trusted,
          or whether a glowing review was even real. We set out to build a marketplace that removes
          that guesswork &mdash; connecting verified independent sellers with shoppers, backed by
          tools like virtual try-on and genuine, purchase-only reviews, so every order feels like a
          sure thing instead of a gamble.
        </p>
      </section>

      {/* What We Stand For */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="What We Stand For"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {WHAT_WE_STAND_FOR.map((point) => (
            <div
              key={point.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={point.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{point.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Our Mission & Vision"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4 sm:p-5">
            <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Icon icon="solar:flag-linear" className="size-5 text-white" />
            </span>
            <p className="text-primary text-sm font-semibold sm:text-base">Our Mission</p>
            <p className="text-secondary text-xs leading-relaxed sm:text-sm">
              To make discovering and buying genuine beauty products simple, trustworthy, and
              enjoyable &mdash; for every shopper, every seller, and every skin tone.
            </p>
          </div>
          <div className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4 sm:p-5">
            <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Icon icon="solar:eye-linear" className="size-5 text-white" />
            </span>
            <p className="text-primary text-sm font-semibold sm:text-base">Our Vision</p>
            <p className="text-secondary text-xs leading-relaxed sm:text-sm">
              A beauty marketplace people recommend by word of mouth &mdash; not because we asked,
              but because shopping with us just works.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Our Values"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OUR_VALUES.map((value) => (
            <div
              key={value.title}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={value.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{value.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Why Shop With Us"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {WHY_SHOP_WITH_US.map((feature) => (
            <div
              key={feature.title}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={feature.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{feature.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainability & Ethics */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Sustainability & Ethics"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Doing right by people and the planet isn&apos;t an afterthought for us &mdash; it&apos;s
          part of how we choose who sells on our platform. Read more about our{' '}
          <Link to={`/${ROUTES.COMPANY.SUSTAINABILITY}`} className="inline">
            <GradientText type="accent" text="sustainability commitments" className="font-medium" />
          </Link>{' '}
          and our{' '}
          <Link to={`/${ROUTES.COMPANY.ETHICS}`} className="inline">
            <GradientText type="accent" text="ethics standards" className="font-medium" />
          </Link>
          .
        </p>
      </section>

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Come Grow With Us</p>
          <p className="text-secondary text-xs sm:text-sm">
            Whether you want to join our team, sell on our marketplace, or just say hello, we&apos;d
            love to hear from you.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/${ROUTES.COMPANY.CAREERS}`}
            className="border-primary/20 hover:bg-primary-invert/60 text-primary flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Icon icon="solar:compass-linear" className="size-4.5" />
            View Careers
          </Link>
          <Link
            to={`/${ROUTES.QUICK_LINKS.BECOME_SELLER}`}
            className="border-primary/20 hover:bg-primary-invert/60 text-primary flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
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

export default AboutUs;
