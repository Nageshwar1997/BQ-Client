import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import { formatDate } from '@/utils/common.util';

const QUICK_OVERVIEW = [
  {
    icon: 'solar:user-check-rounded-linear',
    title: 'Eligibility',
    description: 'You must be able to enter a binding contract to use Beautinique.',
  },
  {
    icon: 'solar:shop-2-linear',
    title: 'Marketplace Sellers',
    description: 'Some products are sold by independent sellers, not Beautinique directly.',
  },
  {
    icon: 'solar:clipboard-text-linear',
    title: 'Pricing May Change',
    description: 'Prices, availability, and listings can change without prior notice.',
  },
  {
    icon: 'solar:delivery-linear',
    title: 'Orders & Shipping',
    description: 'Orders are subject to availability, payment verification, and delivery times.',
  },
  {
    icon: 'solar:undo-left-linear',
    title: 'Returns & Refunds',
    description: 'Returns follow our stated policy and eligibility windows.',
  },
  {
    icon: 'solar:forbidden-circle-linear',
    title: 'Acceptable Use',
    description: 'Misuse, fraud, or abuse of the platform can result in account action.',
  },
] as const;

const PROHIBITED_USES = [
  'Attempting to gain unauthorized access to accounts, systems, or data.',
  'Uploading fake, misleading, or defamatory reviews and content.',
  'Using bots, scrapers, or automated tools to access or extract site data.',
  'Reselling, copying, or redistributing product images, descriptions, or listings without permission.',
  'Interfering with the normal operation of the website or other users’ experience.',
] as const;

const BeautiniqueLink = () => (
  <Link to={ROUTES.HOME} className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);

