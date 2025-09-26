import { useEffect, useMemo, useState } from "react";
import { IAddress, IUserAddresses } from "../../types";
import { useGetUserAddresses } from "../../api/address/address.service";
import { ADDRESS_TYPES } from "../../constants";
import Button from "../../components/button/Button";
import { UploadCloudIcon } from "../../icons";
import AddressCard from "./children/AddressCard";
import { formatPhoneNumber } from "../../utils";

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

  const finalAddresses = useMemo(() => {
    const returnAddresses: { address: IAddress; type: string }[] = [];

    const addIfNotExists = (id: string | null, type: string) => {
      if (!id) return;
      const addr = addresses.find((a) => a._id === id);
      if (addr && !returnAddresses.some((a) => a.address._id === addr._id)) {
        returnAddresses.push({ address: addr, type });
      }
    };

    ADDRESS_TYPES.map((type) => addIfNotExists(selectedAddress[type], type));

    return returnAddresses || [];
  }, [addresses, selectedAddress]);

  useEffect(() => {
    console.log("finalAddresses", finalAddresses);
  }, [finalAddresses]);

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
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        <div className="border border-primary-50 rounded-full" />
        <div className="lg:max-w-xs w-full h-fit border border-primary-50 shadow-light-dark-soft rounded-lg p-5 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {finalAddresses?.map(({ address, type }) => (
            <div key={address._id}>
              <hr className="h-px mb-2 border-none block bg-silver-jet-2" />
              <h3 className="text-lg text-center font-bold capitalize bg-clip-text text-transparent bg-accent-duo">
                {type === "both" ? "Shipping & Billing" : type} Address
              </h3>
              <hr className="h-px my-2 border-none block bg-silver-jet-2" />
              <div>
                <h3 className="text-lg font-semibold text-secondary">
                  {address.firstName} {address.lastName}
                </h3>
                <p className="text-tertiary text-sm">
                  {formatPhoneNumber(address.phoneNumber)}
                  {address.altPhoneNumber &&
                    `, ${formatPhoneNumber(address.altPhoneNumber)}`}
                </p>
                {address.email && (
                  <p className="text-tertiary text-sm">{address.email}</p>
                )}
                <p className="text-silver-jet-2 mt-1 text-sm">
                  {address.address}
                  {address.landmark ? `, ${address.landmark}` : ""},{" "}
                  {address.city}, {address.state} - {address.pinCode},{" "}
                  {address.country}
                </p>
                {address.gst && (
                  <p className="text-silver-jet text-sm mt-1">
                    GST: {address.gst}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Address;
