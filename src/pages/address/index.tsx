import { useEffect, useMemo, useState } from "react";
import { IAddress, IUserAddresses } from "../../types";
import { useGetUserAddresses } from "../../api/address/address.service";
import { ADDRESS_TYPES } from "../../constants";
import Button from "../../components/button/Button";
import { InfoIcon, RightArrowIcon, UploadCloudIcon } from "../../icons";
import AddressCard from "./children/AddressCard";
import AddressInfo from "./children/AddressInfo";
import AddressFormModal from "../../components/modal/children/AddressFormModal";
import useQueryParams from "../../hooks/useQueryParams";
import { toastErrorMessage } from "../../utils/toasts";
import AddressForm from "./children/AddressForm";
import ShowError from "../../components/errors/ShowError";
import LoadingPage from "../../components/loaders/LoadingPage";
import ConfirmModal from "../../components/modal/children/ConfirmModal";

const Address = () => {
  const { removeParam, setParams, queryParams } = useQueryParams();
  const [selectedAddress, setSelectedAddress] = useState<
    Record<(typeof ADDRESS_TYPES)[number], string | null>
  >({
    shipping: null,
    billing: null,
    both: null,
  });

  const { data, isError, isLoading } = useGetUserAddresses();
  const userAddresses: IUserAddresses = data?.userAddresses || {};
  const addresses: IAddress[] = useMemo(
    () => userAddresses?.addresses || [],
    [userAddresses?.addresses]
  );

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

  if (isError) return <div>Error loading addresses</div>;

  return (
    <div className="p-6 mx-auto">
      <AddressFormModal
        onClose={() => (removeParam("add"), removeParam("edit"))}
        addresses={queryParams.edit ? addresses : undefined}
      />
      <div className="pb-2 flex items-center justify-between gap-4 mb-6">
        <h2 className="text-lg base:text-xl md:text-2xl leading-5 font-semibold">
          {isLoading
            ? "Please wait..."
            : isError
            ? ""
            : addresses.length > 0
            ? "Your Addresses"
            : "Add Address to get started"}
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
          buttonProps={{
            onClick: () => {
              if (addresses.length >= 5) {
                return toastErrorMessage(
                  "You can not add more than 5 addresses, remove any one of existing addresses to add new address"
                );
              }
              setParams({ add: "true" });
            },
          }}
        />
      </div>
      {isLoading ? (
        <LoadingPage
          text="Loading addresses"
          className="!static min-h-[300px]"
        />
      ) : isError ? (
        <ShowError
          headingText="Error loading addresses"
          descriptionText="Please try again"
        />
      ) : addresses?.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
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
                  className="mb-4 break-inside-avoid"
                />
              );
            })}
          </div>
          <div className="border border-primary-50 rounded-full" />
          <div className="lg:max-w-xs w-full h-fit border border-primary-50 shadow-light-dark-soft rounded-lg p-5">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
              {finalAddresses?.map(({ address, type }) => (
                <div key={address._id}>
                  <hr className="h-px mb-2 border-none block bg-silver-jet-2" />
                  <h3 className="text-lg text-center font-bold capitalize bg-clip-text text-transparent bg-accent-duo">
                    {type === "both" ? "Shipping & Billing" : type} Address
                  </h3>
                  <hr className="h-px my-2 border-none block bg-silver-jet-2" />
                  <AddressInfo address={address} />
                </div>
              ))}
            </div>
            <hr className="h-px my-3 border-none block bg-silver-jet-2" />
            <div className="space-y-2 mt-4">
              {(!selectedAddress.billing || !selectedAddress.shipping) &&
                !selectedAddress.both && (
                  <div className="text-xs/4 text-red-600 flex items-center gap-1">
                    <InfoIcon className="w-5 h-5 fill-red-600" />
                    <span>
                      {selectedAddress.billing && !selectedAddress.shipping
                        ? "If you select a billing address, you must select a shipping address"
                        : !selectedAddress.billing && selectedAddress.shipping
                        ? "If you select a shipping address, you must select a billing address"
                        : ""}
                    </span>
                  </div>
                )}
              <Button
                pattern="primary"
                content="Proceed to Payment"
                className="!rounded-lg!p-3 gap-2 max-w-xs mx-auto"
                rightIcon={<RightArrowIcon className="stroke-white" />}
                buttonProps={{
                  disabled:
                    (!selectedAddress.billing || !selectedAddress.shipping) &&
                    !selectedAddress.both,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <AddressForm />
      )}
      <ConfirmModal
        type="error"
        title="Are you sure you want to delete?"
        description="Are you sure you want to delete this address"
      />
    </div>
  );
};

export default Address;
