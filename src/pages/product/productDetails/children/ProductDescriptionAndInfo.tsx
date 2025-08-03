import { useMemo } from "react";
import { ProductType } from "../../../../types";
import Dropdown from "../../../../components/dropdown/Dropdown";
import QuillContent from "../../../../components/QuillContent";

const ProductDescriptionAndInfo = ({
  product,
  className = "",
}: {
  product: ProductType;
  className?: string;
}) => {
  const quillData = useMemo(() => {
    return [
      {
        title: "Description",
        content: product.description,
      },
      {
        title: "How To Use",
        content: product.howToUse,
      },
      {
        title: "Ingredients",
        content: product.ingredients,
      },
      {
        title: "Additional Details",
        content: product.additionalDetails,
      },
    ];
  }, [product]);
  return (
    <div className={`relative ${className}`}>
      {quillData
        .filter(({ content }) => content && content.length > 0)
        .map(({ content, title }, index) => (
          <Dropdown
            defaultOpen={index === 0}
            key={index}
            title={title}
            className={`[&>div>button]:py-5 [&>button]:sticky [&>button]:top-16 ${
              index === 0
                ? "border-y border-y-primary-30"
                : "border-b border-b-primary-30"
            }`}
            children={<QuillContent content={content || ""} />}
          />
        ))}
    </div>
  );
};

export default ProductDescriptionAndInfo;
