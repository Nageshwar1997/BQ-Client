import { useState } from "react";
import { CloseIcon, SearchIcon } from "../../../icons";
import Input from "../../input/Input";
import { useGetAllProductsInfinite } from "../../../api/product/product.service";
import SearchModalSkeleton from "../../skeletons/children/SearchModalSkeleton";
import ShowError from "../../errors/ShowError";
import EmptyData from "../../empty-data/EmptyData";
import { FetchedProductType } from "../../../types";

const SearchModal = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const productsQuery = useGetAllProductsInfinite({
    data: {
      requiredFields: ["title", "brand", "commonImages"],
      populateFields: { category: ["name"] },
    },
    pageParams: { limit: 10 },
  });

  const productsData =
    productsQuery.data?.pages?.flatMap((page) => page.products) || [];

  return (
    <div className="w-full h-full flex flex-col gap-2 pt-2">
      {/* Search Input */}
      <Input
        placeholder="Search products here..."
        icon={<SearchIcon className="stroke-tertiary w-4 h-4 md:w-5 md:h-5" />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        name="searchQuery"
        className="w-full"
      />

      {/* Query Info */}
      {searchQuery && (
        <div className="flex items-center justify-between px-3 py-2 text-tertiary bg-smoke-eerie rounded shadow-sm mb-1">
          <div className="flex items-center gap-2 text-xs">
            <SearchIcon className="stroke-tertiary w-4 h-4" />
            <span className="line-clamp-1">
              Showing results for: <strong>{searchQuery}</strong>
            </span>
          </div>
          <CloseIcon
            className="stroke-tertiary w-4 h-4 cursor-pointer hover:stroke-primary transition"
            onClick={() => setSearchQuery("")}
          />
        </div>
      )}

      {/* Result Container */}
      <div className="flex-1 max-h-[350px] w-full h-full overflow-y-auto rounded-lg bg-smoke-eerie shadow-inner">
        {productsQuery.isPending ? (
          <SearchModalSkeleton />
        ) : productsQuery.isError ? (
          <ShowError
            headingText="Something went wrong"
            descriptionText="Please try again later."
            className="gap-1"
          />
        ) : productsData?.length ? (
          <ul className="flex flex-col gap-1 p-1">
            {productsData?.map((product: FetchedProductType) => (
              <li
                key={product._id}
                className="border border-primary-30 flex items-center gap-2 transition cursor-pointer p-1 rounded hover:bg-primary-inverted-30"
              >
                <img
                  src={product.commonImages[0]}
                  alt={product.brand}
                  className="w-8 h-8 object-cover rounded aspect-square"
                />
                <div className="flex flex-col">
                  <h3 className="text-xs font-medium text-secondary line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-[10px] text-tertiary line-clamp-1">
                    {product.brand} - {product.category.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          searchQuery && (
            <EmptyData
              content={
                <>
                  No results found for <strong>{searchQuery}</strong>
                </>
              }
            />
          )
        )}
      </div>
    </div>
  );
};

export default SearchModal;
