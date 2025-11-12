import { Link } from "react-router-dom";
import Button from "../../components/button/Button";

const PartnerWithUs = () => {
  return (
    <div className="px-6 py-12 max-w-5xl mx-auto space-y-16">
      <header className="text-center space-y-4">
        {/* Our Ethics & Values */}
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Partner with Beautinique
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          Let’s build the future of beauty together — whether you're a brand,
          distributor, influencer, or innovator.
        </p>
      </header>
      {/* Collaboration Types */}
      <div className="grid md:grid-cols-2 gap-10">
        {[
          {
            title: "Brand Collaborations",
            desc: "Join our curated platform of premium beauty brands. Together, we redefine what it means to shine.",
          },
          {
            title: "Influencer Partnerships",
            desc: "Partner with us to inspire millions. Let’s create authentic stories that celebrate self-expression.",
          },
          {
            title: "Wholesale & Distribution",
            desc: "Connect with Beautinique as a reseller or distributor and expand your product reach across India.",
          },
          {
            title: "Technology & Innovation Partners",
            desc: "Collaborate on next-gen experiences — from AR try-ons to smart personalization and AI-powered beauty.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="border border-secondary-10 p-6 rounded-2xl shadow-sm hover:shadow-lg shadow-secondary-30 hover:shadow-primary-10 transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-3 text-secondary">
              {item.title}
            </h3>
            <p className="text-primary-50">{item.desc}</p>
          </div>
        ))}
      </div>
      {/* Partner Inquiry Section */}
      <div className="text-center mb-14">
        <h2 className="text-2xl font-bold text-secondary mb-4">
          Interested in Partnering?
        </h2>
        <p className="text-tertiary max-w-2xl mx-auto mb-6">
          Fill out our partnership form to explore collaboration opportunities.
          Our team will reach out to discuss how we can create meaningful impact
          together.
        </p>
        <Link to="/contact">
          <Button
            pattern="primary"
            content="Become a Partner"
            className="max-w-xs mx-auto"
          />
        </Link>
      </div>
      {/* Contact Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          For direct queries, reach us at{" "}
          <Link
            to="mailto:beautinique.bq@gmail.com"
            className="font-semibold bg-clip-text bg-accent-duo text-transparent"
          >
            beautinique.bq@gmail.com
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PartnerWithUs;
