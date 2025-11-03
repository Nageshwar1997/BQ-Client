import { Link } from "react-router-dom";
import { BRAND_FEATURE_HIGHLIGHTS } from "../../constants";

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
          {["TOI", "Vogue", "Elle", "Cosmopolitan"].map((name, index) => (
            <img
              key={index}
              src={`/images/company/press-media/${name}.webp`}
              alt="Times of India"
              className={`w-16 h-16 base:w-20 base:h-20 md:h-40 md:w-40 aspect-square rounded-xl object-contain border border-primary-30 shadow-sm shadow-primary-30 p-2 ${
                name === "TOI" ? "bg-[#D32000]" : "bg-white"
              }`}
            />
          ))}
        </div>
      </section>
      <section className="space-y-5 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Brand Feature Highlights
        </h2>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {BRAND_FEATURE_HIGHLIGHTS.map(({ title, description, image }) => (
            <div className="rounded-2xl overflow-hidden shadow-md bg-primary-1 shadow-primary-10 border border-primary-30">
              <img
                src={`/images/company/press-media/${image}`}
                alt="Magazine"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2 border-t border-t-primary-30">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-tertiary">{description}</p>
              </div>
            </div>
          ))}
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
