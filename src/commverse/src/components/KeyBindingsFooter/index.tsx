import { Icon } from '@iconify/react';

const KeyBindingsFooter = () => {
  const data = [
    { key: 'A', icon: 'solar:arrow-left-linear', text: 'Left' },
    { key: 'S', icon: 'solar:arrow-down-linear', text: 'Backward' },
    { key: 'D', icon: 'solar:arrow-right-linear', text: 'Right' },
    { key: 'W', icon: 'solar:arrow-up-linear', text: 'Forward' },
  ];

  return (
    <div className="font-metropolis flex w-full justify-between">
      <div className="flex gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 text-xs leading-[18px]"
          >
            <div className="bg-neutral-gray-600 text-neutral-gray-100 flex h-4 w-4 items-center justify-center rounded-sm">
              {item.key}
            </div>
            <div className="text-neutral-gray-600">/</div>
            <Icon
              icon={item.icon}
              className="bg-neutral-gray-600 text-neutral-gray-100 flex h-4 w-4 items-center justify-center rounded-sm p-0.5"
            />
            <div className="text-neutral-gray-600">{item.text}</div>
          </div>
        ))}
      </div>
      <div className="text-neutral-gray-600 flex gap-6 text-xs leading-[18px]">
        <div className="flex items-center gap-1">
          <img src="/assets/images/virtual-storefront/pan.png" />
          <div>Pan</div>
        </div>
        <div className="flex items-center gap-1">
          <img src="/assets/images/virtual-storefront/rotate.png" />
          <div>Rotate</div>
        </div>
      </div>
    </div>
  );
};

export default KeyBindingsFooter;
