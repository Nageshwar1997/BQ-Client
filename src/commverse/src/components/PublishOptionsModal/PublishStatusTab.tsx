import { componentStyling } from "../../lib/utils";
import type { PublishStatus } from "../../types";

export const PublishStatusTab: React.FC<{
  status: PublishStatus;
}> = ({ status }) => {
  return (
    <div
      className={`w-fit rounded-sm border px-2 py-1 font-normal ${componentStyling(status)}`}
    >
      <span>{status}</span>
    </div>
  );
};