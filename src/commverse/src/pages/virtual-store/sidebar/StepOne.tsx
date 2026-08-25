import { Icon } from '@iconify/react';
import IconInput from '../../../components/IconInput';
import TemplateCard from '../components/TemplateCard';
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { StepProps } from '../components/VirtualStoreSidebar';
import { useFormContext, useWatch } from 'react-hook-form';
import type { StoreFormType } from '..';

const STORE_TEMPLATES = [
  {
    id: 'furniture',
    title: 'Furniture',
    imageSrc: '/assets/images/virtual-storefront/step-one/furniture.png',
  },
  {
    id: 'cosmetics',
    title: 'Cosmetics',
    imageSrc: '/assets/images/virtual-storefront/step-one/cosmetics.png',
  },
  {
    id: 'home-decor',
    title: 'Home Decor',
    imageSrc: '/assets/images/virtual-storefront/step-one/home-decor.png',
  },
  {
    id: 'personal-care',
    title: 'Personal Care',
    imageSrc: '/assets/images/virtual-storefront/step-one/personal-care.png',
  },
  {
    id: 'shoe',
    title: 'Shoe',
    imageSrc: '/assets/images/virtual-storefront/step-one/shoe.png',
  },
  {
    id: 'supplements',
    title: 'Supplements',
    imageSrc: '/assets/images/virtual-storefront/step-one/supplements.png',
  },
  {
    id: 'speakers',
    title: 'Speakers',
    imageSrc: '/assets/images/virtual-storefront/step-one/speakers.png',
  },
  {
    id: 'tv-laptop',
    title: 'TV & Laptop',
    imageSrc: '/assets/images/virtual-storefront/step-one/tv-and-laptop.png',
  },
] as const;

const StepOne = ({ resetSignal = 0 }: StepProps) => {
  const { control, setValue } = useFormContext<StoreFormType>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const selectedTemplateId = useWatch({
    control,
    name: 'selectedTemplateId',
  });

  const hasSearch = searchTerm.trim().length > 0;
  const filteredTemplates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return STORE_TEMPLATES;

    return STORE_TEMPLATES.filter((template) =>
      template.title.toLowerCase().includes(normalizedSearch)
    );
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm('');
  }, [resetSignal]);

  return (
    <Fragment>
      <p className="text-xs/normal">Choose your desired store</p>
      <div className="flex flex-col gap-3 px-2">
        <div className="flex h-6 items-center">
          <span className="text-[13px]/[1.25] font-semibold">
            Store Templates
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IconInput
            type="search"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search store"
            containerClassName="flex-1"
            leftAddon={
              <Icon
                icon="solar:magnifer-linear"
                className="text-neutral-gray-500 size-5 shrink-0"
              />
            }
            className="border-neutral-gray-400! placeholder:text-neutral-gray-500! h-10! rounded-lg! py-2! pr-3! pl-9! text-xs! leading-normal!"
          />
          <button
            type="button"
            aria-label="Sort templates"
            className="bg-neutral-gray-400 text-neutral-gray-700 flex h-10 w-10 items-center justify-center rounded-lg"
          >
            <Icon
              icon="solar:list-arrow-up-minimalistic-linear"
              className="size-5"
            />
          </button>
        </div>
        {hasSearch && filteredTemplates.length === 0 ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center gap-8">
              <div className="relative flex h-27.5">
                <img
                  src="/assets/images/product-detail/file-upload.webp"
                  alt="No results"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-1 text-center">
                <div className="text-neutral-gray-700 font-metropolis text-sm/[17px] font-semibold">
                  No results found
                </div>
                <div className="text-neutral-gray-600 font-metropolis text-xs/[18px]">
                  However, you can create a product now
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                title={template.title}
                imageSrc={template.imageSrc}
                isSelected={selectedTemplateId === template.id}
                onClick={() => setValue('selectedTemplateId', template.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default StepOne;
