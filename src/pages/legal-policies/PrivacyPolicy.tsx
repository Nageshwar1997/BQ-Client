import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Privacy Policy
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          This Privacy Policy explains how <strong>Beautinique</strong>{" "}
          collects, uses, and protects your personal information.
        </p>
      </header>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Information We Collect
        </h2>
        <p className="text-sm sm:text-base">
          We may collect personal information such as your name, email address,
          phone number, shipping address, and payment information when you
          interact with our website or purchase our products.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          How We Use Your Information
        </h2>
        <p className="text-sm sm:text-base">
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>{" "}
          uses your information to:
        </p>
        <ul className="list-disc pl-5 text-sm sm:text-base space-y-1">
          <li>Process and fulfill your orders.</li>
          <li>Provide customer support and respond to inquiries.</li>
          <li>Send updates, promotions, and newsletters (if subscribed).</li>
          <li>
            Improve website functionality and personalize your experience.
          </li>
        </ul>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Cookies & Tracking
        </h2>
        <p className="text-sm sm:text-base">
          We use cookies and similar technologies to analyze traffic, remember
          preferences, and enhance user experience. For more information, please
          see our{" "}
          <Link to="/cookie-policy">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Cookie Policy
            </strong>
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Sharing Your Information
        </h2>
        <p className="text-sm sm:text-base">
          We do not sell or rent your personal information to third parties.
          Your data may be shared with trusted service providers for order
          fulfillment, payment processing, and website maintenance.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Data Security</h2>
        <p className="text-sm sm:text-base">
          We implement appropriate technical and organizational measures to
          protect your personal information from unauthorized access,
          disclosure, or misuse.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Your Rights</h2>
        <p className="text-sm sm:text-base">
          You may request access, correction, or deletion of your personal data.
          For any such requests, please{" "}
          <Link to="/contact">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              contact us
            </strong>
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Changes to This Policy
        </h2>
        <p className="text-sm sm:text-base">
          We may update this Privacy Policy periodically. Continued use of our
          website constitutes acceptance of any changes.
        </p>
      </section>

      <p className="text-sm sm:text-base text-center font-semibold">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default PrivacyPolicy;
