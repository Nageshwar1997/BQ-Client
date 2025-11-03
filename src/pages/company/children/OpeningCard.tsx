import { useMemo, useState } from "react";
import { departmentConfigMap } from "../data/data";
import { IOpening, TRoleOpening } from "../../../types";

const OpeningCard = ({
  opening,
  department,
}: {
  opening: TRoleOpening;
  department: IOpening["department"];
}) => {
  const [
    ,
    // isModalOpen
    setIsModalOpen,
  ] = useState(false);
  const departmentDetails = useMemo(
    () => departmentConfigMap[department.value],
    [department.value]
  );

  const Icon = departmentDetails?.icon;

  return (
    <div
      className={`flex w-[80%] md:w-full h-[272px] px-4 sm:px-[27px] pt-2 sm:pt-[27px] pb-2 sm:pb-[18px] flex-col items-center justify-center gap-6 shrink-0 rounded-[13px] border border-ctruh-divider-light bg-${departmentDetails?.bgClass} shadow-stats-card-glow`}
    >
      <div className="flex flex-col items-start gap-[18px] self-stretch justify-between w-full h-[228px]">
        <div className="flex justify-between items-start self-stretch">
          {Icon && <Icon className="w-12 h-12 border border-[red]" />}
          <div className="text-light-secondary text-[8px] font-metropolis not-italic font-normal leading-[9.6px] tracking-[0.8px] uppercase">
            {opening.location}
          </div>
        </div>
        <div className="flex flex-col items-start gap-[9px] self-stretch">
          <div className="flex flex-col items-start gap-[5.625px] self-stretch mb-[9px]">
            <div
              className="self-stretch font-metropolis text-[10px] not-italic font-bold leading-3 tracking-[2px] uppercase"
              style={{ color: departmentDetails?.color }}
            >
              {opening.role}
            </div>
            <div className="text-primary font-metropolis text-lg not-italic font-normal leading-[21.6px] self-stretch">
              {opening.role}
            </div>
          </div>
          <div className="flex flex-col items-start gap-[3px] self-stretch">
            <div className="text-ctruh-light-primary font-metropolis text-[9px] not-italic font-normal leading-[13.5px]">
              {opening.type}
            </div>
            <div className="flex items-start content-start gap-[4.5px] self-stretch flex-wrap">
              {opening?.tags?.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  className="flex py-[3px] px-1.5 justify-center items-center gap-1.5 rounded-[4px] bg-ctruh-divider-light text-primary font-metropolis text-[9px] not-italic font-semibold leading-[13px]"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit flex py-1.5 px-[18px] justify-center items-start gap-1.5 rounded-[22px] text-white font-metropolis text-xs not-italic font-semibold leading-[18px] backdrop-blur-md border border-[#333333] whitespace-nowrap job-card-apply-dark theme-light:job-card-apply-light"
        >
          Apply Now
        </button>

        {/* <Modal
          className="[&>div]:card-one-data-bg [&>div]:border-ctruh-divider-light [&>div]:border-[1px] [&>div]:md:m-4 [&>div]:overflow-hidden [&>div]:rounded-3xl"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <JobModal data={data} onClose={() => setIsModalOpen(false)} />
        </Modal> */}
      </div>
    </div>
  );
};

export default OpeningCard;
