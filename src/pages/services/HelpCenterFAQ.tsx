import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  EmailUsAction,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const FAQ_CATEGORIES = [
  {
    icon: 'solar:delivery-linear',
    title: 'Orders & Shipping',
    questions: [
      {
        question: 'How do I place an order?',
        answer:
          'Browse or search for a product, choose your shade/variant if applicable, and add it to your cart. From your cart, proceed to checkout, confirm your delivery address, and complete payment to place the order.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Head to your Profile → Orders → Track My Orders to see the current status and delivery estimate for any order.',
      },
      {
        question: 'What are the delivery timelines?',
        answer:
          'Delivery timelines shown at checkout are estimates based on your location and the seller’s processing time. They can vary due to courier delays or circumstances outside our control.',
      },
      {
        question: 'Can I cancel an order after placing it?',
        answer:
          'You can request a cancellation from Profile → Orders as long as the order hasn’t already been shipped. Once it’s out for delivery, you’ll need to use our return process instead.',
      },
    ],
  },
  {
    icon: 'solar:undo-left-linear',
    title: 'Returns & Refunds',
    questions: [
      {
        question: 'What is your return policy?',
        answer:
          'Most products can be returned within the window and conditions shown on the product page at the time of purchase. Opened or used cosmetic products generally aren’t eligible for return, unless they arrived damaged, defective, or incorrect.',
      },
      {
        question: 'How do I request a return or refund?',
        answer:
          'Go to Profile → Orders, select the order, and choose Return & Refund. Follow the steps to tell us what went wrong and how you’d like it resolved.',
      },
      {
        question: 'How long do refunds take to process?',
        answer:
          'Once your return is received and inspected, refunds are typically issued back to your original payment method within a few business days.',
      },
    ],
  },
  {
    icon: 'solar:user-id-linear',
    title: 'Account & Profile',
    questions: [
      {
        question: 'How do I create an account?',
        answer:
          'Click Register, enter your email to receive a verification OTP, then fill in your name, phone number, and password to finish setting up your account.',
      },
      {
        question: 'How do I update my profile information?',
        answer:
          'Go to your Profile page, click the pencil icon next to any field you want to change (name, email, phone, or photo), update it, and hit Save Changes.',
      },
      {
        question: 'I forgot my password. What do I do?',
        answer:
          'On the login page, select Forgot Password and follow the OTP verification steps to set a new password.',
      },
      {
        question: 'Can I sign in with Google, LinkedIn, or GitHub?',
        answer:
          'Yes. You can sign in or register directly using your Google, LinkedIn, or GitHub account instead of creating a separate password.',
      },
    ],
  },
  {
    icon: 'solar:card-linear',
    title: 'Payments & Security',
    questions: [
      {
        question: 'What payment methods are accepted?',
        answer:
          'We support the standard payment options available at checkout, including major cards and other methods enabled for your region.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Yes. Payments are processed securely, and sensitive account data is encrypted both in transit and at rest. We never store your raw card details on our servers.',
      },
      {
        question: 'Why was my payment declined?',
        answer:
          'This is usually caused by the payment provider (insufficient funds, bank restrictions, or incorrect card details). Please verify your details or try an alternate payment method.',
      },
    ],
  },
  {
    icon: 'solar:shop-2-linear',
    title: 'Selling on Beautinique',
    questions: [
      {
        question: 'How do I become a seller?',
        answer:
          'Visit the Become a Seller page and submit your application. Our team reviews each application before approving new sellers onto the marketplace.',
      },
      {
        question: 'What are the requirements to sell on the platform?',
        answer:
          'Sellers need to provide accurate business and product information and agree to our marketplace terms, including standards around product authenticity and listing accuracy.',
      },
      {
        question: 'How do I manage my listings once approved?',
        answer:
          'Approved sellers get access to a dashboard for adding products, managing stock and pricing, and tracking orders for their listings.',
      },
    ],
  },
  {
    icon: 'solar:magic-stick-2-linear',
    title: 'Virtual Try-On',
    questions: [
      {
        question: 'How does the virtual Try-On feature work?',
        answer:
          'On supported products, you can preview how a shade or item looks using your device camera, live, before adding it to your cart.',
      },
      {
        question: 'Do I need to grant camera access?',
        answer:
          'Yes, your browser will ask for camera permission the first time you use Try-On. You can decline and shop normally without it.',
      },
      {
        question: 'Is my camera data stored?',
        answer:
          'No. Camera access is used only to render the live preview and isn’t stored or shared beyond what’s needed to power that feature.',
      },
    ],
  },
] as const;

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-primary/10 bg-secondary-invert rounded-xl border">
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left"
      >
        <span className="text-primary text-sm font-medium sm:text-base">{question}</span>
        <Icon
          icon="solar:alt-arrow-down-linear"
          className={`text-primary/60 size-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <p className="text-secondary px-4 pb-4 text-xs leading-relaxed sm:text-sm">{answer}</p>
      )}
    </div>
  );
};

const HelpCenterFAQ = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:question-circle-linear"
        title="Help Center"
        description="Answers to the questions we hear most, grouped by topic. Can't find what you need? We're just an email away."
      />

      <Divider />

      {/* Quick jump chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {FAQ_CATEGORIES.map((category) => (
          <a
            key={category.title}
            href={`#${category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="border-primary/20 hover:bg-primary-invert/60 text-primary flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm"
          >
            <Icon icon={category.icon} className="size-4" />
            {category.title}
          </a>
        ))}
      </div>

      {/* FAQ Categories */}
      {FAQ_CATEGORIES.map((category) => (
        <section
          key={category.title}
          id={category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
          className="flex scroll-mt-20 flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="bg-accent-duo flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Icon icon={category.icon} className="size-4.5 text-white" />
            </span>
            <GradientText
              type="accent"
              text={category.title}
              className="text-lg font-semibold sm:text-xl"
            />
          </div>
          <div className="flex flex-col gap-3">
            {category.questions.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>
      ))}

      <Divider />

      <StaticPageCTA
        title="Still Have Questions?"
        description={
          <>
            Our{' '}
            <Link to={`/${ROUTES.SERVICES.CONTACT}`} className="inline">
              <GradientText type="accent" text="Contact Us" className="font-medium" />
            </Link>{' '}
            page has more ways to reach our team.
          </>
        }
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default HelpCenterFAQ;
