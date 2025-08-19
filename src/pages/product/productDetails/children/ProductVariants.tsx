import { FetchedShadeType } from "../../../../types";

const ProductVariants = ({
  currentShade,
  shades,
  onChange,
}: {
  currentShade: FetchedShadeType;
  shades: FetchedShadeType[];
  onChange: (index: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-secondary">
        {currentShade.colorCode ? "Color: " : "Variant: "}
        {currentShade.shadeName}
      </div>
      <div className="flex flex-wrap gap-2 md:gap-2.5">
        {shades.map((shade, index) => (
          <div
            key={shade._id}
            className="cursor-pointer relative"
            onClick={() => onChange(index)}
          >
            <div
              className={`w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border p-px md:p-0.5 ${
                currentShade._id === shade._id
                  ? "border-tertiary"
                  : "border-primary-30"
              }`}
            >
              {shade.colorCode ? (
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: shade.colorCode }}
                />
              ) : (
                <img
                  src={shade.images[0] as string}
                  alt={shade.shadeName}
                  className="w-full h-full aspect-square object-cover object-center rounded-full"
                />
              )}
              {shade.stock === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-tertiary -rotate-45" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductVariants;
