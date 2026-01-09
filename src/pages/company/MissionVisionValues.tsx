import { Link } from "react-router-dom";
import EmployeeCard from "./children/EmployeeCard";
import { DEPARTMENT_AND_TEAMS_DATA } from "./data";
import Button from "../../components/button/Button";

const stats = [
  { number: "150+", label: "Success Stories" },
  { number: "1B+", label: "Users Served" },
  { number: "56+", label: "Team Members" },
  { number: "30+", label: "Winning Awards" },
];

const MissionVisionValues = () => {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto space-y-16">
      {/* Header Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent text-center mb-4">
            Crafting Excellence{" "}
            <span className="bg-clip-text text-transparent bg-accent-duo">
              Together
            </span>
          </h1>
          <p className="text-base sm:text-lg text-tertiary leading-relaxed mb-6">
            We believe in the power of collaboration to achieve outstanding
            results. With a dedicated team and a commitment to quality, we work
            hand-in-hand with our partners to bring ideas to life.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
            {stats.map((stat, index) => (
              <div key={index}>
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-silver-duo text-center">
                  {stat.number}
                </h3>
                <p className="text-primary-50 text-center mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <img
          src="/images/company/mission-vision-values/team-up.webp"
          alt="Team Working"
          className="rounded-2xl shadow-md object-cover w-full h-96"
        />
      </section>
      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <img
          src="/images/company/mission-vision-values/mission.webp"
          alt="Our Mission"
          className="rounded-2xl shadow-md object-cover w-full h-96"
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg text-tertiary">
            To deliver exceptional service that exceeds client expectations
            through innovation, collaboration, and integrity — fostering
            sustainable growth and empowering communities.
          </p>
          <ul className="space-y-2 text-base sm:text-lg text-tertiary">
            <li>✅ Fostering Sustainable Development</li>
            <li>✅ Building Stronger Communities</li>
            <li>✅ Promoting Green Innovation</li>
          </ul>
        </div>
      </section>
      {/* Vision Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Our Vision
          </h2>
          <p className="text-base sm:text-lg text-tertiary">
            Our vision is to redefine industry standards through innovation and
            sustainability — creating meaningful impact for future generations.
          </p>
          <ul className="space-y-2 text-base sm:text-lg text-tertiary">
            <li>✅ Inspiring Modern Architecture</li>
            <li>✅ Empowering Communities</li>
            <li>✅ Leading Sustainable Innovation</li>
          </ul>
        </div>
        <img
          src="/images/company/mission-vision-values/vision.webp"
          alt="Our Vision"
          className="rounded-2xl shadow-md object-cover w-full h-96"
        />
      </section>
      {/* Values Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <img
          src="/images/company/mission-vision-values/values.webp"
          alt="Our Values"
          className="rounded-2xl shadow-md object-cover w-full h-96"
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
            Our Values
          </h2>
          <p className="text-base sm:text-lg text-tertiary">
            Our Values is to redefine industry standards through innovation and
            sustainability — creating meaningful impact for future generations.
          </p>
          <ul className="space-y-2 text-base sm:text-lg text-tertiary">
            <li>✅ Inspiring Modern Architecture</li>
            <li>✅ Empowering Communities</li>
            <li>✅ Leading Sustainable Innovation</li>
          </ul>
        </div>
      </section>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      {/* Team Section */}
      <section className="space-y-10">
        <h1 className="text-4xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent text-center">
          Meet Our{" "}
          <Link
            to="/teams"
            className="font-semibold bg-clip-text bg-accent-duo text-transparent"
          >
            Team
          </Link>
        </h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
          {DEPARTMENT_AND_TEAMS_DATA[0].employees.map((employee, i) => (
            <EmployeeCard key={i} employee={employee} />
          ))}
        </div>
      </section>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      {/* Footer Call to Action */}
      <section className="text-center">
        <h1 className="text-4xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent text-center mb-4">
          Let’s Create Excellence Together
        </h1>
        <p className="text-base sm:text-lg text-tertiary leading-relaxed">
          Ready to collaborate and innovate? Join hands with us to build a
          sustainable and brighter future.
        </p>
        <Link to="/careers" className="block mt-8">
          <Button
            pattern="secondary"
            content="Get in Touch"
            className="max-w-xs mx-auto rounded-full!"
          />
        </Link>
      </section>
    </div>
  );
};

export default MissionVisionValues;
