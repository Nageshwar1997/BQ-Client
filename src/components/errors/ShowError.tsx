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
    <div className={`space-y-1.5 ${className}`}>
      <h1 className="text-center text-base base:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl bg-clip-text text-fill-transparent uppercase text-shadow-sm font-medium bg-silver-duo">
        {headingText}
      </h1>
      <p className="text-silver-jet text-center font-normal text-xs base:text-sm sm:text-base md:text-lg leading-6 font-metropolis">
        {descriptionText}
      </p>
      {showHrLine && <hr className="h-px block border-none bg-gradient-line" />}
    </div>
  );
};

export default ShowError;
