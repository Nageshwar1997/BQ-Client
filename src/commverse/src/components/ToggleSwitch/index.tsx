import { useState, useEffect } from 'react';

export const ToggleSwitch = ({
  isOn,
  onToggle,
}: {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
}) => {
  const [toggle, setToggle] = useState(isOn);

  useEffect(() => {
    setToggle(isOn);
  }, [isOn]);

  const handleToggle = () => {
    const newValue = !toggle;
    setToggle(newValue);
    onToggle(newValue);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex h-3.5 w-7 cursor-pointer items-center rounded-full transition-colors duration-300 ${toggle ? 'bg-brand' : 'bg-neutral-gray-600'}`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full shadow-lg transition-transform duration-300 ${toggle ? 'bg-neutral-gray-100 translate-x-3.5' : 'bg-neutral-gray-400 -translate-x-0.5'}`}
      />
    </button>
  );
};
