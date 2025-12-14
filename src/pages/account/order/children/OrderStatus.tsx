import { ORDER_STATUS } from "../../../../constants";
import { ClassName } from "../../../../types";
interface Props extends ClassName {
  currentStatus: string;
}

const OrderStatus = ({ currentStatus, className = "" }: Props) => {
  const stepIndex = ORDER_STATUS.indexOf(currentStatus);

  return (
    <section
      className={`w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90 pb-2 ${className}`}
    >
      <div className="py-2 px-4 border-b border-b-primary-30 mb-2 flex flex-col base:flex-row gap-3 sm:gap-4 justify-between">
        <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
          Order Tracking Status
        </h3>
      </div>
      <div className="px-4 flex flex-col gap-2">
        {ORDER_STATUS.map((step, index) => (
          <div key={step} className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <div
                className={`w-4 h-4 rounded-full mt-1 ${
                  index <= stepIndex
                    ? "bg-green-500 border-green-500"
                    : "bg-gray-300 border-gray-400"
                } border`}
              ></div>
              <p
                className={`text-sm sm:text-base ${
                  index <= stepIndex
                    ? "text-green-700 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {step.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderStatus;
