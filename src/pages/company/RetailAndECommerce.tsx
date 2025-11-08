import { Link } from "react-router-dom";
import Button from "../../components/button/Button";

const RetailAndECommerce = () => {
  return (
    <div className="px-6 py-12 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Retail & E-Commerce
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          Beautinique brings beauty closer to you — online and offline. Whether
          you love in-store experiences or the convenience of shopping from
          home, we’ve got you covered.
        </p>
      </header>

      {/* Two Column Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary">
            Our Retail Experience
          </h2>
          <p className="text-tertiary">
            Step into our exclusive stores and experience beauty like never
            before. Explore our curated products, get personalized
            consultations, and enjoy hands-on demos designed to help you
            discover what suits you best.
          </p>
          <ul className="list-disc pl-5 text-primary-50 space-y-2">
            <li>Interactive try-on zones</li>
            <li>Certified beauty advisors for guidance</li>
            <li>Exclusive in-store offers & launches</li>
            <li>Immersive brand experiences</li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/images/company/retail-e-commerce/retail-experience.webp"
            alt="Beautinique Retail Store"
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* Online Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl overflow-hidden shadow-lg md:order-1 order-2">
          <img
            src="/images/company/retail-e-commerce/e-commerce-convenince.webp"
            alt="Beautinique E-Commerce"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="space-y-4 md:order-2 order-1">
          <h2 className="text-xl font-semibold text-secondary">
            E-Commerce Convenience
          </h2>
          <p className="text-tertiary">
            Our online platform brings the best of Beautinique to your doorstep.
            Discover products, read real reviews, and shop with confidence from
            the comfort of your home.
          </p>
          <ul className="list-disc pl-5 text-primary-50 space-y-2">
            <li>Nationwide shipping across India</li>
            <li>Easy returns and secure payments</li>
            <li>AI-powered personalized recommendations</li>
            <li>Exclusive online bundles and offers</li>
          </ul>
        </div>
      </section>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <section className="relative rounded-2xl overflow-hidden border border-primary-30">
        <img
          src="/images/company/retail-e-commerce/explore-experience.webp"
          alt="Explore Experience"
          className="object-cover min-h-[400px] object-right-top w-full h-full"
        />
        <div className="absolute bottom-0 inset-x-0 min-h-[400px] p-4 pt-8 bg-gradient-to-t from-primary-inverted to-transparent flex flex-col justify-end">
          <h2 className="text-base base:text-lg sm:text-xl lg:text-2xl font-bold bg-clip-text bg-silver-duo text-transparent">
            Explore the Beautinique Experience
          </h2>
          <p className="text-tertiary max-w-xl text-xs base:text-sm md:text-base">
            Whether you prefer to browse in-store or shop online, we make beauty
            accessible, personalized, and delightful — wherever you are.
          </p>
        </div>
      </section>
      {/* CTA Section */}
      <section className="flex justify-center gap-6 max-w-lg mx-auto w-full">
        <Link to="/store-locator" className="w-1/2">
          <Button
            pattern="primary"
            content="Find a Store"
            className="!rounded-lg"
          />
        </Link>
        <Link to="/search" className="w-1/2">
          <Button
            pattern="secondary"
            content="Shop Now"
            className="!rounded-lg"
          />
        </Link>
      </section>
    </div>
  );
};

export default RetailAndECommerce;
