import { useMemo } from "react";
import { UpiIcon } from "../../../../icons";
import { getCurrentViewers, toINRCurrency } from "../../../../utils";

const BuyOnEMIAndCurrentViewers = ({ price }: { price: number }) => {
  const currentViewers = useMemo(() => getCurrentViewers(), []);
  return (
    <div className="flex flex-col gap-4">
      <p>Tax included</p>
      <div className="relative border border-primary-50 rounded">
        <div className="absolute -top-2.5 left-3 bg-primary text-primary-inverted px-2 py-px text-[10px] rounded">
          Flat ₹100 cashback
        </div>
        <div className="flex justify-between items-center relative text-[10px] sm:text-sm">
          <div className="flex flex-col base:flex-row items-center gap-2 font-medium leading-none mt-px -mb-1 px-2 sm:px-4 py-2">
            <p>
              Pay{" "}
              <span className="text-green-600 font-semibold">
                {toINRCurrency(price * 0.1).split(".")[0]} now,
              </span>{" "}
              rest via BQ pay later
            </p>
            <div className="bg-primary-50 w-px h-3 hidden base:block" />
            <div className="flex items-center gap-2">
              <p className="">0% EMI on</p>
              <UpiIcon className="h-4 w-6 base:w-8 md:w-10 lg:w-12" />
            </div>
          </div>
          <p className="h-full absolute right-0 top-0 bg-red-600 rounded-r-[3px] text-[10px] sm:text-sm flex items-center px-3 font-medium text-white">
            {/* Buy on EMI */}
            Coming Soon
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 border border-primary-50 p-2 rounded">
        <div className="w-3 h-3 rounded-full bg-gradient-to-t from-green-500/50 to-green-500/50 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full animate-blink bg-green-600" />
        </div>
        <div className="text-sm/4 md:text-base/4">
          {currentViewers} People are viewing this product right now.
        </div>
      </div>
    </div>
  );
};

export default BuyOnEMIAndCurrentViewers;
