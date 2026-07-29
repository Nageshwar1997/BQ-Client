import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';

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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:delivery-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Shipping Info"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Everything you need to know about how your order gets from a seller&apos;s shelf to
          your doorstep.
        </p>
      </div>

      <Divider />

      {/* Key Points */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Key Points at a Glance"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_FACTS.map((fact) => (
            <div
              key={fact.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={fact.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{fact.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{fact.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How Shipping Works */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="How Shipping Works"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="flex flex-col gap-3">
          {SHIPPING_STEPS.map((step, index) => (
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

      {/* Shipping Costs */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Shipping Costs"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Shipping costs are calculated at checkout based on your delivery location, order
          weight, and the seller fulfilling your item — and you&apos;ll always see the final
          amount before you pay. Many sellers offer free shipping on orders above{' '}
          <span className="text-primary font-medium">₹499</span>, shown directly on the product
          page.
        </p>
      </section>

      {/* Tracking */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Tracking Your Order"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Once your order ships, visit{' '}
          <Link to="/profile/orders/track" className="inline">
            <GradientText type="accent" text="Track My Orders" className="font-medium" />
          </Link>{' '}
          from your Profile to see live status updates for every shipment in your order.
        </p>
      </section>

      {/* Packaging */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Packaging"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We package orders to keep products safe in transit while favoring recyclable materials
          wherever we can — read more on our{' '}
          <Link to="/sustainability" className="inline">
            <GradientText type="accent" text="Sustainability" className="font-medium" />
          </Link>{' '}
          page.
        </p>
      </section>

      {/* Delayed or Missing */}
      <section className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <Icon icon="solar:danger-triangle-linear" className="text-primary/60 mt-0.5 size-5 shrink-0" />
        <div className="flex flex-col gap-1.5">
          <p className="text-primary text-sm font-semibold sm:text-base">
            Delayed or Missing Package?
          </p>
          <p className="text-secondary text-xs leading-relaxed sm:text-sm">
            If your order is running later than the estimate shown, or tracking hasn&apos;t
            updated in a while, check{' '}
            <Link to="/profile/orders/track" className="inline">
              <GradientText type="accent" text="Track My Orders" className="font-medium" />
            </Link>{' '}
            first. If something still looks wrong, reach out to us and we&apos;ll help sort it
            out with the seller and courier.
          </p>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Still Have Questions?</p>
          <p className="text-secondary text-xs sm:text-sm">
            Check our{' '}
            <Link to="/help-center-faq" className="inline">
              <GradientText type="accent" text="Help Center" className="font-medium" />
            </Link>{' '}
            or reach out to our team directly.
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

export default ShippingInfo;
