import { Link } from "react-router-dom";

const Accessibility = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Accessibility Statement
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          At Beautinique, we are committed to ensuring our beauty experience is
          inclusive and accessible to everyone.
        </p>
      </header>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Our Commitment</h2>
        <p className="text-sm sm:text-base">
          We strive to provide an accessible and seamless shopping experience
          for all our customers, including individuals with diverse abilities.
          We continuously work to improve usability, performance, and
          inclusivity across our platform.
        </p>
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Features We Support
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
          <li>Keyboard navigation support</li>
          <li>Screen reader friendly content</li>
          <li>High-contrast dark/light themes</li>
          <li>Clear focus indicators and accessible forms</li>
          <li>Alternative text for images & media</li>
        </ul>
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Continuous Improvements
        </h2>
        <p className="text-sm sm:text-base">
          We regularly audit and enhance our site based on WCAG 2.1 standards to
          make sure our beauty products, tutorials, and try‑on experiences can
          be enjoyed by everyone.
        </p>
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Feedback</h2>
        <p className="text-sm sm:text-base">
          If you encounter any accessibility barriers or have suggestions to
          help us improve, we’d love to hear from you.
        </p>
        <div className="rounded-2xl shadow-sm flex flex-col base:flex-row base:items-center justify-start gap-1">
          <p className="font-medium">Contact us at: </p>
          <Link
            to="mailto:beautinique.bq@gmail.com"
            className="font-semibold bg-clip-text bg-accent-duo text-transparent"
          >
            beautinique.bq@gmail.com
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Accessibility;
