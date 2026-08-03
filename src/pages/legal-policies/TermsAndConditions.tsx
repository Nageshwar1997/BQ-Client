import {
  BeautiniqueLink,
  Checklist,
  EmailUsAction,
  InfoCardGrid,
  LastUpdatedBadge,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';

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

const TermsAndConditions = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:clipboard-text-linear"
        title="Terms & Conditions"
        description={
          <>
            By accessing and using <BeautiniqueLink />, you agree to be bound by the following terms
            and policies. Please read them carefully before shopping, selling, or creating an
            account with us.
          </>
        }
        meta={<LastUpdatedBadge />}
      />

      <Divider />

      <StaticPageSection title="Introduction" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Welcome to <BeautiniqueLink />. These Terms & Conditions (&quot;Terms&quot;) govern your
          access to and use of our website, mobile experience, and services, including browsing,
          purchasing products, selling as a partner, and using features like reviews and virtual
          try-on. By creating an account or using this platform in any way, you agree to comply with
          these Terms in full.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Key Points at a Glance">
        <InfoCardGrid items={QUICK_OVERVIEW} />
      </StaticPageSection>

      <StaticPageSection title="Eligibility" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You must be at least 18 years old, or the age of legal majority in your jurisdiction, and
          capable of entering into a binding contract to create an account or place an order. If you
          are using Beautinique on behalf of a business, you confirm that you have the authority to
          bind that business to these Terms.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Account Registration & Security" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          If you create an account, you are responsible for maintaining the confidentiality of your
          login credentials and for ensuring the accuracy of the information you provide. You agree
          to notify us immediately at{' '}
          <a href="mailto:beautinique.bq@gmail.com" className="text-primary font-medium">
            beautinique.bq@gmail.com
          </a>{' '}
          of any unauthorized access to or use of your account.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Marketplace Sellers & Third-Party Products" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Some products listed on <BeautiniqueLink /> are sold by independent third-party sellers
          through our marketplace, not by Beautinique directly. While we vet sellers who join our
          platform, each seller is solely responsible for the accuracy, quality, and legality of the
          products they list. Beautinique acts as a facilitator connecting buyers and sellers and is
          not the manufacturer or direct retailer of every product shown on this site.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Acceptable Use">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You agree to use this website for lawful purposes only. Without limiting the above, you
          agree not to:
        </p>
        <Checklist
          items={PROHIBITED_USES}
          icon="solar:forbidden-circle-linear"
          iconClassName="text-primary/60"
        />
      </StaticPageSection>

      <StaticPageSection title="Product Listings, Pricing & Availability" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Product details, pricing, and availability are subject to change without notice. We strive
          for accuracy across every listing but do not guarantee that product descriptions, images,
          or prices are always error-free, complete, or current. If a product is listed at an
          incorrect price due to a technical error, we reserve the right to cancel that order even
          after confirmation.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Orders, Payment & Cancellation" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          All purchases made through our site are subject to product availability and successful
          verification of payment details. We reserve the right to refuse, cancel, or limit any
          order at our discretion, including in cases of suspected fraud, pricing errors, or unusual
          order activity. You will be notified and refunded in full if we cancel a paid order.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Shipping & Delivery" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Delivery timelines shown at checkout are estimates and are not guaranteed, as they can be
          affected by seller processing time, courier delays, or circumstances outside our control.
          Risk of loss and title for products pass to you once an order is handed over to the
          shipping carrier.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Returns & Refunds" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Returns, exchanges, and refunds are governed by the return window and eligibility criteria
          shown on each product page at the time of purchase. Opened or used cosmetic products may
          not be eligible for return for hygiene reasons, unless the product arrived damaged,
          defective, or incorrect.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Reviews & User-Generated Content" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          By submitting a review, photo, or other content, you grant <BeautiniqueLink /> a
          non-exclusive, royalty-free, worldwide license to use, display, and reproduce that content
          in connection with our platform and marketing. You confirm that your reviews reflect your
          genuine experience and do not contain false, misleading, or abusive content.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Virtual Try-On Feature" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Our virtual try-on feature may request access to your device camera to render product
          previews. Camera access is used only to power this feature in real time and is not stored
          or shared by us beyond what is required to provide the preview. By using this feature, you
          consent to this temporary use of your camera.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Intellectual Property" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          All content on this site, including logos, designs, text, product photography, and
          graphics owned by <BeautiniqueLink />, is protected under applicable copyright and
          trademark law. You may not copy, reproduce, or redistribute this content without our prior
          written permission.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Limitation of Liability" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          To the maximum extent permitted by law, <BeautiniqueLink /> is not liable for any
          indirect, incidental, or consequential loss or damage arising from your use of our
          website, products purchased through our marketplace, or reliance on content found on this
          site.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Indemnification" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You agree to indemnify and hold <BeautiniqueLink /> harmless from any claims, losses, or
          expenses (including legal fees) arising out of your misuse of the platform or violation of
          these Terms.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Governing Law" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          These Terms are governed by and construed in accordance with the laws of India, without
          regard to conflict-of-law principles, and any disputes arising from these Terms will be
          subject to the exclusive jurisdiction of the courts located in India.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Changes to These Terms" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We may update these Terms at any time to reflect changes in our services, legal
          requirements, or business practices. Continued use of the website after changes are posted
          constitutes your acceptance of the updated Terms.
        </p>
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Questions About These Terms?"
        description="Reach out and we'll help clarify anything in this agreement."
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default TermsAndConditions;
