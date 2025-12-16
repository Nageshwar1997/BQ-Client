import { ClassName } from "../../../../types";
import { getOrderTrackStatus } from "../../../../utils";
interface Props extends ClassName {
  currentStatus: string;
}

const OrderStatus = ({ currentStatus, className = "" }: Props) => {
  const optimizedStatuses = getOrderTrackStatus(currentStatus);
  const stepIndex = optimizedStatuses.indexOf(currentStatus);

  return (
    <section
      className={`w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90 pb-2 ${className}`}
    >
      <div className="py-2 px-4 border-b border-b-primary-30 mb-2 flex flex-col base:flex-row gap-3 sm:gap-4 justify-between">
        <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
          Order Tracking Status
        </h3>
      </div>
      <div className="px-4 flex flex-col">
        {optimizedStatuses.map((step, index) => (
          <div key={step} className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    index <= stepIndex ? "bg-jade-c" : "bg-secondary-50"
                  }`}
                />
                {index !== optimizedStatuses.length - 1 && (
                  <div
                    className={`w-px h-4 ${
                      index < stepIndex
                        ? "border-jade-c"
                        : "border-secondary-50"
                    } border`}
                  />
                )}
              </div>
              <p
                className={`text-xs/none font-medium mt-0.5 ${
                  index <= stepIndex ? "text-jade-c" : "text-secondary-50"
                }`}
              >
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderStatus;
