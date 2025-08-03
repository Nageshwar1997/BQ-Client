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
  const { description, howToUse, ingredients, additionalDetails } = product;
  const quillData = useMemo(() => {
    return [
      {
        title: "Description",
        content: description,
      },
      {
        title: "How To Use",
        content: howToUse,
      },
      {
        title: "Ingredients",
        content: ingredients,
      },
      {
        title: "Additional Details",
        content: additionalDetails,
      },
    ];
  }, [additionalDetails, description, howToUse, ingredients]);
  return (
    <div className={`relative ${className}`}>
      {quillData.map((content, index) => (
        <Dropdown
          defaultOpen={index === 0}
          key={index}
          title={content.title}
          className={`[&>div>button]:py-5 [&>button]:sticky [&>button]:top-16 ${
            index === 0
              ? "border-y border-y-primary-30"
              : "border-b border-b-primary-30"
          }`}
          children={<QuillContent content={content.content || ""} />}
        />
      ))}
    </div>
  );
};

export default ProductDescriptionAndInfo;
