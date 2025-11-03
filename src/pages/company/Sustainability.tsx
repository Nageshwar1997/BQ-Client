const Sustainability = () => {
  return (
    <div className="px-6 py-12 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Sustainability & Responsibility
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          Sustainable beauty is not a choice — it's a commitment. From
          ingredients to packaging, we create consciously and responsibly to
          protect people and the planet.
        </p>
      </header>

      {/* Sustainable Pillars */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: "🌿",
            title: "Earth-Friendly Ingredients",
            text: "Natural, non-toxic and responsibly sourced ingredients — always.",
          },
          {
            icon: "♻️",
            title: "Recyclable Packaging",
            text: "Glass & PCR plastic packaging with minimal waste and re-use options.",
          },
          {
            icon: "💧",
            title: "Water-Responsible Formulation",
            text: "Water-conscious production and eco-safe wastewater policies.",
          },
          {
            icon: "🌱",
            title: "Plant-Based Beauty",
            text: "Vegan-friendly formulas rooted in botanicals and science.",
          },
          {
            icon: "🚚",
            title: "Sustainable Logistics",
            text: "Reduced-carbon shipping & green delivery partners (when available).",
          },
          {
            icon: "🧪",
            title: "Ethical R&D",
            text: "Dermat-tested, cruelty-free and consciously developed formulas.",
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
      {/* Eco Packaging Info */}
      <section className="bg-primary-1 border border-primary-30 rounded-2xl p-8 shadow-md shadow-primary-10 space-y-4 text-center">
        <h2 className="text-2xl font-bold">Packaging Commitment</h2>
        <p className="text-tertiary text-base max-w-2xl mx-auto">
          Our packaging strategy is built around reduction, re-use and recycling
          — because luxury and responsibility can exist together.
        </p>
      </section>
      {/* Climate Goals */}
      <section className="space-y-6 text-center">
        <h2 className="text-xl font-semibold">
          Our Path to Net-Positive Beauty
        </h2>
        <ul className="space-y-2 text-tertiary sm:text-base text-sm text-left mx-auto w-fit">
          <li>✅ Carbon-conscious supply chain</li>
          <li>✅ Long-term net-zero commitment</li>
          <li>✅ Ethical vendor standards</li>
          <li>✅ Continuous R&D for greener solutions</li>
        </ul>

        <p className="text-sm text-tertiary max-w-xl mx-auto">
          Sustainability is a journey — we evolve, innovate and stay
          accountable.
        </p>
      </section>
    </div>
  );
};

export default Sustainability;
