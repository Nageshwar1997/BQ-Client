import { useEffect, useState } from "react";
import { IAddress, IUserAddresses } from "../../types";
import { useGetUserAddresses } from "../../api/address/address.service";
import { ADDRESS_TYPES } from "../../constants";
import Button from "../../components/button/Button";
import { UploadCloudIcon } from "../../icons";
import AddressCard from "./children/AddressCard";

const Address = () => {
  const [selectedAddress, setSelectedAddress] = useState<
    Record<(typeof ADDRESS_TYPES)[number], string | null>
  >({
    shipping: null,
    billing: null,
    both: null,
  });

  const { data, isError, isPending } = useGetUserAddresses();
  const userAddresses: IUserAddresses = data?.userAddresses || {};
  const addresses: IAddress[] = userAddresses.addresses;

  useEffect(() => {
    if (!userAddresses?.defaultAddress) return;
    const defaultAddress =
      addresses.find(
        (address) => address._id === userAddresses?.defaultAddress
      ) || null;

    if (!defaultAddress) return;
    setSelectedAddress((prev) => ({
      ...prev,
      [defaultAddress.type]: defaultAddress._id,
    }));
  }, [addresses, userAddresses?.defaultAddress]);

  const handleSelect = (type: (typeof ADDRESS_TYPES)[number], id: string) => {
    setSelectedAddress((prev) => {
      if (type === "both") {
        return { billing: null, shipping: null, both: id };
      }

      if (type === "billing") {
        if (prev.shipping === id) {
          return { ...prev, shipping: null, billing: id, both: null };
        }
        return { ...prev, billing: id, both: null };
      }

      if (type === "shipping") {
        if (prev.billing === id) {
          return { ...prev, billing: null, shipping: id, both: null };
        }
        return { ...prev, shipping: id, both: null };
      }

      return prev;
    });
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading addresses</div>;

  return (
    <div className="p-6 mx-auto">
      <div className="pb-2 flex items-center justify-between gap-4 mb-6">
        <h2 className="text-lg base:text-xl md:text-2xl leading-5 font-semibold">
          Select Addresses
        </h2>
        <Button
          pattern="secondary"
          content="Add Address"
          className="!rounded-md !w-fit text-nowrap gap-1.5 !py-2.5"
          rightIcon={
            <UploadCloudIcon
              className="stroke-secondary-inverted w-5 h-5"
              strokeWidth={2.5}
            />
          }
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {addresses.map((address) => {
          const isBilling = selectedAddress.billing === address._id;
          const isShipping = selectedAddress.shipping === address._id;
          const isBoth = selectedAddress.both === address._id;

          return (
            <AddressCard
              key={address._id}
              address={address}
              isBilling={isBilling}
              isShipping={isShipping}
              isBoth={isBoth}
              handleAddressSelect={handleSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Address;
