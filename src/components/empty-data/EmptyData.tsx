import { JSX } from "react";
import { ContainerIcon } from "../navbar/components/icons";

interface EmptyDataProps {
  content: string | JSX.Element;
  className?: string;
}
const EmptyData = ({ className = "", content = "" }: EmptyDataProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 p-4 ${className}`}
    >
      <ContainerIcon className="w-12 h-12 stroke-silver-jet" />
      <h3 className="text-center text-lg bg-clip-text text-fill-transparent text-shadow-sm font-medium bg-silver-duo">
        {content}
      </h3>
    </div>
  );
};

export default EmptyData;
