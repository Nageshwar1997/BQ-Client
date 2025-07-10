import { InfoIcon } from "../../icons";

interface ShowErrorProps {
  headingText: string;
  descriptionText: string;
  className?: string;
  showHrLine?: boolean;
}

const ShowError = ({
  className = "",
  headingText = "",
  descriptionText = "",
  showHrLine = false,
}: ShowErrorProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 p-4 ${className}`}
    >
      <InfoIcon className="w-12 h-12 fill-silver-jet" />
      <h3 className="text-center text-lg bg-clip-text text-fill-transparent text-shadow-sm font-medium bg-silver-duo">
        {headingText}
      </h3>
      <p className="text-silver-jet text-center font-normal text-sm leading-6 font-metropolis">
        {descriptionText}
      </p>
      {showHrLine && <hr className="h-px block border-none bg-gradient-line" />}
    </div>
  );
};

export default ShowError;
