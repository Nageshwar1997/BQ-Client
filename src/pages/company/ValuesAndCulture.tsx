import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import CustomCursorVideoSection from "../../components/videoPlayers/CustomCursorVideoSection";
import { valuesSystem } from "./data";

const ValuesAndCulture = () => {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto space-y-12 lg:space-y-16">
      {/* Header */}
      <header className="text-center flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          The Heartbeat of Who We Are
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-3xl mx-auto">
          At
          <Link
            to="/"
            className="bg-clip-text bg-accent-duo text-transparent font-semibold"
          >
            {" "}
            Beautinique,{" "}
          </Link>
          our values go beyond beauty—they define who we are. Every product we
          craft and every experience we create is rooted in authenticity,
          innovation, and care. We believe true beauty begins with trust,
          passion, and purpose. Our culture inspires creativity, empowers
          confidence, and brings together a community that celebrates
          individuality and self-expression.
        </p>
        <div className="relative w-full mt-6 lg:mt-8 rounded-2xl lg:rounded-3xl shadow-lg shadow-primary-10 overflow-hidden">
          <img
            src="/images/company/values-culture/who-we-are.webp"
            alt="The Heartbeat of Who We Are"
          />
          <div className="absolute bottom-0 inset-x-0 p-4 lg:p-8 bg-gradient-to-t from-[#23233a] to-transparent">
            <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Values System
            </h1>
          </div>
        </div>
      </header>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {valuesSystem.map((data, index) => (
          <div
            key={index}
            className="border-rounded-corners-gradient rounded-3xl overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 bg-primary-inverted shadow-light-dark-soft p-8 lg:pr-12 h-full">
              <img
                src={`/images/company/values-culture/values/${data.title}.svg`}
                alt={data.title}
                className="w-16 h-16 object-contain light:mix-blend-difference"
              />
              <div className="flex flex-col gap-4 h-full">
                <h4 className="text-lg/5 font-medium text-center lg:text-start text-primary">
                  {data.title}
                </h4>
                <p className="text-description font-metropolis text-xs font-normal leading-[18px] text-center lg:text-start">
                  {data.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <div className="relative w-full mt-6 lg:mt-8 rounded-2xl lg:rounded-3xl shadow-lg shadow-primary-10  overflow-hidden">
        <img
          src="/images/company/values-culture/All-Group.webp"
          alt="Life & Values at Beautinique"
          className="w-full h-auto object-contain aspect-video"
        />
        <div className="absolute bottom-0 inset-x-0 p-4 lg:p-8 bg-gradient-to-t from-[#23233a] to-transparent">
          <h1 className="font-bold text-white text-lg base:text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-5 text-center">
            Life & Values at Beautinique
          </h1>
        </div>
      </div>
      <div className="columns-2 md:columns-3 gap-6 md:gap-8 w-full mx-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <img
            key={index}
            src={`/images/company/values-culture/grid/${index + 1}.webp`}
            alt={`img-${index}`}
            className="w-full h-full object-cover aspect-square rounded-lg md:rounded-xl mb-6 md:mb-8"
          />
        ))}
      </div>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <section className="flex flex-col md:flex-row gap-10 items-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl base:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Embracing the Beautifully Unique
          </h2>
          <p className="text-sm lg:text-base text-tertiary">
            At
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique,{" "}
            </Link>
            we don’t just accept your uniqueness — we celebrate it! Whether
            you’re a bold makeup lover who rocks glitter at brunch, a minimalist
            who swears by a nude palette, or someone who experiments with color
            like it’s art — there’s a place for you here.
          </p>
          <p className="text-sm lg:text-base text-tertiary">
            Our community thrives on diversity, self-expression, and confidence.
            We believe that beauty isn’t about fitting in — it’s about standing
            out in your own authentic way. After all, in the world of beauty,
            there’s no one shade of perfection — just your own.
          </p>
        </div>
        <img
          src="/images/company/values-culture/Embracing-the-Beautifully-Unique.webp"
          alt="Embracing the Beautifully Unique"
          className="rounded-2xl shadow-xl shadow-primary-10 border-2 border-primary-30 object-cover w-full max-h-96 h-auto"
        />
      </section>
      <section className="flex flex-col-reverse md:flex-row gap-10 items-center">
        <img
          src="/images/company/values-culture/Growth-Giggles-and-Glam.webp"
          alt="Growth, Giggles, and Glam"
          className="rounded-2xl shadow-xl shadow-primary-10 border-2 border-primary-30 object-cover w-full max-h-96 h-auto"
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl base:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Growth, Giggles, and Glam
          </h2>
          <p className="text-sm lg:text-base text-tertiary">
            At
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique,{" "}
            </Link>
            we believe that creativity blooms when you’re having fun. Our
            culture blends passion with play — because beauty should always be
            joyful! From product brainstorms that feel more like coffee chats to
            laughter-filled moments during campaign shoots, we make sure every
            idea is born from a relaxed, inspired mind.
          </p>
          <p className="text-sm lg:text-base text-tertiary">
            After all, the best glow comes not just from makeup, but from the
            energy and happiness behind it.
          </p>
        </div>
      </section>
      <section className="flex flex-col md:flex-row gap-10 items-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl base:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Collaborative Chaos (The Beautiful Kind)
          </h2>
          <p className="text-sm lg:text-base text-tertiary">
            At
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique,{" "}
            </Link>
            creativity doesn’t happen in silence — it sparkles in collaboration.
            Our workspace is a colorful blend of ideas, mood boards, and makeup
            swatches — where inspiration strikes anywhere, from a shared coffee
            moment to a spontaneous product photoshoot brainstorm.
          </p>
          <p className="text-sm lg:text-base text-tertiary">
            We thrive on open conversations, shared laughter, and the magic that
            happens when diverse minds come together. Whether it’s planning our
            next campaign over chai or dropping the perfect meme in our team
            chat, every idea — and every voice — matters here. Because at
            Beautinique, every shade of creativity counts.
          </p>
        </div>
        <img
          src="/images/company/values-culture/Collaborative-Chaos-(The-Beautiful-Kind).webp"
          alt="Collaborative Chaos (The Beautiful Kind)"
          className="rounded-2xl shadow-xl shadow-primary-10 border-2 border-primary-30 object-cover w-full max-h-96 h-auto"
        />
      </section>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <CustomCursorVideoSection
        videoUrl="/videos/company/values-culture/Get-Ready-With-BQ.mp4"
        title="Get Ready With BQ"
      />
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <div className="relative w-full rounded-2xl lg:rounded-3xl shadow-lg border border-secondary-30 shadow-primary-10 overflow-hidden">
        <img
          src="/images/company/values-culture/Group-with-Trophy.webp"
          alt="A Culture of Creativity, Collaboration & Dedication"
          className="object-cover origin-center w-full h-full max-h-[700px]"
        />
        <div className="absolute bottom-0 inset-x-0 p-4 lg:p-8 bg-gradient-to-t from-primary-inverted to-transparent">
          <h1 className="font-bold text-primary text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            A Culture of Creativity, Collaboration & Dedication
          </h1>
        </div>
      </div>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <section className="flex flex-col-reverse md:flex-row gap-10 items-center">
        <img
          src="/images/company/values-culture/Pushing-the-Boundaries-of-Beauty.webp"
          alt="Pushing the Boundaries of Beauty"
          className="rounded-2xl shadow-xl shadow-primary-10 border-2 border-primary-30 object-contain aspect-square w-fit max-h-96"
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl base:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Pushing the Boundaries of Beauty
          </h2>
          <p className="text-sm lg:text-base text-tertiary">
            At
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique,{" "}
            </Link>
            creativity isn’t just encouraged — it’s our essence. We’re
            constantly exploring new ways to blend innovation, artistry, and
            technology to redefine what beauty means in today’s world. From
            trend-setting product formulations to immersive digital shopping
            experiences, we dare to think beyond the ordinary.
          </p>
          <p className="text-sm lg:text-base text-tertiary">
            Our world is a playground for dreamers and doers — where bold ideas,
            fresh perspectives, and fearless experimentation come together to
            create something truly beautiful. Because at
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique,{" "}
            </Link>
            innovation is the new makeup of confidence.
          </p>
        </div>
      </section>
      <section className="flex flex-col md:flex-row gap-10 items-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl base:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Collaborative Synergy
          </h2>
          <i className="sm:text-lg lg:text-xl font-bold tracking-tight text-secondary">
            More Than Just Teamwork
          </i>
          <p className="text-sm lg:text-base text-tertiary">
            At
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique,{" "}
            </Link>
            collaboration is our secret ingredient. We’ve built a vibrant space
            where creators, designers, and beauty enthusiasts work side by side
            — inspiring, experimenting, and elevating each other every step of
            the way.
          </p>
          <p className="text-sm lg:text-base text-tertiary">
            Our synergy doesn’t stop at our desks — it extends to our incredible
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique{" "}
            </Link>
            community. We listen, learn, and evolve with our customers, shaping
            products and experiences that reflect real people, real beauty, and
            real stories.
            <br />
            Because together, we don’t just create cosmetics — we create
            confidence, connection, and change.
          </p>
        </div>
        <img
          src="/images/company/values-culture/Collaborative-Synergy.webp"
          alt="Collaborative Synergy"
          className="rounded-2xl shadow-xl shadow-primary-10 border-2 border-primary-30 object-contain aspect-square w-fit max-h-96"
        />
      </section>
      <section className="flex flex-col-reverse md:flex-row gap-10 items-center">
        <img
          src="/images/company/values-culture/Empowering-Individual-Growth-Within-a-Collective-Vision.webp"
          alt="Empowering Individual Growth Within a Collective Vision"
          className="rounded-2xl shadow-xl shadow-primary-10 border-2 border-primary-30 object-contain aspect-square w-fit max-h-96"
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl base:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Empowering Individual Growth Within a Collective Vision
          </h2>
          <p className="text-sm lg:text-base text-tertiary">
            At
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique,{" "}
            </Link>
            we believe that true beauty begins with growth — both personal and
            collective. We’re building a community of passionate individuals who
            are constantly learning, evolving, and redefining what beauty can
            be.
          </p>
          <p className="text-sm lg:text-base text-tertiary">
            Every achievement — big or small — is celebrated as part of our
            shared journey. We nurture creativity, encourage experimentation,
            and empower our team to reach their full potential. Because when
            each of us shines,
            <Link
              to="/"
              className="bg-clip-text bg-accent-duo text-transparent font-semibold"
            >
              {" "}
              Beautinique{" "}
            </Link>
            shines brighter together.
          </p>
        </div>
      </section>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
          Together Turning Dreams into Reality,
        </h2>
        <p className="text-tertiary max-w-2xl mx-auto mb-6">
          At
          <Link
            to="/"
            className="bg-clip-text bg-accent-duo text-transparent font-semibold"
          >
            {" "}
            Beautinique,{" "}
          </Link>
          our mission is simple yet powerful — to redefine beauty in the digital
          age. We’re blending creativity, technology, and passion to craft
          experiences that inspire confidence and self-expression.
        </p>
        <p className="text-tertiary max-w-2xl mx-auto mb-6">
          Here, every idea starts as a dream — and together, we turn those
          dreams into something truly beautiful. Along the way, we grow, learn,
          and create products and experiences that empower people to see beauty
          not just in the mirror, but in themselves.
        </p>
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <Link to="/teams">
            <Button
              pattern="secondary"
              content="Meat the Team"
              className="max-w-xs mx-auto"
            />
          </Link>
          <Link to="/careers">
            <Button
              pattern="primary"
              content="Join the Team"
              className="max-w-xs mx-auto"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ValuesAndCulture;
