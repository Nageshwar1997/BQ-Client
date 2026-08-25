import { useState } from 'react';
import { useSearchParams } from 'react-router';
// import PricingBanner from './components/PricingBanner';
import {
  CURRENCY_SYMBOL,
  getInitialAllowances,
  PLAN_IDS,
  PLANS,
} from '../../../../../constants';
import type {
  CurrencyCode,
  FilterOption,
  Plan,
  PlanId,
} from '../../../../../types';
import FilterDropdown from '../../../../../components/FilterDropdown';
import PricingCard from './components/PricingCard';
import Button from '../../../../../components/Button';
import { Icon } from '@iconify/react';
import useQueryParams from '../../../../../hooks/useQueryParams';
import { PricingTable } from './components/PricingTable';
import {
  formatCatalogPrice,
  pickCatalogAmount,
  resolveBillingCurrency,
} from '../../../../../lib/utils';
import { useSubscriptionPricingCatalog } from '../../../../../services/auth-service';

const CHECKOUT_CURRENCY_OPTIONS: FilterOption[] = [
  { id: 'USD', value: 'USD', label: 'USD' },
  { id: 'INR', value: 'INR', label: 'INR' },
];

const PlanAndBilling = () => {
  const [allowances, setAllowances] =
    useState<Record<string, string>>(getInitialAllowances);
  const { queryParams, updateParams } = useQueryParams();
  const [searchParams] = useSearchParams();
  const [showPricing, setShowPricing] = useState(false);

  const { data: pricingApi, isPending: isCatalogPending } =
    useSubscriptionPricingCatalog();

  const catalog = pricingApi?.success ? pricingApi.data : undefined;
  /** Read currency from the URL object directly to avoid a one-frame mismatch with derived query objects on hydrate. */
  const currencyFromUrl = searchParams.get('currency') ?? undefined;
  const billingCurrency = resolveBillingCurrency(currencyFromUrl);
  const isAnnualBillingCycle = queryParams.billingCycle === 'yearly';

  const getCurrencyPrefix = (code: CurrencyCode) =>
    CURRENCY_SYMBOL[code] ?? '$';

  const getPrice = (plan: Plan) => {
    const cycle = isAnnualBillingCycle ? 'annual' : 'monthly';
    let quantity = 1;
    const selectedAllowance = getSelectedAllowance(plan);
    const allowanceIndex =
      plan.allowance?.values?.indexOf(selectedAllowance) ?? 0;

    if (plan.id === 'pro' || plan.id === 'business') {
      quantity = Math.pow(2, Math.max(0, allowanceIndex));
      const base = pickCatalogAmount(catalog, plan.id, cycle, billingCurrency);
      if (base != null) {
        return formatCatalogPrice(base * quantity, billingCurrency);
      }
      /** Don’t flash USD-shaped constants while INR (or catalog) is still loading. */
      if (isCatalogPending && billingCurrency === 'INR') {
        return '…';
      }
    }

    const priceStr = isAnnualBillingCycle
      ? plan.yearlyPrice
      : plan.monthlyPrice;
    if (!priceStr || priceStr === 'Custom')
      return priceStr === 'Custom' ? 'Custom' : '';

    const basePrice = Number(priceStr);
    const finalPrice = basePrice * quantity;
    if (plan.id === 'free')
      return `${getCurrencyPrefix(billingCurrency as CurrencyCode)}0`;

    return `${getCurrencyPrefix(billingCurrency as CurrencyCode)}${finalPrice}`;
  };

  const getPriceCycleLabel = (plan: Plan) => {
    if (plan.id === 'free') return 'Forever';
    if (!plan.priceMeta) return null;
    if (plan.priceMeta.toLowerCase() !== 'per month') return null;
    return isAnnualBillingCycle ? 'per year' : 'per month';
  };

  const getSelectedAllowance = (plan: Plan) => {
    return allowances[plan.id] ?? plan.allowance?.values[0] ?? '';
  };

  const handleNavigatePlanWithArrow = (planId: PlanId, direction: 1 | -1) => {
    const currentIndex = PLAN_IDS.indexOf(planId);
    if (currentIndex === -1) return;

    const nextIndex =
      (currentIndex + direction + PLAN_IDS.length) % PLAN_IDS.length;
    updateParams({ set: { planId: PLAN_IDS[nextIndex] } });
  };

  const handleSelectAllowance = (planId: PlanId, value: string) => {
    setAllowances((previous) => ({
      ...previous,
      [planId]: value,
    }));
  };

  return (
    <div className="font-metropolis text-neutral-gray-900 flex w-full flex-col gap-3">
      {/* <PricingBanner
        isManageModalOpen={modalState === 'manage'}
        isBuyCreditsModalOpen={modalState === 'buy-credits'}
        onOpenManage={() => setModalState('manage')}
        onCloseManage={() => setModalState(null)}
        onOpenBuyCredits={() => setModalState('buy-credits')}
        onCloseBuyCredits={() => setModalState(null)}
      /> */}

      <section className="font-metropolis bg-neutral-gray-100 flex w-full flex-col gap-4 rounded-xl p-4 sm:p-5">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 md:flex-nowrap">
          <div className="bg-neutral-gray-300 flex h-7.75 w-full max-w-74.75 shrink-0 items-center overflow-hidden rounded-lg">
            <button
              type="button"
              onClick={() => updateParams({ set: { billingCycle: 'monthly' } })}
              className={`flex h-[31px] w-1/2 cursor-pointer items-center justify-center px-3 text-xs leading-[15px] transition-colors ${
                !isAnnualBillingCycle
                  ? 'bg-neutral-gray-800 font-semibold text-white'
                  : 'bg-neutral-gray-300 text-neutral-gray-900 font-medium'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => updateParams({ set: { billingCycle: 'yearly' } })}
              className={`flex h-[31px] w-1/2 cursor-pointer items-center gap-1 px-3 ${
                isAnnualBillingCycle
                  ? 'bg-neutral-gray-800 text-white'
                  : 'bg-neutral-gray-300 text-neutral-gray-900'
              }`}
            >
              <span className="text-xs leading-[15px] font-medium">Yearly</span>
              <span className="flex h-[15px] w-[80px] items-center justify-center rounded-[30px] bg-[#dcfae6] text-[10px] leading-[13.5px] font-medium text-[#067647]">
                2 Months Free
              </span>
            </button>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-2">
            <p className="text-neutral-gray-900 text-xs leading-[18px] font-medium whitespace-nowrap">
              Show price in
            </p>
            <FilterDropdown
              options={CHECKOUT_CURRENCY_OPTIONS}
              value={currencyFromUrl ?? 'USD'}
              onChange={(selected) => {
                if (selected && !Array.isArray(selected)) {
                  updateParams({ set: { currency: String(selected.id) } });
                }
              }}
              placeholder="Currency"
              className="[&>button>span:nth-child(2)]:hidden!"
            />
          </div>
        </div>

        <div
          role="radiogroup"
          aria-label="Choose a pricing plan"
          className="flex w-full flex-wrap items-start gap-3 xl:flex-nowrap"
        >
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isSelectedPlan={queryParams.planId === plan.id}
              selectedAllowance={getSelectedAllowance(plan)}
              onSelectPlan={(id) => updateParams({ set: { planId: id } })}
              onNavigatePlanWithArrow={handleNavigatePlanWithArrow}
              onSelectAllowance={handleSelectAllowance}
              getPrice={getPrice}
              getPriceCycleLabel={getPriceCycleLabel}
              billingCurrency={billingCurrency}
            />
          ))}
        </div>

        <div className="flex w-full justify-center">
          <Button
            variant="tertiary"
            size="sm"
            content="Full Feature List"
            className={
              showPricing
                ? 'h-[48px]! w-[204px]! gap-2! rounded-[12px]! bg-[#EAEBF1]! px-4! py-3! text-[#18181a]!'
                : 'h-12! w-fit! gap-2! px-4! py-3!'
            }
            leftIcon={
              <Icon
                icon={showPricing ? 'lucide:x' : 'lucide:plus'}
                className="size-5"
              />
            }
            // This will now flip the state regardless of the current value
            onClick={() => setShowPricing(!showPricing)}
          />
        </div>
        {showPricing && (
          <PricingTable
            getPrice={getPrice}
            getPriceCycleLabel={getPriceCycleLabel}
          />
        )}
      </section>
    </div>
  );
};

export default PlanAndBilling;
