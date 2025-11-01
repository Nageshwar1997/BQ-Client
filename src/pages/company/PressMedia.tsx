import { Link } from "react-router-dom";

const PressMedia = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Press & Media
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Explore our media coverage, brand stories, and exclusive interviews.
        </p>
        <br />
        <h2 className="text-xl sm:text-2xl font-semibold">
          Beauty Insider India
        </h2>
        <p className="text-base italic sm:text-lg text-tertiary">
          "
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>
          &nbsp;is redefining modern beauty with innovation, transparency, and
          care — bringing nature-powered elegance to every skin tone."
        </p>
      </header>
      <section className="space-y-5 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Featured In
        </h2>
        <div className="flex flex-wrap gap-3 base:gap-4 sm:gap-6 items-center justify-center">
          <img
            src="/images/company/press-media/TOI.webp"
            alt="Times of India"
            className="w-16 h-16 base:w-20 base:h-20 md:h-40 md:w-40 aspect-square rounded-xl object-contain bg-[#D32000] border border-primary-30 shadow-sm shadow-primary-30"
          />
          <img
            src="/images/company/press-media/Vogue.webp"
            alt="Vogue"
            className="w-16 h-16 base:w-20 base:h-20 md:h-40 md:w-40 aspect-square rounded-xl p-2 object-contain bg-white border border-primary-30 shadow-sm shadow-primary-30"
          />
          <img
            src="/images/company/press-media/Elle.webp"
            alt="Elle"
            className="w-16 h-16 base:w-20 base:h-20 md:h-40 md:w-40 aspect-square rounded-xl object-contain border border-primary-30 shadow-sm shadow-primary-30"
          />
          <img
            src="/images/company/press-media/Cosmopolitan.webp"
            alt="Cosmopolitan"
            className="w-16 h-16 base:w-20 base:h-20 md:h-40 md:w-40 aspect-square rounded-xl bg-white object-contain p-1 border border-primary-30 shadow-sm shadow-primary-30"
          />
        </div>
      </section>
      <section className="space-y-5 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Brand Feature Highlights
        </h2>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          <div className="rounded-2xl overflow-hidden shadow-md bg-primary-1 shadow-primary-10 border border-primary-30">
            <img
              src="/images/company/press-media/ELLE-India-Award.webp"
              alt="Elle India Feature"
              className="w-full h-48 object-cover object-top"
            />
            <div className="p-4 space-y-2 border-t border-t-primary-30">
              <h3 className="font-semibold">ELLE India Award</h3>
              <p className="text-sm text-tertiary">
                Beautinique featured in ELLE India for redefining modern clean
                beauty standards.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md bg-primary-1 shadow-primary-10 border border-primary-30">
            <img
              src="/images/company/press-media/Vogue-India-Special-Edition.webp"
              alt="Magazine feature"
              className="w-full h-48 object-cover object-top"
            />
            <div className="p-4 space-y-2 border-t border-t-primary-30">
              <h3 className="font-semibold">Vogue India Special Edition</h3>
              <p className="text-sm text-tertiary">
                Beautinique named as one of the top emerging beauty brands to
                watch.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md bg-primary-1 shadow-primary-10 border border-primary-30">
            <img
              src="/images/company/press-media/Cosmopolitan-Beauty-Awards.webp"
              alt="Magazine"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2 border-t border-t-primary-30">
              <h3 className="font-semibold">Cosmopolitan Beauty Awards</h3>
              <p className="text-sm text-tertiary">
                Award nominee for Best Natural Skincare Line 2025.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md bg-primary-1 shadow-primary-10 border border-primary-30">
            <img
              src="/images/company/press-media/Times-Lifestyle-Feature.webp"
              alt="Press shoot"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2 border-t border-t-primary-30">
              <h3 className="font-semibold">Times Lifestyle Feature</h3>
              <p className="text-sm text-tertiary">
                Interview with our founder on ethical beauty & clean formulas.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-5 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Exclusive Interview
        </h2>
        <iframe
          className="w-full h-full aspect-video rounded-2xl shadow-lg shadow-primary-10"
          src="https://www.youtube.com/embed/iJyK1-gvjrE?si=gUzKP3fb7HCH9FnT"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </section>
      <section className="space-y-3 sm:space-y-4 text-center ">
        <h2 className="text-xl sm:text-2xl font-semibold">Press Contact</h2>
        <p className="text-sm sm:text-base">
          For press inquiries, collaboration, and media kits, email us at:
        </p>
        <Link
          to="mailto:beautinique.bq@gmail.com"
          className="text-accent-duo font-semibold hover:underline"
        >
          <strong className="bg-clip-text bg-accent-duo text-transparent">
            beautinique.bq@gmail.com
          </strong>
        </Link>
      </section>

      <p className="text-sm sm:text-base text-center font-semibold">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default PressMedia;
