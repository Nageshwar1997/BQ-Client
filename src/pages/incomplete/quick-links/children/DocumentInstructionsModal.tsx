import { useEffect } from "react";
import Modal from "../../../components/modal";
import useQueryParams from "../../../hooks/useQueryParams";
import { BECOME_A_SELLER_DOCUMENT_INSTRUCTIONS } from "../data";

const DocumentInstructionsModal = () => {
  const { queryParams, removeParam } = useQueryParams();

  const key =
    queryParams.requiredDocument as keyof typeof BECOME_A_SELLER_DOCUMENT_INSTRUCTIONS;

  const instruction = BECOME_A_SELLER_DOCUMENT_INSTRUCTIONS[key];

  const onClose = () => removeParam("requiredDocument");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onClose, []);

  if (!instruction) return null;

  return (
    <Modal
      isOpen={!!key}
      onClose={onClose}
      heading={`Instructions for ${instruction.title}`}
      className="max-w-lg! [&_h2]:text-base sm:[&_h2]:text-lg md:[&_h2]:text-xl lg:[&_h2]:text-2xl"
    >
      <div className="space-y-4">
        <ul className="space-y-2 text-xs md:text-sm text-silver-jet">
          {instruction.instructions.map((point, index) => (
            <div key={index} className="flex gap-1.5 md:gap-2">
              <span className="mt-1.25 min-w-1 min-h-1 max-w-1 max-h-1 md:min-w-2 md:min-h-2 md:max-w-2 md:max-h-2 rounded-full bg-primary-50" />
              <li>{point}</li>
            </div>
          ))}
        </ul>
        {instruction.options?.length > 0 && (
          <>
            <hr className="w-full h-px block border-none bg-gradient-line" />
            <div>
              <h3 className="text-sm md:text-base font-medium text-silver mb-2">
                Accepted Documents: (Any one of the following)
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-silver-jet">
                {instruction.options.map((option, index) => (
                  <div key={index} className="flex gap-1.5 md:gap-2">
                    <span className="">{index + 1}</span>
                    <li className="">{option}</li>
                  </div>
                ))}
              </ul>
            </div>
          </>
        )}
        <hr className="w-full h-px block border-none bg-gradient-line" />
        <div className="text-xs/[14px] text-silver-jet-2 italic">
          Please ensure your uploaded document is genuine and up to date. Any
          falsified or unclear document may result in verification delays.
          <sup>*</sup>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentInstructionsModal;
