import { ClassName } from "../../../../types";

const OrderKeyValue = ({
  field,
  value,
  className = "",
}: { field: string; value: string | null | undefined } & ClassName) => {
  if (!value) return;
  return (
    <p className={className}>
      <span className="font-medium">{field}: </span>
      <span className="font-semibold">{value}</span>
    </p>
  );
};

export default OrderKeyValue;
