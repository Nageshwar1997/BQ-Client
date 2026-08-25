import { useState } from 'react';
import { Icon } from '@iconify/react';
import type { FilterOption, Plan, PlanId } from '../../../../../../types';
import type { BillingCurrency } from '../../../../../../types/api.types';
import Button from '../../../../../../components/Button';
import FilterDropdown from '../../../../../../components/FilterDropdown';
import { MostValueIcon } from '../../../../../../icons';
import { createSubscriptionCheckout } from '../../../../../../services/api';

interface PricingCardProps {
  plan: Plan;
  isSelectedPlan: boolean;
  selectedAllowance: string;
  onSelectPlan: (planId: PlanId) => void;
  onNavigatePlanWithArrow: (planId: PlanId, direction: 1 | -1) => void;
  onSelectAllowance: (planId: PlanId, value: string) => void;
  getPrice: (plan: Plan) => string;
  getPriceCycleLabel: (plan: Plan) => string | null;
  billingCurrency: BillingCurrency;
}

function MostValueBadge({ label }: { label: string }) {
  return (
    <div className="-mx-px -mt-px flex h-[33px] w-[calc(100%+2px)] items-center justify-center gap-1.5 rounded-t-[11px] bg-[#1939F7] text-[14px] leading-[17.5px] font-semibold text-white shadow-[inset_0_-2px_0_0_#2E53FF]">
      <MostValueIcon />
      {label}
    </div>
  );
}

function MostValueBadgeSlot({ label }: { label?: string }) {
  return (
    <div className="h-[33px]" aria-hidden={!label}>
      {label ? <MostValueBadge label={label} /> : null}
    </div>
  );
}

