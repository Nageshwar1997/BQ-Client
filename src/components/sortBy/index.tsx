import useQueryParams from "../../hooks/useQueryParams";
import { SORT_BY_OPTIONS } from "../../constants";

interface SortByProps {
  className?: string;
}

function SortBy({ className = "" }: SortByProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const current = queryParams.sortBy;
  return (
    <section
      className={`h-full flex gap-6 bg-primary-inverted select-none ${className}`}
    >
      <ul className={`w-full flex flex-col gap-0.5 py-2 px-7`}>
        {SORT_BY_OPTIONS.map((opt) => {
          const disabled = opt.disabled;
          const selected = current === opt.value;
          return (
            <li
              key={opt.value}
              onClick={() =>
                !disabled &&
                (selected
                  ? removeParam("sortBy")
                  : setParams({ sortBy: opt.value }))
              }
              className={`w-fit text-sm sm:text-base text-primary font-medium py-2 transform transition-all hover:duration-300 whitespace-nowrap ${
                disabled
                  ? "cursor-not-allowed text-primary-30"
                  : "cursor-pointer hover:-translate-x-2"
              } ${
                selected ? "-translate-x-2 text-primary" : "text-primary-50"
              }`}
            >
              {opt.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default SortBy;
