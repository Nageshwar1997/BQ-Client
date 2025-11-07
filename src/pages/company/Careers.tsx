import { useMemo, useState } from "react";
import { LeftGradient, RightGradient } from "../../components/Gradients";
import { OPENINGS_DATA } from "./data/data";
import useHorizontalScrollable from "../../hooks/useHorizontalScrollable";
import OpeningCard from "./children/OpeningCard";
import { IOpening } from "../../types";
import ShowApiStatus from "../../components/api-status/ShowApiStatus";

const Careers = () => {
  const { containerRef, showGradient } = useHorizontalScrollable();
  const [selectedDept, setSelectedDept] = useState<IOpening["department"]>(
    OPENINGS_DATA[0].department
  );

  const openings = useMemo(() => {
    if (selectedDept.value && selectedDept.value !== "all") {
      return (
        OPENINGS_DATA.find(
          (data) => data.department.value === selectedDept.value
        )?.openings || []
      );
    } else {
      return OPENINGS_DATA.flatMap((data) => data.openings) || [];
    }
  }, [selectedDept]);

  return (
    <div className="p-6 mx-auto space-y-10">
      <header className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Join the Future of Beauty
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Join a dynamic team of innovators, thinkers, and beauty enthusiasts
          working together to shape the future of the beauty industry.
        </p>
      </header>
      <div className="sticky top-16 bg-primary-inverted z-[1] border-b border-b-tertiary">
        <div className="relative">
          {showGradient.left && <LeftGradient className="!w-20 h-full" />}
          {showGradient.right && <RightGradient className="!w-20 h-full" />}
          <div
            className="flex gap-1 overflow-y-scroll scroll-smooth"
            ref={containerRef}
          >
            {OPENINGS_DATA.map((opening) => {
              const current = selectedDept.value === opening.department.value;
              const color = opening.department.color;
              return (
                <div
                  key={opening.department.value}
                  className="p-2 border-b border-transparent"
                  style={
                    current && color
                      ? {
                          background: `radial-gradient(39.35% 50% at 50.37% 100%, ${color}4d 0%, ${color}00 100%), linear-gradient(0deg, var(--primary-inverted) 0%, var(--primary-inverted) 100%), var(--primary-inverted)`,
                          borderImage: `linear-gradient(to right, ${color}00, ${color},  ${color}00)`,
                          borderImageSlice: 1,
                        }
                      : {}
                  }
                >
                  <div
                    className={`text-nowrap cursor-pointer font-semibold p-1 bg-clip-text text-transparent ${
                      current
                        ? "bg-accent-duo"
                        : "bg-silver-duo hover:text-primary"
                    }`}
                    onClick={() => setSelectedDept(opening.department)}
                  >
                    {opening.department.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {openings.length > 0 ? (
        <main className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
          {openings.map((opening, index) => (
            <OpeningCard
              key={index}
              opening={opening}
              department={
                selectedDept.value === "all"
                  ? OPENINGS_DATA.find((d) => d.openings.includes(opening))!
                      .department
                  : selectedDept
              }
            />
          ))}
        </main>
      ) : (
        <ShowApiStatus
          headingText="No Vacancies today, but keep an eye out."
          descriptionText="Your perfect fit might be coming soon!"
          type="empty"
          className="min-h-[50dvh]"
        />
      )}
    </div>
  );
};

export default Careers;
