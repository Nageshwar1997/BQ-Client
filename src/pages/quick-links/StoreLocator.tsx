import StoresGMap from "./children/StoresGMap";
import { Link } from "react-router-dom";

const StoreLocator = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-16">
      {/* Header Section */}
      <header className="text-center space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Store Locator
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          Find your nearest Beautinique store and experience the world of beauty
          up close. From skincare to cosmetics — explore, try, and shop our
          collections in person.
        </p>
      </header>
      {/* Information Section */}
      <section className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-secondary">
          Explore Our Locations
        </h2>
        <p className="text-tertiary max-w-2xl mx-auto">
          Our stores are designed to offer personalized beauty experiences.
          Visit us to discover exclusive launches, get expert advice, and enjoy
          hands-on demos with our latest products.
        </p>
      </section>
      {/* Google Map with Store Cards */}
      <StoresGMap />
      {/* Contact Section */}
      <div className="text-center space-y-3">
        <h3 className="text-lg font-semibold text-secondary">
          Can’t find a store near you?
        </h3>
        <p className="text-tertiary">
          We’re expanding rapidly! For franchise or partnership inquiries,
          please{" "}
          <Link
            to="/contact"
            className="font-semibold bg-clip-text bg-accent-duo text-transparent"
          >
            contact us
          </Link>{" "}
          — we’d love to hear from you.
        </p>
      </div>
    </div>
  );
};

export default StoreLocator;
