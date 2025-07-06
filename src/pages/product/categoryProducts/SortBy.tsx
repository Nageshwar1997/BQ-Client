import useQueryParams from "../../../hooks/useQueryParams";
import { SORT_BY_OPTIONS } from "./data";

interface SortByProps {
  className?: string;
}

function Filters({ className = "" }: SortByProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const current = queryParams.sortBy;
  return (
    <section
      className={`h-full flex gap-6 bg-primary-inverted select-none ${className}`}
    >
      <ul className={`w-full flex flex-col gap-1 p-4`}>
        {SORT_BY_OPTIONS.map((opt) => (
          <li
            key={opt.value}
            onClick={() =>
              current === opt.value
                ? removeParam("sortBy")
                : setParams({ sortBy: opt.value })
            }
            className={`text-sm sm:text-base text-primary font-medium cursor-pointer px-3 py-2 transform hover:-translate-x-2 transition-all hover:duration-300 whitespace-nowrap ${
              current === opt.value
                ? "-translate-x-2 text-primary"
                : "text-tertiary"
            }`}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Filters;
