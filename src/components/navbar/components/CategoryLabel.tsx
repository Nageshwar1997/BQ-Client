import { Link } from "react-router-dom";

const CategoryLabel = ({
  text,
  path = "",
  className = "",
}: {
  text: string;
  path?: string;
  className?: string;
}) => (
  <p
    className={`uppercase mt-3 md:mt-0 text-primary-battleship-davys-gray-inverted text-left text-sm font-semibold tracking-wide leading-5 px-3 cursor-pointer line-clamp-1 ${className}`}
  >
    {path ? <Link to={path}>{text}</Link> : text}
  </p>
);

export default CategoryLabel;
