import { Fragment, useState } from "react";
import { IOpening, TRoleOpening } from "../../../types";
import Button from "../../../components/button/Button";
import OpeningModal from "./OpeningModal";

const OpeningCard = ({
  opening,
  department,
}: {
  opening: TRoleOpening;
  department: IOpening["department"];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex max-w-sm mx-auto w-full rounded-xl border border-primary-30 shadow-light-dark-soft overflow-hidden">
      <div
        style={{
          ["--dept-color-0" as string]: `${department.color}00`,
          ["--dept-color-30" as string]: `${department.color}4d`,
        }}
        className="p-6 flex flex-col items-start gap-4 self-stretch justify-between w-full opening-card"
      >
        <div className="flex justify-between items-start self-stretch">
          {department.icon && (
            <department.icon className="w-12 h-12 mix-blend-difference" />
          )}
          <div className="text-secondary text-[8px]/[9px] tracking-[0.8px] uppercase">
            {opening.location}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2.5 self-stretch">
          <div className="flex flex-col items-start gap-1.5 self-stretch mb-2">
            <div
              className="self-stretch font-metropolis text-[10px] not-italic font-bold leading-3 tracking-[2px] uppercase"
              style={{ color: department.color }}
            >
              {department.title}
            </div>
            <div className="text-primary text-lg/[21.6px] self-stretch">
              {opening.role}
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 self-stretch">
            <div className="text-secondary text-[10px]/[13px]">
              {opening.type}
            </div>
            <div className="flex items-start content-start gap-1.5 self-stretch flex-wrap">
              {opening?.tags?.slice(0, 2).map((tag, index) => (
                <Fragment key={`${tag}-${index}`}>
                  <div className="flex py-0.5 px-1.5 rounded-sm bg-tertiary-inverted text-primary text-[10px]/[14px] font-semibold">
                    {tag}
                  </div>
                </Fragment>
              ))}
              {opening?.tags?.length > 2 && (
                <div className="h-4.5 w-4.5 flex items-center justify-center rounded-full bg-tertiary-inverted text-primary text-[10px]/[14px] font-semibold">
                  {opening?.tags?.length - 2}+
                </div>
              )}
            </div>
          </div>
        </div>
        <Button
          pattern="secondary"
          content="Apply Now"
          className="w-fit! rounded-full! py-1.5! px-5! duration-0! text-xs/[18px]! backdrop-blur-md"
          buttonProps={{ onClick: () => setIsModalOpen(true) }}
        />
        <OpeningModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          opening={opening}
          department={department}
        />
      </div>
    </div>
  );
};

export default OpeningCard;
