import { useMemo, useState } from "react";
import { LeftGradient, RightGradient } from "../../components/Gradients";
import { departmentConfigMap, OPENINGS_DATA } from "../../constants";
import useHorizontalScrollable from "../../hooks/useHorizontalScrollable";
import OpeningCard from "./children/OpeningCard";
import { TBaseDept } from "../../types";

const Careers = () => {
  const { containerRef, showGradient } = useHorizontalScrollable();
  const [selectedDept, setSelectedDept] = useState<TBaseDept>({
    title: "All",
    value: "all",
  });

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
      <header className="text-center space-y-3 sm:space-y-4">
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
              const config = departmentConfigMap[opening.department.value];
              return (
                <div
                  key={opening.department.value}
                  className={`p-2 border-b border-transparent ${
                    current
                      ? // ? `${departmentConfigMap[dept.value]?.headingClass}`
                        ""
                      : ""
                  }`}
                  style={
                    current && config
                      ? {
                          background: `radial-gradient(39.35% 50% at 50.37% 100%, ${config.color}4d 0%, ${config.color}00 100%), linear-gradient(0deg, var(--primary-inverted) 0%, var(--primary-inverted) 100%), var(--primary-inverted)`,
                          borderImage: `linear-gradient(to right, ${config?.color}00, ${config?.color},  ${config?.color}00)`,
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
            selectedDept={selectedDept}
          />
        ))}
      </main>
    </div>
  );
};

export default Careers;
