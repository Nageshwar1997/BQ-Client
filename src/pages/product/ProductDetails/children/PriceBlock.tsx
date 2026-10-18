import { formatINRCurrency } from '@/utils/common.util';

interface IPriceBlock {
  sellingPrice: number;
  originalPrice: number;
  /** Percent off, 0 when it is not on sale. */
  discount: number;
}

/** The price to pay, what it was and what is saved - the last two only when the product is on sale. */
const PriceBlock = ({ sellingPrice, originalPrice, discount }: IPriceBlock) => {
  const isOnSale = discount > 0;

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-bold tracking-tight">
          <span className="sr-only">Price </span>
          {formatINRCurrency(sellingPrice)}
        </span>

        {isOnSale && (
          <>
            <span className="text-silver-jet text-lg line-through">
              <span className="sr-only">Was </span>
              {formatINRCurrency(originalPrice)}
            </span>
            <span className="bg-primary-green/15 text-primary-green rounded-full px-2.5 py-0.5 text-sm font-semibold">
              {discount}% off
            </span>
          </>
        )}
      </p>

      {isOnSale && (
        <p className="text-primary-green mt-1 text-sm font-medium">
          You save {formatINRCurrency(originalPrice - sellingPrice)}
        </p>
      )}
    </div>
  );
};

export default PriceBlock;
