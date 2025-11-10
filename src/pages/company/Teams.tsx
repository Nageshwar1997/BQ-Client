import { useMemo, useState } from "react";
import { DEPARTMENT_AND_TEAMS_DATA, TEAMS_DEPARTMENTS } from "./data";
import useHorizontalScrollable from "../../hooks/useHorizontalScrollable";
import { LeftGradient, RightGradient } from "../../components/Gradients";
import EmployeeCard from "./children/EmployeeCard";

const Teams = () => {
  const { containerRef, showGradient } = useHorizontalScrollable();
  const [selectedDept, setSelectedDept] = useState({
    title: "All",
    value: "",
  });

  const employees = useMemo(() => {
    if (selectedDept.value) {
      return (
        DEPARTMENT_AND_TEAMS_DATA.find(
          (dept) => dept.value === selectedDept.value
        )?.employees || []
      );
    } else {
      return DEPARTMENT_AND_TEAMS_DATA.flatMap((dept) => dept.employees) || [];
    }
  }, [selectedDept]);

  return (
    <div className="p-6 mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Meet Our Team
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Our dedicated professionals working to bring you the best in beauty
          and cosmetics.
        </p>
      </header>
      <div className="sticky top-16 bg-primary-inverted z-[1]">
        <div className="relative py-2">
          {showGradient.left && (
            <LeftGradient className="!w-10 md:!w-20 h-full" />
          )}
          {showGradient.right && (
            <RightGradient className="!w-10 md:!w-20 h-full" />
          )}
          <div
            className="flex gap-4 overflow-y-scroll scroll-smooth"
            ref={containerRef}
          >
            {[{ title: "All", value: "" }, ...TEAMS_DEPARTMENTS].map((dept) => (
              <div
                key={dept.value}
                className={`text-nowrap cursor-pointer font-semibold p-1 bg-clip-text text-transparent ${
                  selectedDept.value === dept.value
                    ? "bg-accent-duo"
                    : "bg-silver-duo hover:text-primary"
                }`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
        {employees.map((emp, index) => (
          <EmployeeCard
            key={index}
            employee={emp}
            isLead={!!(emp.description && selectedDept.value)}
          />
        ))}
      </main>
    </div>
  );
};

export default Teams;
