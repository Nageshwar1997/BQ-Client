import { Link } from "react-router-dom";
import Button from "../../components/button/Button";

const AboutUs = () => {
  return (
    <div className="px-6 py-12 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          About Beautinique
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          At{" "}
          <Link
            to="/"
            className="bg-clip-text bg-accent-duo text-transparent font-semibold"
          >
            Beautinique
          </Link>
          , we believe beauty is more than skin-deep — it’s about confidence,
          creativity, and conscious choices that make the world more radiant.
        </p>
      </header>

      {/* Mission, Vision, Values */}
      <div className="grid md:grid-cols-2 gap-10">
        {[
          {
            title: "Our Mission",
            desc: "To empower individuals through innovative beauty solutions that are ethical, effective, and inclusive. We aim to redefine self-care with honesty and sustainability at its core.",
          },
          {
            title: "Our Vision",
            desc: "To be a global name in clean and conscious beauty - where technology, transparency, and artistry come together to create meaningful experiences.",
          },
          {
            title: "Our Values",
            desc: "Integrity, inclusivity, and innovation drive everything we do. From formulation to packaging, every choice we make reflects our commitment to people and the planet.",
          },
          {
            title: "Our Promise",
            desc: "Every Beautinique product embodies quality, compassion, and care — because we believe in beauty that uplifts, inspires, and transforms responsibly.",
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

      {/* Story / CTA Section */}
      <div className="text-center mb-14">
        <h2 className="text-2xl font-bold text-secondary mb-4">
          The{" "}
          <Link
            to="/"
            className="bg-clip-text bg-accent-duo text-transparent font-semibold"
          >
            Beautinique
          </Link>{" "}
          Story
        </h2>
        <p className="text-tertiary max-w-2xl mx-auto mb-6">
          Founded with a vision to blend science with soul,{" "}
          <Link
            to="/"
            className="bg-clip-text bg-accent-duo text-transparent font-semibold"
          >
            Beautinique
          </Link>{" "}
          has grown into a collective of dreamers, creators, and changemakers
          who believe beauty should be personal, purposeful, and
          planet-friendly.
        </p>
        <Link to="/careers">
          <Button
            pattern="primary"
            content="Join Our Team"
            className="max-w-xs mx-auto"
          />
        </Link>
      </div>

      {/* Contact Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Have questions about our journey or want to collaborate? Reach us at{" "}
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

export default AboutUs;
