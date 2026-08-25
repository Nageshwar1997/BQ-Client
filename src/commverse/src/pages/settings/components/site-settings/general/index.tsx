import { Icon } from '@iconify/react';
import Button from '../../../../../components/Button';
import Divider from '../../../../../components/Divider';
import { useForm, useWatch } from 'react-hook-form';
import type { ToastCardProps, DomainFormData } from '../../../../../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateGeneralSchema } from '../../../../../schema/settings.schema';
import { useCallback, useEffect, useState, useMemo } from 'react';
import ImageInput from '../../../../../components/Input/ImageInput';
import ToastCard from '../../../../../components/AlertCards/ToastCard';
import { deepEqual, getImageUrl } from '../../../../../lib/utils';
import {
  useGetSites,
  useCreateSite,
  useUpdateSite,
  useDeleteSite,
} from '../../../../../services/auth-service';
import { EXPERIENCE_DOMAIN } from '../../../../../constants';
import DomainModal from './components/DomainModal';
import UnpublishModal from './components/UnpublishModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import buildSettingsFormData from './components/buildSettingsFormData';

// Using a local type since we are mostly dealing with site-specific info here
type LocalFormData = {
  title: string;
  lightFavicon: File | string | null;
  darkFavicon: File | string | null;
};

type SiteData = {
  _id: string;
  subdomain: string;
  isPublished: boolean;
  favicon?: {
    light?: string | null;
    dark?: string | null;
  };
};

