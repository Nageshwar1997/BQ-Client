import { Icon } from '@iconify/react';
import IconInput from '../../../../../components/IconInput';
import useQueryParams from '../../../../../hooks/useQueryParams';
import FilterDropdown from '../../../../../components/FilterDropdown';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../../components/Modal';
import Button from '../../../../../components/Button';
import Input from '../../../../../components/Input';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterSettingsHeaderActions } from '../../../../../hooks/useRegisterSettingsHeaderActions';
import {
} from '../../../../../lib/utils';
import type {
  SelectedOption,
  ToastCardProps,
} from '../../../../../types';
import ToastCard from '../../../../../components/AlertCards/ToastCard';
import { EXPERIENCE_DOMAIN, MODULE_MAP } from '../../../../../constants';
import { useGetCategories } from '../../../../../services/category-service';
import { Link, Outlet, useLocation } from 'react-router';
import { useGetSites } from '../../../../../services/auth-service';
import { useUpdateExperience } from '../../../../../services/experience-service';

const manageExperienceFormDefaultValues = {
  prefix: '',
  type: '',
};

const ManageExperiences = () => {
  const { queryParams, updateParams } = useQueryParams();
  const categoriesQuery = useGetCategories();
  const { pathname } = useLocation();
  const { data: sitesData } = useGetSites();
  const updateExperienceMutation = useUpdateExperience();

  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [editing, setEditing] = useState<{
    id: string;
    moduleIndex: number;
    type: string;
    // We need some reference for extraction
    link?: string;
  } | null>(null);
  const [openCardIndex, setOpenCardIndex] = useState<string | null>(null);

  // We need to keep some state to verify link options for the modal
  // But wait, it's better if we just use a fixed list of common options or fetch them?
  // For now, let's keep it simple.
  const prefixOptions = useMemo(() => {
    if (!sitesData?.data) return [];
    return sitesData.data.map((site: any) => ({
      id: site.subdomain,
      label: site.subdomain,
      value: site.subdomain,
    }));
  }, [sitesData]);

  const manageExperienceSchema = useMemo(() => {
    return z.object({
      prefix: z.string(),
      type: z.string(),
    });
  }, []);

  type ManageExperienceFormData = z.infer<typeof manageExperienceSchema>;

  const { control, watch, reset, handleSubmit } =
    useForm<ManageExperienceFormData>({
      resolver: zodResolver(manageExperienceSchema),
      defaultValues: manageExperienceFormDefaultValues,
    });

  const prefixValue = watch('prefix');
  const typeValue = watch('type');

  const handleModalClose = () => {
    reset(manageExperienceFormDefaultValues);
    setEditing(null);
  };

  const onModalSave = (data: ManageExperienceFormData) => {
    if (!editing) return;

    const selectedSite = sitesData?.data?.find((s: any) => s.subdomain === data.prefix);
    const siteId = selectedSite?._id;

    if (!siteId) {
      setToastCardProps({
        type: 'error',
        title: 'Failed to update link',
        description: 'Selected subdomain not found.'
      });
      return;
    }

    const updateData = {
      siteInfo: {
        siteId,
        slug: data.type
      }
    };

    updateExperienceMutation.mutateAsync(
      { id: editing.id, data: updateData },
      {
        onSuccess: () => {
          setTimeout(() => {
            setToastCardProps({
              type: 'success',
              title: 'Experience link updated successfully',
            });
          }, 0);
          handleModalClose();
        },
        onError: (err: any) => {
          setTimeout(() => {
            setToastCardProps({
              type: 'error',
              title: 'Failed to update link',
              description: err?.message || 'Something went wrong',
            });
          }, 0);
        },
      }
    );
  };


  useEffect(() => {
    if (!editing?.link) return;

    // Parse existing link: (https://)subdomain.commverse.studio/slug
    let fullLink = editing.link;
    if (fullLink.startsWith('http')) {
      fullLink = fullLink.split('://')[1] || '';
    }

    const [domainPart, ...rest] = fullLink.split('/');
    let slug = rest.join('/');

    // Remove mapped suffix if it exists
    if (editing.type && MODULE_MAP[editing.type]) {
      const suffix = MODULE_MAP[editing.type];
      if (slug.endsWith(`/${suffix}`)) {
        slug = slug.replace(new RegExp(`/${suffix}$`), '');
      }
    }

    const subdomain = domainPart.replace(EXPERIENCE_DOMAIN, '');

    reset({
      prefix: subdomain || '',
      type: slug || '',
    });
  }, [editing, reset]);

  useRegisterSettingsHeaderActions(
    useMemo(() => ({
      saveBtnProps: { onClick: () => console.log('Save clicked') },
      cancelBtnProps: { onClick: () => reset() },
    }), [reset])
  );

  const categoryOptions = useMemo(() => {
    if (!categoriesQuery.data) return [];
    return categoriesQuery.data.map((c: any) => ({
      id: c._id,
      label: c.name,
      value: c._id,
    }));
  }, [categoriesQuery.data]);


  return (
    <div className="text-neutral-gray-900 font-metropolis flex max-h-full max-w-3/5 flex-col gap-4">
      <div className="leading-5 font-semibold">Manage Experiences</div>
      <div className="flex flex-col gap-5 overflow-hidden">
        <div className="flex gap-4">
          <IconInput
            type="text"
            placeholder="Search Products"
            containerClassName="w-full"
            className="h-10 pl-9! text-xs! focus:ring-0!"
            leftAddon={
              <Icon icon="solar:magnifer-linear" className="text-neutral-gray-500 h-5 w-5" />
            }
            defaultValue={queryParams.q}
            onChange={(val) => {
              if (val) updateParams({ set: { q: val } });
              else updateParams({ remove: ['q'] });
            }}
          />
          <div
            className="bg-neutral-gray-300 flex h-10 w-10 min-w-10 cursor-pointer items-center justify-center rounded-lg"
            onClick={() => {
              if (queryParams.sort) updateParams({ remove: ['sort'] });
              else updateParams({ set: { sort: 'asc' } });
            }}
          >
            <Icon
              icon={queryParams.sort ? 'solar:list-arrow-up-bold' : 'solar:list-arrow-down-bold'}
              className="h-5 w-5"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <FilterDropdown
            placeholder="Category"
            leftIcon={<Icon icon="solar:widget-2-linear" className="h-4 w-4" />}
            options={categoryOptions}
            innerLabel={categoryOptions.find((o: any) => o.value === queryParams.categoryId)?.label}
            value={queryParams.categoryId}
            onChange={(option) => updateParams({ set: { categoryId: (option as SelectedOption)?.value } })}
            className="[&>button>span:nth-child(2)]:text-neutral-gray-700! [&>button]:h-8 [&>button]:min-w-0! [&>button>span:nth-child(3)]:hidden! [&>button>svg]:size-4"
          />
        </div>

        <div className="flex grow flex-col gap-4 overflow-hidden">
          <div className="border-neutral-gray-400 bg-neutral-gray-300 grid min-h-10 grid-cols-2 rounded-xl border p-1">
            {['Tagged', 'Untagged'].map((item) => {
              const redirectUrl = `/settings/site-settings/manage-experiences/${item.toLowerCase()}`;
              const isActive = pathname === redirectUrl;
              return (
                <Link
                  key={item}
                  to={redirectUrl}
                  className={`flex h-full items-center justify-center text-xs text-[#1A1A1A] ${isActive ? 'bg-neutral-gray-100 rounded-lg font-semibold' : 'font-medium'}`}
                >
                  {item} Experiences
                </Link>
              );
            })}
          </div>
          <div className="grow overflow-y-scroll">
            <Outlet context={{
              filters: { q: queryParams.q, categoryId: queryParams.categoryId, sort: queryParams.sort },
              setEditing,
              setOpenCardIndex,
              openCardIndex,
              setToastCardProps
            }} />
          </div>
        </div>
      </div>

      <Modal open={editing !== null} onClose={handleModalClose} className="[&>div]:h-min [&>div]:w-[563px] [&>div]:overflow-visible!">
        <div className="text-neutral-gray-900 flex h-full w-full flex-col items-center gap-6 p-10">
          <div className="self-start text-2xl leading-7 font-bold">Edit Experience Link</div>
          <div className="flex w-full flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-xs leading-[18px] font-medium">Select Option</div>
              <div className="flex h-9 gap-1">
                <Controller
                  control={control}
                  name="prefix"
                  render={({ field: { value, onChange } }) => (
                    <FilterDropdown
                      placeholder="subdomain"
                      options={prefixOptions}
                      value={value}
                      innerLabel={value || 'subdomain'}
                      onChange={(option) => onChange((option as SelectedOption).value)}
                      className="[&>button>span:nth-child(1)]:text-neutral-gray-900! grow [&>button]:h-full! [&>button]:min-w-full! [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-4"
                    />
                  )}
                />
                <Input containerClassName="h-full! [&>div]:h-full!" className="text-neutral-gray-600! h-full! w-[134px]! text-xs!" value={EXPERIENCE_DOMAIN} disabled />
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      placeholder="slug"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      containerClassName="h-full! grow"
                      className="text-neutral-gray-900!!h-full! w-full! text-xs!"
                    />
                  )}
                />
              </div>
            </div>
            {(prefixValue || typeValue) && (
              <div className="flex flex-col gap-1 text-[10px] leading-[14px]">
                <div className="text-neutral-gray-600 font-medium">Preview</div>
                <div className="text-brand px-1 py-0.5 font-semibold">
                  {prefixValue}{EXPERIENCE_DOMAIN}{typeValue ? `/${typeValue}` : ''}{editing?.type ? `/${MODULE_MAP[editing.type] || editing.type}` : ''}
                </div>
              </div>
            )}
          </div>
          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" content="Cancel" size="sm" className="h-10!" onClick={handleModalClose} />
            <Button content="Save" size="sm" className="h-10!" onClick={handleSubmit(onModalSave)} />
          </div>
        </div>
      </Modal>

      {toastCardProps && <ToastCard key={JSON.stringify(toastCardProps)} {...toastCardProps} />}
    </div>
  );
};

export default ManageExperiences;
