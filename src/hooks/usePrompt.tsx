import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

const usePrompt = (
  when: boolean,
  onConfirm: () => void,
  onCancel: () => void
) => {
  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker.state === "blocked") {
      onConfirm(); // show confirmation modal
    } else if (blocker.state === "unblocked") {
      onCancel(); // reset modal or cleanup
    }
  }, [blocker.state, onConfirm, onCancel]);

  return {
    proceed: () => blocker?.proceed?.(), // allow navigation
    reset: () => blocker?.reset?.(), // cancel navigation
  };
};

export default usePrompt;
