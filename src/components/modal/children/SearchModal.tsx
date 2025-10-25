import { useEffect, useMemo, useState } from "react";
import { CloseIcon, SearchIcon } from "../../../icons";
import Input from "../../input/Input";
import { useGetAllProducts } from "../../../api/product/product.service";
import SearchModalSkeleton from "../../skeletons/children/SearchModalSkeleton";
import EmptyData from "../../empty-data/EmptyData";
import { FetchedProductType } from "../../../types";
import { TUseGetAllProducts } from "../../../api/types";
import { debounce } from "../../../utils";
import usePathParams from "../../../hooks/usePathParams";
import ShowApiStatus from "../../api-status/ShowApiStatus";

const SearchModal = ({ onClose }: { onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { navigate } = usePathParams();

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedQuery(value.trim());
      }, 600),
    []
  );

  useEffect(() => {
    debouncedSetQuery(searchQuery);
  }, [searchQuery, debouncedSetQuery]);

  const queryParams: TUseGetAllProducts = useMemo(
    () => ({
      data: {
        requiredFields: ["title", "brand", "commonImages"],
        populateFields: { category: ["name"] },
      },
      pageParams: { page: 1, limit: 5 },
      queryParams: { search: debouncedQuery },
      enabled: !!debouncedQuery,
    }),
    [debouncedQuery]
  );

  const handleSubmit = (id?: string) => {
    if (id) {
      navigate(`/product/${id}`);
    } else {
      navigate(`/search?search=${searchQuery.trim()}`);
    }
    onClose();
  };

  const productsQuery = useGetAllProducts(queryParams);
  const products = productsQuery.data?.products ?? [];

  return (
    <div className="w-full h-full flex flex-col gap-2 pt-2">
      {/* Search Input */}
      <Input
        needRef
        icons={{
          left: {
            icon: (
              <SearchIcon className="stroke-tertiary w-4 h-4 md:w-5 md:h-5" />
            ),
          },
        }}
        inputProps={{
          placeholder: "Search products here...",
          value: searchQuery,
          type: "text",
          name: "searchQuery",
          onChange: (e) => setSearchQuery(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              handleSubmit();
            }
          },
        }}
        className="w-full"
      />
      {/* Query Info */}
      <div
        className={`flex items-center justify-between px-3 py-2 text-tertiary bg-smoke-eerie rounded shadow-sm mb-1 ${
          searchQuery.trim() ? "opacity-100" : "opacity-50 pointer-events-none"
        }`}
      >
        <div
          className="flex items-center gap-2 text-xs cursor-pointer"
          onClick={() => handleSubmit()}
        >
          <span className="line-clamp-1">
            Results for: <strong>{searchQuery.trim()}</strong>
          </span>
        </div>
        <CloseIcon
          className="stroke-tertiary w-4 h-4 cursor-pointer hover:stroke-primary transition"
          onClick={() => setSearchQuery("")}
        />
      </div>
      {/* Result Container */}
      <div className="flex flex-col flex-1 min-h-[235px] max-h-[350px] w-full overflow-y-auto rounded-lg bg-smoke-eerie shadow-inner">
        {productsQuery.isPending && debouncedQuery ? (
          <SearchModalSkeleton count={5} />
        ) : productsQuery.isError ? (
          <ShowApiStatus
            type="error"
            headingText="Something went wrong"
            descriptionText="Please try again later."
            className="gap-1 [&_svg]:w-8 [&_svg]:h-8 [&_h3]:text-lg [&_p]:text-sm"
          />
        ) : products.length ? (
          <ul className="flex flex-col gap-1 p-1">
            {products.map((p: FetchedProductType) => (
              <li
                key={p._id}
                className="border border-primary-30 flex items-center gap-2 p-1 rounded hover:bg-primary-inverted-30 cursor-pointer transition"
                onClick={() => handleSubmit(p._id)}
              >
                <img
                  src={p.commonImages[0]}
                  alt={p.brand}
                  className="w-8 h-8 object-cover rounded aspect-square"
                />
                <div className="flex flex-col">
                  <h3 className="text-xs font-medium text-secondary line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-[10px] text-tertiary line-clamp-1">
                    {p.brand} - {p.category.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : debouncedQuery ? (
          <EmptyData
            content={
              <>
                No results found for <strong>{debouncedQuery}</strong>
              </>
            }
          />
        ) : (
          <div className="w-full flex-1 flex items-center justify-center text-center text-sm md:text-base">
            Search for products to view them here
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
