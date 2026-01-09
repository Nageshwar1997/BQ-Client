const Ethics = () => {
  return (
    <div className="px-6 py-12 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Our Ethics & Values
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          At Beautinique, we believe beauty should uplift — not harm. Every
          choice we make reflects our commitment to purity, fairness,
          sustainability, and people-first values.
        </p>
      </header>
      {/* Core Principles */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Cruelty-Free",
            text: "We never test on animals — and never will.",
            icon: "🐰",
          },
          {
            title: "Clean Ingredients",
            text: "Formulated without harmful toxins, parabens or sulfates.",
            icon: "🌿",
          },
          {
            title: "Transparency",
            text: "Full ingredient honesty — no hidden chemicals or shortcuts.",
            icon: "🔍",
          },
          {
            title: "Sustainable Beauty",
            text: "Eco-friendly packaging and environmentally mindful sourcing.",
            icon: "♻️",
          },
          {
            title: "Ethical Sourcing",
            text: "We work only with vendors who follow fair trade & ethical labor practices.",
            icon: "🤝",
          },
          {
            title: "Dermat-Certified",
            text: "Every formula is clinically and dermatologically evaluated.",
            icon: "🧪",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-primary-1 border border-primary-30 rounded-2xl p-6 shadow-md shadow-primary-10 space-y-3 text-center"
          >
            <div className="text-4xl">{item.icon}</div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-tertiary">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Code of Conduct */}
      <section className="bg-primary-1 border border-primary-30 rounded-2xl p-8 shadow-md shadow-primary-10 space-y-4 text-center">
        <h2 className="text-2xl font-bold">Our Code of Conduct</h2>
        <p className="text-tertiary text-base max-w-2xl mx-auto">
          We maintain the highest ethical standards in formulation, sourcing,
          hiring, workplace culture, and customer trust. Every team member and
          partner represents our commitment to fairness, honesty, and respect.
        </p>
      </section>

      {/* Certifications */}
      <section className="text-center space-y-6">
        <h2 className="text-xl font-semibold">Certifications & Standards</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Cruelty-Free", "Vegan", "Dermat Tested", "Eco-Safe"].map(
            (badge) => (
              <div
                key={badge}
                className="min-w-40 bg-primary-1 border border-primary-30 shadow-primary-10 rounded-lg px-5 py-2 shadow-sm text-sm font-medium flex items-center justify-center gap-1"
              >
                <span>✅</span>
                <span>{badge}</span>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Ethics;
