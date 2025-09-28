import { useDeleteAddress } from "../../../api/address/address.service";
import Button from "../../../components/button/Button";
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
  const { setParams } = useQueryParams();
  const { mutateAsync } = useDeleteAddress();

  return (
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
              onClick={() => handleAddressSelect(type, address._id)}
              className={`!px-3 !py-1 !text-xs !rounded capitalize text-primary-inverted ${
                isActive
                  ? "bg-accent-duo !text-primary"
                  : "bg-silver-duo !text-primary-inverted"
              }`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-1 absolute top-1.5 right-1.5">
        <Button
          onClick={() => setParams({ edit: address._id })}
          pattern="secondary"
          content={
            <EditIcon
              className="w-3 h-3 stroke-primary-inverted group-hover:stroke-blue-crayola-c"
              strokeWidth={2.5}
            />
          }
          className="!rounded-full !shadow-neumorphic-layered !w-fit !h-fit !p-1.5"
        />
        <Button
          pattern="secondary"
          content={
            <DeleteIcon
              className="w-3 h-3 stroke-primary-inverted group-hover:stroke-red-600"
              strokeWidth={2.5}
            />
          }
          className="!rounded-full !shadow-neumorphic-layered !w-fit !h-fit !p-1.5"
          onClick={() => mutateAsync(address._id)}
        />
      </div>
    </div>
  );
};

export default AddressCard;
