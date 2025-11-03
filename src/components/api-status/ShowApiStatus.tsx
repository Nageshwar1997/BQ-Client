import { JSX } from "react";
import { InfoIcon } from "../../icons";
import { ContainerIcon } from "../navbar/components/icons";
import LoadingPage from "../loaders/LoadingPage";

interface ShowApiStatusProps {
  headingText: string | JSX.Element;
  descriptionText?: string | JSX.Element;
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
      className={`w-full h-full flex m-auto flex-col items-center justify-center gap-2 p-4 ${className}`}
    >
      {type === "loading" ? (
        <LoadingPage text={loadingText} className="static min-h-[30dvh]" />
      ) : (
        <>
          {type === "error" ? (
            <InfoIcon className="w-12 h-12 md:w-16 md:h-16 fill-silver-jet" />
          ) : (
            <ContainerIcon className="w-12 h-12 fill-silver-jet" />
          )}

          <h3 className="text-center bg-clip-text text-fill-transparent text-shadow-sm font-medium bg-silver-duo text-base base:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            {headingText}
          </h3>
          {descriptionText && (
            <p className="text-silver-jet text-center font-normal text-sm sm:text-base md:text-lg leading-6 font-metropolis">
              {descriptionText}
            </p>
          )}
          {showHrLine && (
            <hr className="w-full h-px block border-none bg-gradient-line mt-1" />
          )}
        </>
      )}
    </div>
  );
};

export default ShowApiStatus;
