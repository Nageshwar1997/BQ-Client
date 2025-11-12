import { ClassName, IOrder } from "../../../../types";
import AddressInfo from "../../../address/children/AddressInfo";

interface Props extends ClassName {
  addresses: IOrder["addresses"];
}

const OrderAddresses = ({ addresses = {}, className = "" }: Props) => {
  if (!Object.keys(addresses).length) return null;
  return (
    <section
      className={`w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90 ${className}`}
    >
      {Object.keys(addresses).map((addressKey, index) => {
        const address = addresses[addressKey as keyof IOrder["addresses"]];
        if (!address) return null;
        return (
          <div key={addressKey} className="">
            <div
              className={`py-2 px-4 ${
                index === 0
                  ? "border-b border-b-primary-30"
                  : "border-y border-y-primary-30"
              }`}
            >
              <h3
                className={`w-fit text-lg font-bold capitalize bg-clip-text text-transparent bg-accent-duo`}
              >
                {addressKey === "both" ? "Shipping & Billing" : addressKey}{" "}
                Address
              </h3>
            </div>
            <AddressInfo
              address={address}
              className="py-2 px-4 [&>h3]:text-base space-y-1"
            />
          </div>
        );
      })}
    </section>
  );
};

export default OrderAddresses;
