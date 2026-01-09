import { useDeleteAddress } from "../../../api/address/address.service";
import Button from "../../../components/button/Button";
import ConfirmModal from "../../../components/modal/children/ConfirmModal";
import { ADDRESS_TYPES } from "../../../constants";
import useQueryParams from "../../../hooks/useQueryParams";
import { DeleteIcon, EditIcon } from "../../../icons";
import { IAddressCard } from "../../../types";
import AddressInfo from "./AddressInfo";

const AddressCard = ({
  address,
  isBilling,
  isShipping,
  isBoth,
  handleAddressSelect,
  className = "",
}: IAddressCard) => {
  const { setParams, removeParam, queryParams } = useQueryParams();
  const { mutateAsync, isPending } = useDeleteAddress();

  const handleModalClose = () => removeParam("confirm");

  const handleConfirmDelete = () => {
    mutateAsync(address._id).finally(handleModalClose);
  };

  return (
    <>
      <ConfirmModal
        type="error"
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        buttons={{
          left: { content: "No" },
          right: {
            content: isPending ? "Deleting..." : "Yes",
            buttonProps: {
              onClick: handleConfirmDelete,
            },
          },
        }}
        modalProps={{
          isOpen: !!address._id && address._id === queryParams.confirm,
          onClose: handleModalClose,
        }}
      />
      <div
        className={`relative rounded-xl border hover:border-primary p-5 transition duration-300 ${
          isBilling || isShipping || isBoth
            ? "border-blue-crayola-c shadow-primary-btn-hover"
            : "border-primary-50 shadow-light-dark-soft"
        } ${className}`}
      >
        <AddressInfo address={address} />
        {/* Selection buttons */}
        <div className="flex gap-3 mt-4">
          {ADDRESS_TYPES.map((type) => {
            const isActive =
              (type === "billing" && isBilling) ||
              (type === "shipping" && isShipping) ||
              (type === "both" && isBoth);

            return (
              <Button
                key={type}
                content={type}
                pattern="tertiary"
                buttonProps={{
                  onClick: () => handleAddressSelect(type, address._id),
                }}
                className={`px-3! py-1! text-xs! rounded! capitalize text-primary-inverted ${
                  isActive
                    ? "bg-accent-duo text-primary!"
                    : "bg-silver-duo text-primary-inverted!"
                }`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-1 absolute top-1.5 right-1.5">
          <Button
            buttonProps={{ onClick: () => setParams({ edit: address._id }) }}
            pattern="secondary"
            content={
              <EditIcon
                className="w-3 h-3 stroke-primary-inverted group-hover:stroke-blue-crayola-c"
                strokeWidth={2.5}
              />
            }
            className="rounded-full! shadow-neumorphic-layered! w-fit! h-fit! p-1.5!"
          />
          <Button
            pattern="secondary"
            content={
              <DeleteIcon
                className="w-3 h-3 stroke-primary-inverted group-hover:stroke-red-600"
                strokeWidth={2.5}
              />
            }
            className="rounded-full! shadow-neumorphic-layered! w-fit! h-fit! p-1.5!"
            buttonProps={{ onClick: () => setParams({ confirm: address._id }) }}
          />
        </div>
      </div>
    </>
  );
};

export default AddressCard;
