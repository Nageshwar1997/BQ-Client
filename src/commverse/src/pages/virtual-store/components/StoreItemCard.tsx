interface StoreItemCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description?: string;
  price: string;
  mrp?: string;
  discountPercent?: number;
}

const StoreItemCard = ({
  imageSrc,
  imageAlt = 'Product image',
  title,
  description,
  price,
  mrp,
  discountPercent,
}: StoreItemCardProps) => {
  const hasDiscount = !!mrp && !!discountPercent;

  return (
    <div className="inline-flex w-[191px] flex-col items-start justify-start gap-3 overflow-hidden rounded-2xl bg-white p-3">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="h-40 w-full rounded-xl object-cover"
      />
      <div className="flex w-full flex-col items-start justify-start gap-2.5">
        <div className="flex w-full flex-col items-start justify-start gap-1">
          <div className="font-metropolis w-full text-base leading-6 font-semibold text-zinc-900">
            {title}
          </div>
          {description && (
            <div className="font-metropolis h-14 w-40 text-sm leading-4 font-normal text-zinc-500">
              {description}
            </div>
          )}
        </div>
        <div className="inline-flex items-center justify-start gap-3">
          <div className="font-metropolis text-lg leading-7 font-medium text-zinc-900">
            {price}
          </div>
          {hasDiscount && (
            <>
              <div className="font-metropolis text-sm leading-4 font-normal text-zinc-500 line-through">
                {mrp}
              </div>
              <div className="flex items-center justify-center gap-2.5 rounded-3xl bg-zinc-500 px-1.5 py-1">
                <div className="font-metropolis text-center text-xs leading-4 font-semibold text-white">
                  {discountPercent}%
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreItemCard;
