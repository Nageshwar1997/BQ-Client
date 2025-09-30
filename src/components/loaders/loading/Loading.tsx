import "./Loading.css";

const Loading = ({
  className,
  content = "Loading....",
}: {
  className?: string;
  content: string;
}) => {
  return (
    <div className={`container ${className}`}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rings" />
      ))}
      <div className="loading-text">
        {content.split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loading;
