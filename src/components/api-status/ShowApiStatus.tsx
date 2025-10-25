import { JSX } from "react";
import { InfoIcon } from "../../icons";
import { ContainerIcon } from "../navbar/components/icons";
import LoadingPage from "../loaders/LoadingPage";

interface ShowApiStatusProps {
  headingText: string | JSX.Element;
  descriptionText: string | JSX.Element;
  className?: string;
  showHrLine?: boolean;
  type?: "error" | "empty" | "loading";
  loadingText?: string;
}

const ShowApiStatus = ({
  className = "",
  headingText = "",
  descriptionText = "",
  showHrLine = false,
  type = "loading",
  loadingText = "",
}: ShowApiStatusProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 p-4 ${className}`}
    >
      {type === "loading" ? (
        <LoadingPage text={loadingText} className="static min-h-[30dvh]" />
      ) : (
        <>
          {type === "error" ? (
            <InfoIcon className="w-12 h-12 fill-silver-jet" />
          ) : (
            <ContainerIcon className="w-12 h-12 fill-silver-jet" />
          )}

          <h3 className="text-center text-lg bg-clip-text text-fill-transparent text-shadow-sm font-medium bg-silver-duo">
            {headingText}
          </h3>
          <p className="text-silver-jet text-center font-normal text-sm leading-6 font-metropolis">
            {descriptionText}
          </p>
          {showHrLine && (
            <hr className="w-full h-px block border-none bg-gradient-line mt-1" />
          )}
        </>
      )}
    </div>
  );
};

export default ShowApiStatus;
