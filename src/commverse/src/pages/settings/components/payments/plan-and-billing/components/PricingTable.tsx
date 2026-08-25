import { Icon } from '@iconify/react';
import { Minus } from 'lucide-react';
import Button from '../../../../../../components/Button';
import {
  plans,
  sections,
  type CellValue,
  type PlanHeader,
} from './pricing-data';
import type {
  ButtonVariant,
  Plan as PricingPlan,
} from '../../../../../../types';
import { PLANS } from '../../../../../../constants';
import { MostValueIcon } from '../../../../../../icons';

function normalizeModuleKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// const SECTION_LABEL_ALIASES: Record<string, string> = {
//   'Try-On': 'Try on',
//   '3D Configurator': '3D Configuration',
// };

const MODULE_SPECS_BY_KEY = (() => {
  const map = new Map<string, (typeof PLANS)[number]['modules'][number]>();
  for (const plan of PLANS) {
    for (const mod of plan.modules ?? []) {
      const key = normalizeModuleKey(mod.label);
      if (!map.has(key)) map.set(key, mod);
    }
  }
  return map;
})();

function getSectionIconSpec(sectionTitle: string) {
  const desiredLabel = sectionTitle;
  return MODULE_SPECS_BY_KEY.get(normalizeModuleKey(desiredLabel)) ?? null;
}

function SectionTitleIcon({ title }: { title: string }) {
  if (title === 'General') return null;
  const spec = getSectionIconSpec(title);
  if (!spec) return null;
  return <Icon icon={spec.icon} className={`${spec.colorClass} size-7`} />;
}

function CellContent({ value }: { value: CellValue }) {
  if (value === null) {
    return <Minus className="h-4 w-4 text-[#b6b7bf]" strokeWidth={1.5} />;
  }
  if (value === true) {
    return (
      <span className="text-[14px] leading-[1.25] text-[#18181a]">
        &#10003;
      </span>
    );
  }
  return (
    <span className="text-[14px] leading-[1.25] text-[#18181a]">{value}</span>
  );
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

function PlanHeaderCard({
  plan,
  getPrice,
  getPriceCycleLabel,
}: {
  plan: PlanHeader;
  getPrice: (plan: PricingPlan) => string;
  getPriceCycleLabel: (plan: PricingPlan) => string | null;
}) {
  // const buttonVariant =
  //   plan.buttonLabel === 'Business' ? 'primary' : 'secondary';
  let buttonVariant: ButtonVariant;
  if (plan.name == 'Business') buttonVariant = 'primary';
  else if (plan.name == 'Free') buttonVariant = 'ghost';
  else buttonVariant = 'secondary';

  const pricingPlan = PLANS.find((candidate) => candidate.id === plan.id);
  const computedPrice = pricingPlan ? getPrice(pricingPlan) : plan.priceMonthly;
  const computedCycleLabel = pricingPlan
    ? getPriceCycleLabel(pricingPlan)
    : null;
  const showYearlyPricing = computedCycleLabel === 'per month';

  const mostValueLabel = plan.mostValue
    ? (plan.mostValueLabel ?? 'Most Value')
    : undefined;

  return (
    <div className="flex h-full flex-col">
      <MostValueBadgeSlot label={mostValueLabel} />
      <div className="flex flex-1 flex-col gap-3 px-5 pt-3 pb-0">
        <div>
          <span className="text-[20px] leading-[1.2] font-bold text-[#0f0f10]">
            {plan.name}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-end">
            <span className="text-[24px] leading-[1.2] font-bold text-[#0f0f10]">
              {computedPrice}
            </span>
            {computedCycleLabel && (
              <span className="text-[16px] leading-[1.2] text-[#0f0f10]">
                / {computedCycleLabel}
              </span>
            )}
          </div>
          {showYearlyPricing && plan.priceYearly ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] leading-[1.3] font-bold text-[#0f0f10]">
                {plan.priceYearly}
              </span>
              <span className="text-[12px] leading-[1.3] text-[#0f0f10]">
                {plan.priceYearlyPeriod}
              </span>
              {plan.saveBadge && (
                <span className="rounded bg-[#22c55e]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#22c55e]">
                  {plan.saveBadge}
                </span>
              )}
            </div>
          ) : (
            <div className="h-[18px]" />
          )}
        </div>
        <p className="text-[12px] leading-[1.5] font-medium text-[rgba(0,0,17,0.53)]">
          {plan.description}
        </p>
        <Button
          variant={buttonVariant}
          size="md"
          content={plan.buttonLabel}
          className={`!rounded-[8px]! !px-4! !py-2.5! mt-auto h-[38px]! w-full cursor-pointer text-[14px]! leading-[1.25]! font-semibold! transition-colors!`}
        />
      </div>
    </div>
  );
}

type PricingTableProps = {
  getPrice: (plan: PricingPlan) => string;
  getPriceCycleLabel: (plan: PricingPlan) => string | null;
};

export function PricingTable({
  getPrice,
  getPriceCycleLabel,
}: PricingTableProps) {
  const colTemplate = 'grid-cols-[241px_repeat(4,225px)]';
  const highlightedColumn = 'bg-[#F0F4FF] border-x border-[#1D5FFF]/30';

  return (
    <div className="font-metropolis mx-auto w-full max-w-[1141px] overflow-x-auto bg-[#fff] px-0 py-5">
      <div className="min-w-[1141px]">
        {/* Header row */}
        <div className={`grid ${colTemplate} sticky top-0 z-20 bg-white`}>
          <div />
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative ${
                plan.highlighted
                  ? 'rounded-t-xl border border-b-0 border-[#1D5FFF]/30 bg-[#F0F4FF]'
                  : ''
              }`}
            >
              <PlanHeaderCard
                plan={plan}
                getPrice={getPrice}
                getPriceCycleLabel={getPriceCycleLabel}
              />
            </div>
          ))}
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title}>
            {/* Section title row */}
            <div className={`grid ${colTemplate}`}>
              <div className="flex h-20 items-end gap-2 pr-5 pb-3.5">
                <SectionTitleIcon title={section.title} />
                <span className="text-[16px] leading-[1.2] font-bold text-[#0f0f10]">
                  {section.title}
                </span>
              </div>
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`h-20 ${
                    plan.highlighted ? highlightedColumn : ''
                  }`}
                />
              ))}
            </div>

            {/* Feature rows */}
            {section.rows.map((row, rowIdx) => (
              <div
                key={`${section.title}-${row.label}`}
                className={`grid ${colTemplate}`}
              >
                {/* Label */}
                <div
                  className={`flex h-[44px] items-center pr-5 ${
                    rowIdx > 0 ? 'border-t border-[#b6b7bf]' : ''
                  }`}
                >
                  <span className="text-[14px] leading-[1.25] text-[#18181a]">
                    {row.label}
                  </span>
                </div>

                {/* Values for each plan */}
                {row.values.map((value, colIdx) => {
                  // const isCreditsRow =
                  //   row.label === 'Credits' && typeof value === 'string';
                  return (
                    <div
                      key={colIdx}
                      className={`flex h-[44px] items-center px-5 ${
                        rowIdx > 0 ? 'border-t border-[#b6b7bf]' : ''
                      } ${plans[colIdx].highlighted ? highlightedColumn : ''}`}
                    >
                      <CellContent value={value} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}

        {/* Bottom cap for highlighted column */}
        <div className={`grid ${colTemplate}`}>
          <div />
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`h-6 ${
                plan.highlighted
                  ? 'rounded-b-xl border border-t-0 border-[#1D5FFF]/30 bg-[#F0F4FF]'
                  : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
