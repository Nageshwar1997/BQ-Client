import { Link } from "react-router-dom";

const Disclaimer = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Disclaimer
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          This disclaimer may be updated periodically to reflect changes in our
          policies or regulations.
        </p>
      </header>
      <p className="text-sm sm:text-base">
        Welcome to{" "}
        <Link to="/">
          <strong className="bg-clip-text bg-accent-duo text-transparent">
            Beautinique
          </strong>
        </Link>
        . All information, products, and services provided on this website are
        intended solely for general informational and beauty enhancement
        purposes. By accessing this site, you acknowledge and agree to the terms
        outlined in this disclaimer.
      </p>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Not Medical Advice
        </h2>
        <p className="text-sm sm:text-base">
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>
          &nbsp;does not provide medical, dermatological, or professional
          skincare advice. Always consult a qualified healthcare or skincare
          professional before using any beauty or cosmetic product, particularly
          if you have underlying skin conditions, allergies, or medical
          concerns.
        </p>
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Product Information & Accuracy
        </h2>
        <p className="text-sm sm:text-base">
          We strive to provide accurate descriptions, ingredients, and usage
          details for all products. However, product packaging, ingredients, and
          shades may vary depending on manufacturer updates. Please refer to
          product labels for the most accurate information.
        </p>
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Patch Testing & Allergies
        </h2>
        <p className="text-sm sm:text-base">
          Individual skin results vary. We recommend performing a patch test
          before full application to avoid allergic reactions or sensitivities.
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>
          &nbsp;is not responsible for adverse reactions, breakouts, or skin
          sensitivities from product use.
        </p>
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">External Links</h2>
        <p className="text-sm sm:text-base">
          This website may include links to third‑party websites for additional
          information. We do not endorse or take responsibility for external
          content or privacy practices.
        </p>
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Limitation of Liability
        </h2>
        <p className="text-sm sm:text-base">
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>
          &nbsp;is not liable for any direct, indirect, or incidental damages
          resulting from product use, reliance on website content, or website
          access.
        </p>
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Your Consent</h2>
        <p className="text-sm sm:text-base">
          By using our website, you consent to this disclaimer and agree to all
          terms.
        </p>
      </section>
      <p className="text-sm sm:text-base text-center font-semibold">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Disclaimer;
