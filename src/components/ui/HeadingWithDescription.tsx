const HeadingWithDescription = ({
  horizontalLine,
  titleTexts,
  descriptionText,
  wrapperClassName,
  className,
  id,
}: {
  horizontalLine?: "top" | "bottom";
  titleTexts: string[];
  descriptionText?: string[] | string;
  wrapperClassName?: string;
  className?: string;
  id?: string;
}) => {
  return (
    <div className={`w-full flex flex-col items-center ${wrapperClassName}`}>
      {horizontalLine === "top" && (
        <hr className="w-full h-px block border-none bg-gradient-line" />
      )}
      <div className={`text-center mx-auto ${className}`} id={id}>
        {titleTexts?.map((title, index) => {
          const words = title.split(" ");
          return (
            <h1
              key={index}
              className="text-center text-4xl lg:text-5xl font-medium leading-[43px] lg:leading-[57px]"
            >
              {words?.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="inline-block bg-clip-text text-transparent bg-silver-duo"
                >
                  {word}
                  {/* Add a non-breaking space (&nbsp;) between words to prevent breaking */}
                  {wordIndex < words?.length - 1 && "\u00A0"}{" "}
                </span>
              ))}
            </h1>
          );
        })}
        {descriptionText && (
          <p className="text-tertiary opacity-75 text-center font-metropolis font-normal mt-4 lg:mt-0 leading-6 text-base">
            {Array.isArray(descriptionText)
              ? descriptionText?.map((desc, i) => (
                  <span key={i}>
                    {desc} <br />
                    {i < descriptionText?.length - 1 && " "}
                  </span>
                ))
              : descriptionText}
          </p>
        )}
      </div>
      {horizontalLine === "bottom" && (
        <hr className="w-full h-px block border-none bg-gradient-line" />
      )}
    </div>
  );
};

export default HeadingWithDescription;
