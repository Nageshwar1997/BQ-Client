import { useMemo, useState } from "react";
import { LeftGradient, RightGradient } from "../../components/Gradients";
import { OPENINGS_DATA, OPENINGS_DEPARTMENTS } from "../../constants";
import useHorizontalScrollable from "../../hooks/useHorizontalScrollable";

const Careers = () => {
  const { containerRef, showGradient } = useHorizontalScrollable();
  const [selectedDept, setSelectedDept] = useState({
    title: "All",
    value: "",
  });

  const openings = useMemo(() => {
    if (selectedDept.value) {
      return (
        OPENINGS_DATA.find(
          (data) => data.department.value === selectedDept.value
        )?.openings || []
      );
    } else {
      return OPENINGS_DATA.flatMap((data) => data.openings) || [];
    }
  }, [selectedDept]);

  console.log("openings", openings);
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
      <div className="sticky top-16 bg-primary-inverted z-[1]">
        <div className="relative py-2">
          {showGradient.left && <LeftGradient className="!w-20 h-full" />}
          {showGradient.right && <RightGradient className="!w-20 h-full" />}
          <div
            className="flex gap-4 overflow-y-scroll scroll-smooth"
            ref={containerRef}
          >
            {[{ title: "All", value: "" }, ...OPENINGS_DEPARTMENTS].map(
              (dept) => (
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
              )
            )}
          </div>
        </div>
      </div>

      <main className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
        {/* {openings.map((opening, index) => {
          const isLead = emp.description && selectedDept.value;
          return (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden shadow-md shadow-primary-10 bg-primary-30 hover:bg-accent-duo p-0.5 w-full ${
                isLead ? "sm:col-span-2" : ""
              }`}
            >
              <div className="rounded-[14px] bg-primary-inverted shadow-light-dark-soft text-center">
                <div className="flex flex-col sm:flex-row">
                  <div
                    className={`h-full relative ${
                      isLead ? "sm:w-2/5" : "w-full"
                    }`}
                  >
                    <img
                      src={emp.image}
                      alt={emp.name}
                      className="w-full h-56 object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-gradient-to-t from-primary-inverted to-transparent px-4 py-2 pt-4 space-y-0.5 rounded-b-[14px]">
                      <h3 className="font-semibold bg-clip-text text-transparent bg-silver-duo text-center">
                        {emp.name}
                      </h3>
                      <p className="text-tertiary text-center border border-primary-30 w-fit mx-auto px-2 py-0.5 rounded-full text-xs">
                        {emp.role}
                      </p>
                    </div>
                  </div>
                  {isLead && (
                    <div className="flex-1 flex flex-col gap-3 p-4 italic">
                      <h3 className="line-clamp-2 leading-5 text-xl font-semibold text-secondary">
                        {emp.description?.title}
                      </h3>
                      <q className="line-clamp-[7] text-base/5 text-tertiary">
                        {emp.description?.description}
                      </q>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })} */}
      </main>
    </div>
  );
};

export default Careers;
