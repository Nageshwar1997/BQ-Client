import { Link } from "react-router-dom";
import { IFooterOptionList } from "../../types";

const FooterOptionList = ({
  isFirst = false,
  title,
  options,
}: IFooterOptionList) => {
  return (
    <div
      className={`space-y-2 text-sm lg:text-base ${
        isFirst ? "col-span-3 sm:col-span-1" : ""
      }`}
    >
      <p
        className={`text-platinum-black-inverted font-medium uppercase ${
          isFirst ? "hidden sm:block" : ""
        }`}
      >
        {title}
      </p>
      <div
        className={`grid grid-cols-1 ${
          isFirst ? "grid-cols-2 sm:grid-cols-1" : ""
        } gap-2`}
      >
        {options.map((link, i) => (
          <Link key={i} to={link.path} className="text-nowrap cursor-pointer">
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterOptionList;
