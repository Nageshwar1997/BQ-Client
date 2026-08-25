export type OnboardingHeaderTab =
  | 'brand-memory'
  | 'immersive-product-page'
  | 'beauty-try-on'
  | 'cloth-try-on'
  | 'product-ad';

export type OnboardingSignupType = 'brand' | 'individual';

type MemoryHeaderProps = {
  signupType?: OnboardingSignupType;
  activeTab: OnboardingHeaderTab;
  // onTabChange?: (tab: OnboardingHeaderTab) => void;
  className?: string;
};

const MemoryHeader = ({
  signupType = 'brand',
  activeTab,
  // onTabChange,
  className = '',
}: MemoryHeaderProps) => {
  const tabsBySignupType: Record<
    OnboardingSignupType,
    { key: OnboardingHeaderTab; label: string }[]
  > = {
    brand: [
      { key: 'brand-memory', label: 'Brand DNA' },
      { key: 'immersive-product-page', label: 'Immersive Product Page' },
    ],
    individual: [
      { key: 'beauty-try-on', label: 'Beauty Try-on' },
      { key: 'cloth-try-on', label: 'Cloth Try-on' },
      { key: 'product-ad', label: 'Product Ad' },
    ],
  };

  const tabs = tabsBySignupType[signupType];
  const activeTabIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === activeTab)
  );

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      <div
        className="flex w-full max-w-[432px] items-start justify-center gap-3 pointer-events-none"
        role="tablist"
      >
        {tabs.map((tab, index) => {
          const isSelected = tab.key === activeTab;
          const isActive = index <= activeTabIndex;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              // onClick={() => onTabChange?.(tab.key)}
              className="flex w-[200px] flex-col items-center gap-3"
            >
              <div
                className={`h-[8px] w-full rounded-[10px] transition-colors ${
                  isActive ? 'bg-brand' : 'bg-neutral-gray-300'
                }`}
              />
              <span className="font-metropolis text-neutral-gray-900 text-center text-[16px] leading-[1.2] font-semibold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryHeader;
