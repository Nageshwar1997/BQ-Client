export type TAvailability = 'in-stock' | 'low-stock' | 'out-of-stock';

export const AVAILABILITY_LABELS: Record<TAvailability, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Only a few left',
  'out-of-stock': 'Out of stock',
};

/**
 * What the stock of a product, or of one of its variants, says to a customer. The storefront is not told how many
 * there are - only whether there are some, and whether it is only a few.
 */
export const getAvailability = ({
  inStock,
  lowStock,
}: {
  inStock: boolean;
  lowStock: boolean;
}): TAvailability => {
  if (!inStock) return 'out-of-stock';

  return lowStock ? 'low-stock' : 'in-stock';
};
