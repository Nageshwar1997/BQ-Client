import { ClassName, IAddress } from "../../../types";
import { formatPhoneNumber } from "../../../utils";

const AddressInfo = ({
  address,
  className = "",
}: { address: IAddress } & ClassName) => {
  return (
    <div className={`${className}`}>
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
        {address.landmark ? `, ${address.landmark}` : ""}, {address.city},{" "}
        {address.state} - {address.pinCode}, {address.country}
      </p>
      {address.gst && (
        <p className="text-silver-jet text-sm mt-1">GST: {address.gst}</p>
      )}
    </div>
  );
};

export default AddressInfo;
