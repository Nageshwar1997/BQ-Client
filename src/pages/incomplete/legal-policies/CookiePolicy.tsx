import { Link } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Cookie Policy
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          This page explains how <strong>Beautinique</strong> uses cookies on
          our website.
        </p>
      </header>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">What Are Cookies?</h2>
        <p className="text-sm sm:text-base">
          Cookies are small text files stored on your device when you visit a
          website. They help enhance your browsing experience, remember your
          preferences, and collect information about website usage.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          How We Use Cookies
        </h2>
        <p className="text-sm sm:text-base">
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>{" "}
          uses cookies for purposes such as:
        </p>
        <ul className="list-disc pl-5 text-sm sm:text-base space-y-1">
          <li>Remembering user preferences and login information.</li>
          <li>Analyzing website traffic and performance.</li>
          <li>Personalizing content and recommendations.</li>
          <li>Improving website functionality and user experience.</li>
        </ul>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Third-Party Cookies
        </h2>
        <p className="text-sm sm:text-base">
          Some cookies may be set by third-party services, such as analytics or
          advertising providers, to help us understand how our website is used
          and deliver relevant content.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Managing Cookies</h2>
        <p className="text-sm sm:text-base">
          You can control or disable cookies through your browser settings.
          However, some website features may not function properly if cookies
          are disabled.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Consent</h2>
        <p className="text-sm sm:text-base">
          By continuing to use our website, you consent to the use of cookies as
          described in this policy. For more details or questions, please{" "}
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

export default CookiePolicy;
