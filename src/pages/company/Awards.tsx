const Awards = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-y-10">
      {/* Header */}
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Our Awards & Recognitions
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          We’re proud to be recognized for our innovation, sustainability, and
          commitment to excellence. Each award reflects our passion for
          redefining beauty and empowering confidence across the globe.
        </p>
      </header>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      {/* Awards List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          {
            title: "Best Beauty Brand 2024",
            org: "Global Beauty Awards",
            desc: "Honored for our innovative product formulations and ethical practices that set new industry benchmarks.",
          },
          {
            title: "Sustainability Excellence Award",
            org: "Eco Beauty Forum",
            desc: "Recognized for our eco-conscious packaging and sustainable sourcing initiatives.",
          },
          {
            title: "Customer Choice Award",
            org: "Beauty Buzz Magazine",
            desc: "Voted by consumers as the most trusted and loved beauty brand of the year.",
          },
          {
            title: "Innovation in Skincare 2023",
            org: "Cosmetic Science Association",
            desc: "Awarded for pioneering skincare technology that blends science with nature.",
          },
          {
            title: "Retail Experience Award",
            org: "Modern Retail Council",
            desc: "Acknowledged for delivering immersive and personalized in-store beauty experiences.",
          },
          {
            title: "Global Impact Recognition",
            org: "International Business Awards",
            desc: "Celebrated for empowering communities through inclusive beauty and ethical practices.",
          },
        ].map((award, index) => (
          <div
            className="rounded-2xl overflow-hidden bg-primary-30 hover:bg-accent-duo p-0.5 w-full shadow-md hover:shadow-lg shadow-primary-10 hover:shadow-primary-30 transition-shadow duration-100"
            key={index}
          >
            <div className="bg-primary-inverted shadow-light-dark-soft p-8 rounded-[14px] h-full">
              <h3 className="text-xl font-semibold text-tertiary mb-2">
                {award.title}
              </h3>
              <p className="text-sm text-rose-c font-medium mb-3">
                {award.org}
              </p>
              <p className="text-secondary-50 text-sm">{award.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <hr className="w-full h-px block border-none bg-gradient-line mt-4" />
      {/* Closing Statement */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-semibold bg-clip-text bg-silver-duo text-transparent mb-4">
          Inspired to Keep Growing
        </h2>
        <p className="text-tertiary max-w-3xl mx-auto">
          Every recognition motivates us to innovate further and make beauty
          more inclusive, sustainable, and transformative for everyone.
        </p>
      </div>
    </section>
  );
};

export default Awards;