const General = () => {
  const [modalState, setModalState] = useState<
    'domain' | 'unpublish' | 'delete-confirm' | null
  >(null);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState<number>(0);
  const [hiddenDomains] = useState<Record<string, boolean>>({});

  const { data: sitesData } = useGetSites();
  const createSiteMutation = useCreateSite();
  const updateSiteMutation = useUpdateSite();
  const deleteSiteMutation = useDeleteSite();

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSiteId && sitesData?.data?.length > 0) {
      setSelectedSiteId(sitesData.data[0]._id);
    }
  }, [selectedSiteId, sitesData]);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);

  const domainSuffix = EXPERIENCE_DOMAIN;

  const generalForm = useForm<LocalFormData>({
    defaultValues: {
      title: '',
      lightFavicon: null,
      darkFavicon: null,
    },
  });

  const domainForm = useForm<DomainFormData>({
    resolver: zodResolver(updateGeneralSchema.shape.domains.unwrap().element),
  });

  const lightFavicon = useWatch({
    control: generalForm.control,
    name: 'lightFavicon',
  });
  const darkFavicon = useWatch({
    control: generalForm.control,
    name: 'darkFavicon',
  });

  const showToast = (toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  };

  const getMaskedDomain = (domain: string) => {
    const suffix = EXPERIENCE_DOMAIN;
    if (!domain.endsWith(suffix)) return '••••••';

    const prefix = domain.replace(suffix, '');
    if (prefix.length <= 2) return `${prefix[0] ?? ''}••${suffix}`;

    return `${prefix.slice(0, 2)}••••${suffix}`;
  };

  const handleCopyDomain = async (domain: string) => {
    try {
      await navigator.clipboard.writeText(domain);
      showToast({
        type: 'success',
        title: 'Domain copied',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Unable to copy domain',
      });
    }
  };

  const handleModalCloseSite = useCallback(() => {
    domainForm.reset();
    setEditingSiteId(null);
    setModalState(null);
  }, [domainForm]);

  const sites = useMemo<SiteData[]>(() => sitesData?.data || [], [sitesData]);
  const effectiveSelectedSiteId = selectedSiteId ?? sites[0]?._id ?? null;
  const selectedSite = useMemo<SiteData | undefined>(
    () => sites.find((site) => site._id === effectiveSelectedSiteId),
    [effectiveSelectedSiteId, sites]
  );

  const saveFaviconChanges = useCallback(
    (newBody: Pick<LocalFormData, 'lightFavicon' | 'darkFavicon'>) => {
      if (!effectiveSelectedSiteId) {
        showToast({
          type: 'warning',
          title: 'No site selected',
          description: 'Please select a domain first',
        });
        return;
      }

      const oldBody = {
        lightFavicon: selectedSite?.favicon?.light
          ? getImageUrl(selectedSite.favicon.light)
          : null,
        darkFavicon: selectedSite?.favicon?.dark
          ? getImageUrl(selectedSite.favicon.dark)
          : null,
      };

      if (deepEqual(oldBody, newBody)) {
        return;
      }

      const formData = buildSettingsFormData({ oldBody, newBody });

      updateSiteMutation.mutate(
        { id: effectiveSelectedSiteId, body: formData },
        {
          onSuccess: () => {
            showToast({
              type: 'success',
              title: 'Site updated successfully!',
            });
          },
          onError: (err: Error) => {
            generalForm.setValue('lightFavicon', oldBody.lightFavicon);
            generalForm.setValue('darkFavicon', oldBody.darkFavicon);
            showToast({
              type: 'error',
              title: 'Unable to update site!',
              description: err.message,
            });
          },
        }
      );
    },
    [effectiveSelectedSiteId, generalForm, selectedSite, updateSiteMutation]
  );

  useEffect(() => {
    if (selectedSite) {
      generalForm.setValue('title', selectedSite.subdomain);
      generalForm.setValue(
        'lightFavicon',
        selectedSite.favicon?.light
          ? getImageUrl(selectedSite.favicon.light)
          : null
      );
      generalForm.setValue(
        'darkFavicon',
        selectedSite.favicon?.dark
          ? getImageUrl(selectedSite.favicon.dark)
          : null
      );
    }
  }, [selectedSite, generalForm]);

  const handleTogglePublish = useCallback(() => {
    console.log(
      'Toggling publish for site:',
      selectedSiteId,
      'Current state:',
      selectedSite
    );
    if (!selectedSiteId || !selectedSite) return;

    const newStatus = !selectedSite.isPublished;
    const body = { isPublished: newStatus };

    updateSiteMutation.mutate(
      { id: selectedSiteId, body },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            title: `Site ${newStatus ? 'published' : 'unpublished'} successfully!`,
          });
          setModalState(null);
        },
        onError: (err: Error) => {
          showToast({
            type: 'error',
            title: `Failed to ${newStatus ? 'publish' : 'unpublish'} site!`,
            description: err.message,
          });
        },
      }
    );
  }, [selectedSiteId, selectedSite, updateSiteMutation]);

  const handleSaveSubdomain = (data: DomainFormData) => {
    const subdomain = data.value.split('.')[0]; // Extract subdomain without suffix
    if (editingSiteId) {
      // Subdomain update logic
      const body = { subdomain };

      updateSiteMutation.mutate(
        { id: editingSiteId, body },
        {
          onSuccess: () => {
            showToast({
              type: 'success',
              title: 'Subdomain updated successfully!',
            });
            handleModalCloseSite();
          },
          onError: (err: Error) => {
            showToast({
              type: 'error',
              title: 'Unable to update subdomain!',
              description: err.message,
            });
          },
        }
      );
    } else {
      createSiteMutation.mutate(
        { value: subdomain },
        {
          onSuccess: (res) => {
            showToast({ type: 'success', title: 'Site created successfully!' });
            setSelectedSiteId(res.data._id);
            handleModalCloseSite();
          },
          onError: (err: Error) => {
            showToast({
              type: 'error',
              title: 'Unable to create site!',
              description: err.message,
            });
          },
        }
      );
    }
  };

  const handleDeleteSite = () => {
    if (selectedSiteId) {
      deleteSiteMutation.mutate(selectedSiteId, {
        onSuccess: () => {
          showToast({
            type: 'success',
            title: 'Site deleted successfully',
          });
          setSelectedSiteId(null);
          setModalState(null);
        },
        onError: (err: Error) => {
          showToast({
            type: 'error',
            title: 'Unable to delete site',
            description: err.message,
          });
        },
      });
    }
  };

  return (
    <div className="text-neutral-gray-900 font-metropolis flex max-w-3/5 flex-col gap-3">
      <div className="leading-5 font-semibold">Site Information</div>
      <div className="flex items-center gap-3">
        <div className="flex grow flex-col gap-1 text-xs leading-[18px] font-medium">
          <div>Base Domain</div>
          <div className="text-neutral-gray-600">
            Create a branded link for your experience within Commverse.
          </div>
        </div>
        <Button
          variant="tertiary"
          content="Add"
          size="sm"
          className="h-8! w-min! p-2!"
          onClick={() => {
            setEditingSiteId(null);
            setModalState('domain');
          }}
        />
      </div>
      {sites.length > 0 && (
        <div className="bg-neutral-gray-200 flex flex-col rounded-lg p-2">
          {sites.map((site) => (
            <div
              key={site._id}
              className={`flex cursor-pointer items-center gap-4 rounded-sm p-1`}
              onClick={() => setSelectedSiteId(site._id)}
            >
              <div className="flex flex-1 text-center">
                <div
                  className={`${
                    selectedSiteId === site._id
                      ? `${
                          site.isPublished
                            ? 'text-brand'
                            : 'text-neutral-gray-600'
                        } bg-white shadow-sm shadow-black/5`
                      : `${
                          site.isPublished
                            ? 'text-neutral-gray-900'
                            : 'text-neutral-gray-600'
                        } bg-transparent`
                  } flex w-full items-start rounded-sm px-3 py-1.5 text-[10px] leading-[14px] font-semibold transition-all`}
                >
                  {hiddenDomains[site.subdomain]
                    ? getMaskedDomain(site.subdomain)
                    : site.subdomain + EXPERIENCE_DOMAIN}
                </div>
              </div>
              <div className="flex gap-4">
                {/* <div
                  className="flex aspect-square h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-white p-1 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://${site.subdomain + baseDomain}`,
                      '_blank'
                    );
                  }}
                >
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    className="h-3 w-3"
                  />
                </div> */}
                <div
                  className="flex aspect-square h-7 w-7 cursor-pointer items-center justify-center rounded-sm bg-white p-[3px] shadow-sm shadow-black/5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingSiteId(site._id);
                    domainForm.reset({
                      value: site.subdomain.replace(domainSuffix, ''),
                    });
                    setModalState('domain');
                  }}
                >
                  <Icon icon="solar:pen-linear" className="h-3 w-3" />
                </div>
                <div
                  className="flex aspect-square h-7 w-7 cursor-pointer items-center justify-center rounded-sm bg-white p-1 shadow-sm shadow-black/5"
                  onClick={(e) => {
                    e.stopPropagation();
                    const copyLink = site.subdomain + EXPERIENCE_DOMAIN;
                    handleCopyDomain(copyLink);
                  }}
                >
                  <Icon icon="solar:copy-linear" className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Divider className="border-t-neutral-gray-200! border-transparent!" />
      <div className="flex gap-3">
        <div className="flex grow flex-col gap-1 text-xs leading-4.5 font-medium">
          <span className="text-neutral-gray-900">Custom Domain</span>
          <div className="text-neutral-gray-600">
            Connect a domain from a third-party provider
          </div>
        </div>
        <div className="border-neutral-gray-900 text-neutral-gray-900 flex h-min items-center justify-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold">
          Coming Soon
        </div>
      </div>
      <Divider className="border-t-neutral-gray-200! border-transparent!" />
      <div className="flex gap-3">
        <div className="flex grow flex-col gap-1 text-xs leading-4.5 font-medium">
          <span className="text-neutral-gray-900">Site Information</span>
          <div className="text-neutral-gray-600">
            {selectedSite?.subdomain + EXPERIENCE_DOMAIN ||
              'No domain selected'}
          </div>
        </div>
        {selectedSite && (
          <span
            className={`${selectedSite.isPublished ? 'text-ui-error!' : 'text-brand'} cursor-pointer text-xs font-medium`}
            onClick={() => {
              if (selectedSite.isPublished) {
                setModalState('unpublish');
              } else {
                handleTogglePublish();
              }
            }}
          >
            {selectedSite.isPublished ? 'Unpublish' : 'Publish'}
          </span>
        )}
      </div>
      <Divider className="border-t-neutral-gray-200! border-transparent!" />
      <div className="flex justify-between gap-15">
        <div className="flex flex-col gap-1">
          <div className="leading-5 font-medium">Favicon</div>
          <div className="text-neutral-gray-600 text-xs leading-[18px] font-medium whitespace-nowrap">
            64 x 64 px
          </div>
        </div>
        <div className="flex gap-4">
          <ImageInput
            variant="general-favicon"
            className="max-w-[218px]"
            label="Light"
            description=""
            baseImage="/assets/images/light-favicon-bg.png"
            previewImage={
              typeof lightFavicon === 'string'
                ? lightFavicon
                : lightFavicon === null
                  ? ''
                  : undefined
            }
            onChange={(fileList) => {
              const file = fileList?.[0];
              if (file) {
                generalForm.setValue('lightFavicon', file, {
                  shouldValidate: true,
                });
                saveFaviconChanges({
                  lightFavicon: file,
                  darkFavicon,
                });
              }
            }}
            onClose={() => {
              generalForm.setValue('lightFavicon', null);
              saveFaviconChanges({
                lightFavicon: null,
                darkFavicon,
              });
            }}
            errorText={
              generalForm.formState.errors.lightFavicon?.message as string
            }
          />
          <ImageInput
            variant="general-favicon"
            className="max-w-[218px]"
            label="Dark"
            description=""
            baseImage="/assets/images/dark-favicon-bg.png"
            previewImage={
              typeof darkFavicon === 'string'
                ? darkFavicon
                : darkFavicon === null
                  ? ''
                  : undefined
            }
            onChange={(fileList) => {
              const file = fileList?.[0];
              if (file) {
                generalForm.setValue('darkFavicon', file, {
                  shouldValidate: true,
                });
                saveFaviconChanges({
                  lightFavicon,
                  darkFavicon: file,
                });
              }
            }}
            onClose={() => {
              generalForm.setValue('darkFavicon', null);
              saveFaviconChanges({
                lightFavicon,
                darkFavicon: null,
              });
            }}
            errorText={
              generalForm.formState.errors.darkFavicon?.message as string
            }
          />
        </div>
      </div>
      <Divider className="border-t-neutral-gray-200! border-transparent!" />
      <div className="flex grow flex-col gap-1 text-xs leading-4.5 font-medium">
        <label className="text-neutral-gray-900 text-xs font-medium">
          Who Can View Website
        </label>

        <div className="border-neutral-gray-900 flex items-center gap-x-2 rounded-lg border p-1.5 px-2">
          <Icon icon="solar:global-linear" className="h-4 w-4" />
          <label className="text-neutral-gray-900 text-xs">
            Anyone on the web
          </label>
          <div className="flex h-min items-center justify-center rounded-md border bg-blue-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Public
          </div>
        </div>

        {/* Todo: Remove the comment once visibility is implemented */}
        {/* <div className="text-neutral-gray-600 font-thin">
          Changing audience will take effect immediately
        </div> */}
      </div>
      <Divider className="border-t-neutral-gray-200! border-transparent!" />
      <div className="flex gap-3">
        <div className="flex grow flex-col gap-1 text-xs leading-4.5 font-medium">
          <span className="text-neutral-gray-900">Permanently Delete Site</span>
          <div className="text-neutral-gray-600">
            Permanently delete your sub-domain
          </div>
        </div>
        <span
          className={`text-ui-error! cursor-pointer text-xs font-medium ${!selectedSiteId ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={() => selectedSiteId && setModalState('delete-confirm')}
        >
          Delete
        </span>
      </div>

      {/* modals */}
      <DomainModal
        open={modalState === 'domain'}
        isEdit={Boolean(editingSiteId)}
        domainSuffix={domainSuffix}
        domainForm={domainForm}
        onSave={handleSaveSubdomain}
        isLoading={createSiteMutation.isPending || updateSiteMutation.isPending}
        onClose={handleModalCloseSite}
      />
      <UnpublishModal
        open={modalState === 'unpublish'}
        onClose={() => setModalState(null)}
        onConfirm={handleTogglePublish}
        subdomain={selectedSite?.subdomain}
        isLoading={updateSiteMutation.isPending}
      />

      <DeleteConfirmModal
        open={modalState === 'delete-confirm'}
        onClose={() => setModalState(null)}
        onConfirm={handleDeleteSite}
        subdomain={selectedSite?.subdomain}
        isLoading={deleteSiteMutation.isPending}
      />

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </div>
  );
};

export default General;