const PricingCard = ({
  plan,
  isSelectedPlan,
  selectedAllowance,
  onSelectPlan,
  onNavigatePlanWithArrow,
  onSelectAllowance,
  getPrice,
  getPriceCycleLabel,
  billingCurrency,
}: PricingCardProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const hasAllowance = Boolean(plan.allowance);
  const allowanceOptions = plan.allowance?.values ?? [];
  const allowanceDropdownOptions: FilterOption[] = allowanceOptions.map(
    (value) => ({
      id: value,
      value,
      label: value,
    })
  );
  const showAllowanceField = plan.showAllowanceField ?? true;
  const priceCycleLabel = getPriceCycleLabel(plan);
  const isFreePlan = plan.id === 'free';
  const isProPlan = plan.id === 'pro';
  const isBusinessPlan = plan.id === 'business';
  const isBookDemoCta = plan.ctaLabel === 'Book a Demo';
  const isFreeOrProPlan = isFreePlan || isProPlan;
  const isFreeProBusinessPlan = isFreeOrProPlan || isBusinessPlan;
  const isTextOnlyAllowance =
    hasAllowance && showAllowanceField && !plan.allowance?.allowSelection;
  const ctaVariant = isFreePlan
    ? 'secondary'
    : plan.ctaStyle === 'brand'
      ? 'primary'
      : 'secondary';

  return (
    <article
      role="radio"
      aria-checked={isSelectedPlan}
      tabIndex={isSelectedPlan ? 0 : -1}
      onClick={() => onSelectPlan(plan.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectPlan(plan.id);
        }

        if (
          event.key === 'ArrowRight' ||
          event.key === 'ArrowDown' ||
          event.key === 'ArrowLeft' ||
          event.key === 'ArrowUp'
        ) {
          event.preventDefault();

          const offset =
            event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;

          onNavigatePlanWithArrow(plan.id, offset);
        }
      }}
      className={`relative flex w-full flex-col overflow-hidden rounded-[12px] p-0 sm:w-[calc(50%-6px)] xl:min-w-0 ${plan.cardHeight} ${
        plan.featured ? 'border border-[#2E53FF] bg-[#f3f7ff]' : 'bg-white'
      } ${isFreePlan ? 'xl:h-[533px]' : ''} focus-visible:ring-brand cursor-pointer focus-visible:ring-2 focus-visible:outline-none`}
    >
      <MostValueBadgeSlot label={plan.badgeLabel} />

      <div className={`flex flex-col px-5 pt-5 pb-4`}>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-neutral-gray-900 text-[28px] leading-[34px] font-bold">
            {plan.name}
          </h3>
        </div>

        <div className="mt-3 flex flex-col">
          <div className="flex items-end gap-1.5">
            <p className="text-neutral-gray-900 text-[32px] leading-9 font-bold">
              {getPrice(plan)}
            </p>
            {priceCycleLabel && (
              <p
                className={
                  isFreeProBusinessPlan
                    ? 'pb-0.5 text-[16px] leading-[19.2px] font-normal text-[#0F0F10]'
                    : 'text-neutral-gray-700 pb-0.5 text-xs leading-[18px] font-medium'
                }
              >
                {priceCycleLabel}
              </p>
            )}
          </div>
          <p className="mt-3 text-xs leading-[18px] font-medium text-[rgba(0,0,17,0.53)]">
            {plan.subtitle}
          </p>
          {plan.priceMeta && !priceCycleLabel && (
            <p className="text-neutral-gray-700 mt-0.5 text-xs leading-[18px] font-medium">
              {plan.priceMeta}
            </p>
          )}
        </div>
      </div>
      <div className="h-14 px-5">
        <Button
          variant={ctaVariant}
          size="md"
          content={plan.ctaLabel}
          disabled={isFreePlan}
          isLoading={isCheckingOut}
          className="w-full!"
          onClick={async (event) => {
            event.stopPropagation();
            if (isFreePlan) return;
            if (isBookDemoCta) {
              window.location.href =
                'https://calendly.com/contact-ctruh/introductory-call-commverse-studio';
              return;
            }

            try {
              setIsCheckingOut(true);

              let quantity = 1;
              const allowanceIndex =
                allowanceOptions.indexOf(selectedAllowance);
              if (
                (plan.id === 'pro' || plan.id === 'business') &&
                allowanceIndex >= 0
              ) {
                quantity = Math.pow(2, allowanceIndex);
              }

              const billingCycle =
                priceCycleLabel === 'per year' ? 'annual' : 'monthly';

              const response = await createSubscriptionCheckout({
                planId: plan.id,
                billingCycle,
                quantity,
                billingCurrency,
              });

              if (response?.data?.checkoutUrl) {
                window.location.href = response.data.checkoutUrl;
              }
            } catch (error) {
              console.error('Checkout failed:', error);
            } finally {
              setIsCheckingOut(false);
            }
          }}
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        {hasAllowance && showAllowanceField && !isTextOnlyAllowance && (
          <div
            data-allowance-root="true"
            onClick={(event) => event.stopPropagation()}
          >
            <FilterDropdown
              placeholder="Select allowance"
              options={allowanceDropdownOptions}
              value={selectedAllowance}
              onChange={(selected) => {
                if (selected && !Array.isArray(selected)) {
                  onSelectAllowance(plan.id, selected.id);
                }
              }}
              className="[&>button]:min-w-full! [&>button>span:nth-child(2)]:hidden!"
            />
          </div>
        )}
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-neutral-gray-900 text-xs leading-[18px] font-semibold">
            {plan.featureHeading}
          </p>
          <ul className="flex flex-col gap-1.5 pt-0.5">
            {plan.modules.map((module) => (
              <li
                key={module.label}
                className="text-neutral-gray-700 flex items-center gap-1.5 text-xs leading-[18px] font-medium"
              >
                <Icon
                  icon={module.icon}
                  className={`size-4 shrink-0 ${module.colorClass}`}
                />
                <span>{module.label}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-1.5">
            {plan.checklist.map((feature) => (
              <li
                key={feature}
                className="text-neutral-gray-700 flex items-start gap-1.5 text-xs leading-[18px] font-medium"
              >
                <span>✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};

export default PricingCard;
