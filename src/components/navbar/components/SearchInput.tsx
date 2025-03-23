import { IconProps, SearchIcon } from "../../../icons";

const SearchInput = ({ className }: IconProps) => {
  return (
    <div
      className={`max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] w-full flex-grow h-9 hidden rounded-md overflow-hidden bg-secondary-inverted xl:flex items-center border border-transparent focus-within:shadow-lg focus-within:shadow-primary-10 focus-within:border-primary-50 ${className}`}
    >
      <input
        type="text"
        placeholder="Search Beautinique"
        className="w-full h-full pl-4 pr-1 py-1 text-sm focus:outline-none focus:border-none bg-transparent placeholder:text-primary-50"
      />
      <SearchIcon className="w-5 h-5 [&>path]:stroke-primary-50 mr-3" />
    </div>
  );
};

export default SearchInput;
