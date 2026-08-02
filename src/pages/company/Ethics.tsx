import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

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

const BeautiniqueLink = () => (
  <Link to={ROUTES.HOME} className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);

const Ethics = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:shield-star-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Our Ethics Standards"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Running a marketplace means people trust us with their money, their data, and their time.
          Here&apos;s how we try to earn that trust, every day.
        </p>
      </div>

      <Divider />

      {/* Principles */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Our Ethical Principles"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ETHICAL_PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={principle.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{principle.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{principle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seller Code of Conduct */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Seller Code of Conduct"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Every seller on <BeautiniqueLink /> agrees to list only genuine products with accurate
          descriptions, honor the return and refund policies shown at checkout, and disclose
          sourcing and ingredient information honestly. Sellers who mislead shoppers, misrepresent
          products, or manipulate reviews are removed from the marketplace.
        </p>
      </section>

      {/* Customer Data Ethics */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Customer Data Ethics"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We collect only the data we actually need to run the platform, we never sell it, and we
          give you control over your own information &mdash; from editing your profile to requesting
          deletion. The specifics live in our{' '}
          <Link to={`/${ROUTES.LEGAL.PRIVACY_POLICY}`} className="inline">
            <GradientText type="accent" text="Privacy Policy" className="font-medium" />
          </Link>
          .
        </p>
      </section>

      {/* Inclusion */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Inclusion & Non-Discrimination"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Beauty comes in every shade, budget, and identity. We hold sellers, staff, and our own
          product decisions to the same standard: no discrimination based on race, gender, religion,
          disability, sexual orientation, or any other protected characteristic &mdash; whether in
          hiring, seller onboarding, or how products are marketed on our platform.
        </p>
      </section>

      {/* Reporting a Concern */}
      <section className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <Icon
          icon="solar:danger-triangle-linear"
          className="text-primary/60 mt-0.5 size-5 shrink-0"
        />
        <div className="flex flex-col gap-1.5">
          <p className="text-primary text-sm font-semibold sm:text-base">Reporting a Concern</p>
          <p className="text-secondary text-xs leading-relaxed sm:text-sm">
            If you come across a listing, seller, or review that feels dishonest, discriminatory, or
            unsafe, please tell us. Every report is reviewed by our team, and we take appropriate
            action &mdash; up to and including removing the seller or listing involved.
          </p>
        </div>
      </section>

      {/* Related Policies */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Related Policies"
          className="text-xl font-semibold sm:text-2xl"
        />
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
      </section>

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">See Something Off?</p>
          <p className="text-secondary text-xs sm:text-sm">
            Reach out and let us know &mdash; we take every report seriously.
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

export default Ethics;
