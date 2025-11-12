import { ClassName, IDepartment } from "../../../types";

const EmployeeCard = ({
  isLead = false,
  employee,
  className = "",
}: {
  isLead?: boolean;
  employee: IDepartment["employees"][number];
} & ClassName) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-md shadow-primary-10 bg-primary-30 hover:bg-accent-duo p-0.5 w-full ${
        isLead ? "sm:col-span-2" : ""
      } ${className}`}
    >
      <div className="rounded-[14px] bg-primary-inverted shadow-light-dark-soft text-center">
        <div className="flex flex-col sm:flex-row">
          <div className={`h-full relative ${isLead ? "sm:w-2/5" : "w-full"}`}>
            <img
              src={employee.image}
              alt={employee.name}
              className="w-full h-56 object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-gradient-to-t from-primary-inverted to-transparent px-4 py-2 pt-4 space-y-0.5 rounded-b-[14px]">
              <h3 className="font-semibold bg-clip-text text-transparent bg-silver-duo text-center">
                {employee.name}
              </h3>
              <p className="text-tertiary text-center border border-primary-30 w-fit mx-auto px-2 py-0.5 rounded-full text-xs">
                {employee.role}
              </p>
            </div>
          </div>
          {isLead && (
            <div className="flex-1 flex flex-col gap-3 p-4 italic">
              <h3 className="line-clamp-2 leading-5 text-xl font-semibold text-secondary">
                {employee.description?.title}
              </h3>
              <q className="line-clamp-[7] text-base/5 text-tertiary">
                {employee.description?.description}
              </q>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
