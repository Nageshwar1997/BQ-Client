import { Link } from "react-router-dom";

const HelpCenterFAQ = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Help Center & FAQ
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Find answers to common questions about orders, shipping, products, and
          more.
        </p>
      </header>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Ordering & Payments
        </h2>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> How do I place an order?
          <br />
          <span className="font-semibold">A:</span> Browse our products, add
          them to your cart, and proceed to checkout. You can pay securely via
          credit/debit card, UPI, or net banking.
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> Can I modify or cancel my
          order?
          <br />
          <span className="font-semibold">A:</span> Orders can be modified or
          cancelled within 24 hours of placement. Contact our{" "}
          <Link to="/contact">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              support team
            </strong>
          </Link>{" "}
          for assistance.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Shipping & Delivery
        </h2>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> How long will delivery take?
          <br />
          <span className="font-semibold">A:</span> For deliveries within India,
          standard shipping takes 3–6 business days, and express shipping takes
          1–3 business days.
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> How can I track my order?
          <br />
          <span className="font-semibold">A:</span> You will receive a tracking
          number via email or SMS once your order is shipped. Use it to track
          your package online.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Products & Returns
        </h2>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> What if a product is out of
          stock?
          <br />
          <span className="font-semibold">A:</span> Out-of-stock products will
          be marked accordingly. You can sign up for notifications when they
          become available.
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> Can I return or exchange a
          product?
          <br />
          <span className="font-semibold">A:</span> Yes, returns and exchanges
          are accepted as per our{" "}
          <Link to="/orders/return-refund">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Returns & Refunds
            </strong>
          </Link>{" "}
          policy.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Account & Support</h2>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> How do I create an account?
          <br />
          <span className="font-semibold">A:</span> Click on the “
          <Link to="/register">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Register Now
            </strong>
          </Link>
          ” button and provide your details. You can manage your orders and
          wishlist through your account.
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> How can I contact customer
          support?
          <br />
          <span className="font-semibold">A:</span> Visit our{" "}
          <Link to="/contact">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Contact
            </strong>
          </Link>{" "}
          page or email us at support@beautinique.com.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Become a Seller</h2>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> How can I sell my products
          on Beautinique?
          <br />
          <span className="font-semibold">A:</span> Anyone can apply to become a
          seller. Click on the{" "}
          <Link to="/become-seller">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              “Become a Seller”
            </strong>
          </Link>{" "}
          page, fill out the application form, and submit your business details.
          Our team will review your application and get back to you with the
          next steps.
        </p>
      </section>

      <p className="text-sm sm:text-base text-center font-semibold">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default HelpCenterFAQ;
