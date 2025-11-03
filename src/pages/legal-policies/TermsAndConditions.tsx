import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Terms & Conditions
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          By accessing and using our website, you agree to the following terms
          and policies.
        </p>
      </header>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Introduction</h2>
        <p className="text-sm sm:text-base">
          Welcome to{" "}
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>
          . These Terms & Conditions govern your use of our website and
          services. By using this platform, you agree to comply with these
          terms.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Use of Website</h2>
        <p className="text-sm sm:text-base">
          You agree to use this website for lawful purposes only and not engage
          in activities that may harm or disrupt the site, users, or operations.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Account Responsibility
        </h2>
        <p className="text-sm sm:text-base">
          If you create an account, you are responsible for maintaining
          confidentiality and ensuring the accuracy of your information. Notify
          us immediately of any unauthorized access.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Product & Pricing</h2>
        <p className="text-sm sm:text-base">
          Product details, pricing, and availability are subject to change
          without notice. We strive for accuracy but do not guarantee error-free
          content.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Order & Payment</h2>
        <p className="text-sm sm:text-base">
          All purchases made through our site are subject to product
          availability and verification of payment details. We reserve the right
          to cancel or refuse orders at our discretion.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Returns & Refunds</h2>
        <p className="text-sm sm:text-base">
          Returns and refunds are governed by our{" "}
          <Link to="/privacy-policy">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Return Policy
            </strong>
          </Link>
          . Please review it before making a purchase.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Intellectual Property
        </h2>
        <p className="text-sm sm:text-base">
          All content, including logos, designs, text, images, and graphics, are
          owned by{" "}
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>{" "}
          and protected under copyright law. Unauthorized use is prohibited.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Limitation of Liability
        </h2>
        <p className="text-sm sm:text-base">
          We are not responsible for any loss or damage arising from the use of
          our website or products, to the maximum extent permitted by law.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Changes to Terms</h2>
        <p className="text-sm sm:text-base">
          We may update these terms at any time. Continued use of the website
          indicates acceptance of the updated terms.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Contact Us</h2>
        <p className="text-sm sm:text-base">
          For questions or concerns regarding these Terms & Conditions, please{" "}
          <Link to="/contact">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              contact us
            </strong>
          </Link>
          .
        </p>
      </section>

      <p className="text-sm sm:text-base text-center font-semibold">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default TermsAndConditions;