const TermsAndConditions = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:clipboard-text-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Terms & Conditions"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          By accessing and using <BeautiniqueLink />, you agree to be bound by the following terms
          and policies. Please read them carefully before shopping, selling, or creating an account
          with us.
        </p>
        <span className="text-primary/50 flex items-center gap-1 text-xs sm:text-sm">
          <Icon icon="solar:calendar-mark-linear" className="size-3.5" />
          Last updated {formatDate(new Date())}
        </span>
      </div>

      <Divider />

      {/* Introduction */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Introduction"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Welcome to <BeautiniqueLink />. These Terms & Conditions (&quot;Terms&quot;) govern your
          access to and use of our website, mobile experience, and services, including browsing,
          purchasing products, selling as a partner, and using features like reviews and virtual
          try-on. By creating an account or using this platform in any way, you agree to comply with
          these Terms in full.
        </p>
      </section>

      {/* Quick Overview */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Key Points at a Glance"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_OVERVIEW.map((point) => (
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

      {/* Eligibility */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Eligibility"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You must be at least 18 years old, or the age of legal majority in your jurisdiction, and
          capable of entering into a binding contract to create an account or place an order. If you
          are using Beautinique on behalf of a business, you confirm that you have the authority to
          bind that business to these Terms.
        </p>
      </section>

      {/* Account Registration & Security */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Account Registration & Security"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          If you create an account, you are responsible for maintaining the confidentiality of your
          login credentials and for ensuring the accuracy of the information you provide. You agree
          to notify us immediately at{' '}
          <a href="mailto:beautinique.bq@gmail.com" className="text-primary font-medium">
            beautinique.bq@gmail.com
          </a>{' '}
          of any unauthorized access to or use of your account.
        </p>
      </section>

      {/* Marketplace Sellers */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Marketplace Sellers & Third-Party Products"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Some products listed on <BeautiniqueLink /> are sold by independent third-party sellers
          through our marketplace, not by Beautinique directly. While we vet sellers who join our
          platform, each seller is solely responsible for the accuracy, quality, and legality of the
          products they list. Beautinique acts as a facilitator connecting buyers and sellers and is
          not the manufacturer or direct retailer of every product shown on this site.
        </p>
      </section>

      {/* Acceptable Use */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Acceptable Use"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You agree to use this website for lawful purposes only. Without limiting the above, you
          agree not to:
        </p>
        <ul className="flex flex-col gap-3">
          {PROHIBITED_USES.map((rule) => (
            <li
              key={rule}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-3 sm:p-4"
            >
              <Icon
                icon="solar:forbidden-circle-linear"
                className="text-primary/60 mt-0.5 size-4.5 shrink-0"
              />
              <span className="text-secondary text-xs sm:text-sm">{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Product Listings, Pricing & Availability */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Product Listings, Pricing & Availability"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Product details, pricing, and availability are subject to change without notice. We strive
          for accuracy across every listing but do not guarantee that product descriptions, images,
          or prices are always error-free, complete, or current. If a product is listed at an
          incorrect price due to a technical error, we reserve the right to cancel that order even
          after confirmation.
        </p>
      </section>

      {/* Orders, Payment & Cancellation */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Orders, Payment & Cancellation"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          All purchases made through our site are subject to product availability and successful
          verification of payment details. We reserve the right to refuse, cancel, or limit any
          order at our discretion, including in cases of suspected fraud, pricing errors, or unusual
          order activity. You will be notified and refunded in full if we cancel a paid order.
        </p>
      </section>

      {/* Shipping & Delivery */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Shipping & Delivery"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Delivery timelines shown at checkout are estimates and are not guaranteed, as they can be
          affected by seller processing time, courier delays, or circumstances outside our control.
          Risk of loss and title for products pass to you once an order is handed over to the
          shipping carrier.
        </p>
      </section>

      {/* Returns & Refunds */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Returns & Refunds"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Returns, exchanges, and refunds are governed by the return window and eligibility criteria
          shown on each product page at the time of purchase. Opened or used cosmetic products may
          not be eligible for return for hygiene reasons, unless the product arrived damaged,
          defective, or incorrect.
        </p>
      </section>

      {/* Reviews & UGC */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Reviews & User-Generated Content"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          By submitting a review, photo, or other content, you grant <BeautiniqueLink /> a
          non-exclusive, royalty-free, worldwide license to use, display, and reproduce that content
          in connection with our platform and marketing. You confirm that your reviews reflect your
          genuine experience and do not contain false, misleading, or abusive content.
        </p>
      </section>

      {/* Virtual Try-On */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Virtual Try-On Feature"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Our virtual try-on feature may request access to your device camera to render product
          previews. Camera access is used only to power this feature in real time and is not stored
          or shared by us beyond what is required to provide the preview. By using this feature, you
          consent to this temporary use of your camera.
        </p>
      </section>

      {/* Intellectual Property */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Intellectual Property"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          All content on this site, including logos, designs, text, product photography, and
          graphics owned by <BeautiniqueLink />, is protected under applicable copyright and
          trademark law. You may not copy, reproduce, or redistribute this content without our prior
          written permission.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Limitation of Liability"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          To the maximum extent permitted by law, <BeautiniqueLink /> is not liable for any
          indirect, incidental, or consequential loss or damage arising from your use of our
          website, products purchased through our marketplace, or reliance on content found on this
          site.
        </p>
      </section>

      {/* Indemnification */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Indemnification"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You agree to indemnify and hold <BeautiniqueLink /> harmless from any claims, losses, or
          expenses (including legal fees) arising out of your misuse of the platform or violation of
          these Terms.
        </p>
      </section>

      {/* Governing Law */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Governing Law"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          These Terms are governed by and construed in accordance with the laws of India, without
          regard to conflict-of-law principles, and any disputes arising from these Terms will be
          subject to the exclusive jurisdiction of the courts located in India.
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Changes to These Terms"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We may update these Terms at any time to reflect changes in our services, legal
          requirements, or business practices. Continued use of the website after changes are posted
          constitutes your acceptance of the updated Terms.
        </p>
      </section>

      <Divider />

      {/* Contact */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-start justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">
            Questions About These Terms?
          </p>
          <p className="text-secondary text-xs sm:text-sm">
            Reach out and we&apos;ll help clarify anything in this agreement.
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

export default TermsAndConditions;
