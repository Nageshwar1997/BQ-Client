import { useState } from "react";
import { CloseIcon, SearchIcon } from "../../../icons";
import Input from "../../input/Input";

const dummyProducts = [
  {
    _id: "1",
    title: "GlowCare Face Moisturizer",
    commonImages: [
      "https://dummyimage.com/600x400/000/fff&text=Image+1a",
      "https://dummyimage.com/600x400/000/fff&text=Image+1b",
    ],
    category: "Skincare",
    brand: "GlowCare",
  },
  {
    _id: "2",
    title: "BeautiPro Foundation",
    commonImages: [
      "https://dummyimage.com/600x400/111/fff&text=Image+2a",
      "https://dummyimage.com/600x400/111/fff&text=Image+2b",
    ],
    category: "Makeup",
    brand: "BeautiPro",
  },
  {
    _id: "3",
    title: "HairEssence Shampoo",
    commonImages: [
      "https://dummyimage.com/600x400/222/fff&text=Image+3a",
      "https://dummyimage.com/600x400/222/fff&text=Image+3b",
    ],
    category: "Haircare",
    brand: "HairEssence",
  },
  {
    _id: "4",
    title: "Scentura Eau de Parfum",
    commonImages: [
      "https://dummyimage.com/600x400/333/fff&text=Image+4a",
      "https://dummyimage.com/600x400/333/fff&text=Image+4b",
    ],
    category: "Fragrance",
    brand: "Scentura",
  },
  //   {
  //     _id: "5",
  //     title: "ProGlam Eyeshadow Palette",
  //     commonImages: [
  //       "https://dummyimage.com/600x400/444/fff&text=Image+5a",
  //       "https://dummyimage.com/600x400/444/fff&text=Image+5b",
  //     ],
  //     category: "Tools",
  //     brand: "ProGlam",
  //   },
  //   {
  //     _id: "6",
  //     title: "Naturique Face Serum",
  //     commonImages: [
  //       "https://dummyimage.com/600x400/555/fff&text=Image+6a",
  //       "https://dummyimage.com/600x400/555/fff&text=Image+6b",
  //     ],
  //     category: "Skincare",
  //     brand: "Naturique",
  //   },
  //   {
  //     _id: "7",
  //     title: "ColorRush Lipstick",
  //     commonImages: [
  //       "https://dummyimage.com/600x400/666/fff&text=Image+7a",
  //       "https://dummyimage.com/600x400/666/fff&text=Image+7b",
  //     ],
  //     category: "Makeup",
  //     brand: "ColorRush",
  //   },
  //   {
  //     _id: "8",
  //     title: "LushLocks Shampoo",
  //     commonImages: [
  //       "https://dummyimage.com/600x400/777/fff&text=Image+8a",
  //       "https://dummyimage.com/600x400/777/fff&text=Image+8b",
  //     ],
  //     category: "Haircare",
  //     brand: "LushLocks",
  //   },
  //   {
  //     _id: "9",
  //     title: "AromaLux Perfume",
  //     commonImages: [
  //       "https://dummyimage.com/600x400/888/fff&text=Image+9a",
  //       "https://dummyimage.com/600x400/888/fff&text=Image+9b",
  //     ],
  //     category: "Fragrance",
  //     brand: "AromaLux",
  //   },
  //   {
  //     _id: "10",
  //     title: "GlowGear Face Brush",
  //     commonImages: [
  //       "https://dummyimage.com/600x400/999/fff&text=Image+10a",
  //       "https://dummyimage.com/600x400/999/fff&text=Image+10b",
  //     ],
  //     category: "Tools",
  //     brand: "GlowGear",
  //   },
];

const SearchModal = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = dummyProducts.filter(
    (product) =>
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col gap-2 py-2">
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
      <div className="flex-1 overflow-y-auto rounded-lg bg-smoke-eerie shadow-inner">
        {filteredProducts.length > 0 ? (
          <ul className="flex flex-col gap-1 p-1">
            {filteredProducts.map((product) => (
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
                    {product.brand} - {product.category}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center text-sm text-muted">
            No results found for <strong>{searchQuery}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
