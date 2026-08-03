import { Link } from 'react-router-dom';

import {
  EmailUsAction,
  HighlightNote,
  InfoCardGrid,
  NumberedSteps,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const QUICK_FACTS = [
  {
    icon: 'solar:clock-circle-linear',
    title: 'Processing Time',
    description: 'Most orders are packed and handed to the courier within 1–2 business days.',
  },
  {
    icon: 'solar:delivery-linear',
    title: 'Delivery Estimate',
    description: 'Typically 3–7 business days, depending on your location and the seller.',
  },
  {
    icon: 'solar:box-minimalistic-linear',
    title: 'Multiple Sellers, Multiple Shipments',
    description: 'Items from different sellers in one order may arrive in separate packages.',
  },
  {
    icon: 'solar:map-point-linear',
    title: 'Order Tracking',
    description: 'Track every shipment from Profile → Orders → Track My Orders.',
  },
  {
    icon: 'solar:card-linear',
    title: 'Transparent Costs',
    description: 'Shipping fees are calculated and shown clearly before you pay.',
  },
  {
    icon: 'solar:leaf-linear',
    title: 'Sustainable Packaging',
    description: 'We favor recyclable and low-waste packaging wherever possible.',
  },
] as const;

const SHIPPING_STEPS = [
  {
    title: 'Order Confirmed',
    description: 'As soon as payment is verified, your order is sent to the relevant seller(s).',
  },
  {
    title: 'Order Processed',
    description: 'The seller packs your item(s) and hands them off to our shipping partner.',
  },
  {
    title: 'In Transit',
    description: 'Your package moves through the courier network toward your delivery address.',
  },
  {
    title: 'Out for Delivery',
    description: 'The package is with the local courier for final delivery to your doorstep.',
  },
  {
    title: 'Delivered',
    description: 'You receive your order — and can start the return window if something’s wrong.',
  },
] as const;

const ShippingInfo = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:delivery-linear"
        title="Shipping Info"
        description="Everything you need to know about how your order gets from a seller's shelf to your doorstep."
      />

      <Divider />

      <StaticPageSection title="Key Points at a Glance">
        <InfoCardGrid items={QUICK_FACTS} />
      </StaticPageSection>

      <StaticPageSection title="How Shipping Works">
        <NumberedSteps steps={SHIPPING_STEPS} />
      </StaticPageSection>

      <StaticPageSection title="Shipping Costs" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Shipping costs are calculated at checkout based on your delivery location, order weight,
          and the seller fulfilling your item — and you&apos;ll always see the final amount before
          you pay. Many sellers offer free shipping on orders above{' '}
          <span className="text-primary font-medium">₹499</span>, shown directly on the product
          page.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Tracking Your Order" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Once your order ships, visit
          <Link
            to={`/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.ORDERS}/${ROUTES.PROFILE.ORDER_TRACK}`}
            className="inline"
          >
            <GradientText type="accent" text="Track My Orders" className="font-medium" />
          </Link>{' '}
          from your Profile to see live status updates for every shipment in your order.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Packaging" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We package orders to keep products safe in transit while favoring recyclable materials
          wherever we can — read more on our{' '}
          <Link to={`/${ROUTES.COMPANY.SUSTAINABILITY}`} className="inline">
            <GradientText type="accent" text="Sustainability" className="font-medium" />
          </Link>{' '}
          page.
        </p>
      </StaticPageSection>

      <HighlightNote title="Delayed or Missing Package?">
        If your order is running later than the estimate shown, or tracking hasn&apos;t updated in a
        while, check{' '}
        <Link
          to={`/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.ORDERS}/${ROUTES.PROFILE.ORDER_TRACK}`}
          className="inline"
        >
          <GradientText type="accent" text="Track My Orders" className="font-medium" />
        </Link>{' '}
        first. If something still looks wrong, reach out to us and we&apos;ll help sort it out with
        the seller and courier.
      </HighlightNote>

      <Divider />

      <StaticPageCTA
        title="Still Have Questions?"
        description={
          <>
            Check our{' '}
            <Link to={`/${ROUTES.SERVICES.HELP_CENTER_FAQ}`} className="inline">
              <GradientText type="accent" text="Help Center" className="font-medium" />
            </Link>{' '}
            or reach out to our team directly.
          </>
        }
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default ShippingInfo;
