import { Icon } from '@iconify/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useGetSites } from '../../../services/auth-service';
import {
  useGetExperienceById,
  usePublishExperience,
  useUpdateExperience,
} from '../../../services/experience-service';
import { getImageUrl } from '../../../lib/utils';
import ToastCard from '../../../components/AlertCards/ToastCard';
import type { ToastCardProps, TModules } from '../../../types';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';
import FilterDropdown from '../../../components/FilterDropdown';
import UnpublishModal from '../../settings/components/site-settings/general/components/UnpublishModal';
import { EXPERIENCE_DOMAIN, moduleMap } from '../../../constants';
import { VITE_PUBLISH_BASE_URL } from '../../../env';
import Userprofile from '../../../components/Userprofile';

type ViewMode = 'draft' | 'published';
type LinkAudience = 'public' | 'link-only';

type SectionHeadingProps = {
  title: string;
  description?: string;
  textWidthClass?: string;
};

const SectionHeading = ({
  title,
  description,
  textWidthClass = 'w-full',
}: SectionHeadingProps) => {
  return (
    <div className={`${textWidthClass} flex flex-col gap-1`}>
      <h2 className="font-metropolis text-neutral-gray-900 text-base leading-[1.2] font-semibold">
        {title}
      </h2>
      {description ? (
        <p className="font-metropolis text-neutral-gray-600 text-xs leading-normal font-medium">
          {description}
        </p>
      ) : null}
    </div>
  );
};

const SectionDivider = ({ side }: { side: 'left' | 'right' }) => {
  return (
    <div
      className={
        side === 'left' ? 'flex items-center py-5' : 'flex items-center py-6'
      }
    >
      <Divider className="border-neutral-gray-200! my-0! w-full" />
    </div>
  );
};

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const ExperienceSettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // API hooks
  const getExperienceByIdQuery = useGetExperienceById(id || '');
  const experience = getExperienceByIdQuery.data?.data;
  // const isExperienceLoading = getExperienceByIdQuery.isLoading;

  const { data: sitesData } = useGetSites();
  const updateExperienceMutation = useUpdateExperience();
  const publishExperienceMutation = usePublishExperience();

  const sites = sitesData?.data || [];

  // Form state
  const socialImageInputRef = useRef<HTMLInputElement>(null);
  const [socialImageFile, setSocialImageFile] = useState<File | null>(null);
  const [socialImagePreviewUrl, setSocialImagePreviewUrl] = useState<
    string | null
  >(null);
  const [initialSocialImage, setInitialSocialImage] = useState<string | null>(
    null
  );
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [domainTitle, setDomainTitle] = useState('');
  const [linkAudience, setLinkAudience] = useState<LinkAudience>('public');
  const [modalState, setModalState] = useState<'unpublish' | null>(null);
  const [toastProps, setToastProps] = useState<ToastCardProps | null>(null);
  const [toastKey, setToastKey] = useState(0);

  const [isReady, setIsReady] = useState(false);

  // Populate form from API
  useEffect(() => {
    if (experience && sites.length > 0) {
      setSiteTitle(experience.siteInfo?.pageTitle || '');
      setSiteDescription(experience.siteInfo?.pageDescription || '');
      setDomainTitle(experience.siteInfo?.slug || '');

      const initialSiteId = experience.siteInfo?.siteId || sites[0]._id;
      setSelectedSiteId(initialSiteId);

      setLinkAudience((experience.access as LinkAudience) || 'public');
      setInitialSocialImage(
        experience.siteInfo?.socialImage
          ? getImageUrl(experience.siteInfo.socialImage)
          : null
      );
      setIsReady(true);
    }
  }, [experience, sites]);

  const isDirty = useMemo(() => {
    if (!experience || !isReady) return false;

    const initialPageTitle = experience.siteInfo?.pageTitle || '';
    const initialPageDescription = experience.siteInfo?.pageDescription || '';
    const initialSlug = experience.siteInfo?.slug || '';
    const initialSiteId =
      experience.siteInfo?.siteId || (sites.length > 0 ? sites[0]._id : null);
    const initialAccess = (experience.access as LinkAudience) || 'public';

    const hasExistingSocialImageBeenCleared =
      !!experience.siteInfo?.socialImage && initialSocialImage === null;

    return (
      siteTitle !== initialPageTitle ||
      siteDescription !== initialPageDescription ||
      domainTitle !== initialSlug ||
      selectedSiteId !== initialSiteId ||
      linkAudience !== initialAccess ||
      socialImageFile !== null ||
      hasExistingSocialImageBeenCleared
    );
  }, [
    siteTitle,
    siteDescription,
    domainTitle,
    selectedSiteId,
    linkAudience,
    socialImageFile,
    initialSocialImage,
    experience,
    isReady,
    sites,
  ]);

  const showToastNotification = (props: ToastCardProps) => {
    setToastProps(props);
    setToastKey((prev) => prev + 1);
  };

  const mode: ViewMode =
    experience?.status === 'published' ? 'published' : 'draft';
  const isPublished = mode === 'published';

  const expModule = experience?.type ?? '';
  const siteDescriptionPlaceholder = isPublished
    ? siteTitle
    : 'Site Description';
  const hasSocialImage =
    Boolean(socialImageFile) || Boolean(initialSocialImage);
  const fixedDomainHost =
    (VITE_PUBLISH_BASE_URL ? EXPERIENCE_DOMAIN : '') + '/';
  const fixedDomainSuffix = `/${
    (expModule && moduleMap[expModule as TModules]) || 'experience'
  }`;

  const selectedSite = useMemo(
    () => sites.find((s: any) => s._id === selectedSiteId),
    [sites, selectedSiteId]
  );

  const domainPrefix = selectedSite?.subdomain.split('.')[0] || '';

  const previewLink = `${domainPrefix === '' ? '<select domain>' : toSlug(domainPrefix)}${fixedDomainHost}${domainTitle === '' ? '<domain-title>' : toSlug(domainTitle)}${fixedDomainSuffix}`;

  const baseDomainOptions = useMemo(
    () =>
      sites.length > 0
        ? sites.map((s: any) => ({
            id: s._id,
            value: s._id,
            label: s.subdomain.split('.')[0],
          }))
        : [],
    [sites]
  );

  // const currentAudience =
  //   linkAudience === 'public'
  //     ? {
  //         value: 'public',
  //         label: 'Anyone on the web',
  //         chip: 'Public',
  //         helper: 'Changing audience will take effect immediately',
  //         icon: 'solar:global-linear',
  //       }
  //     : {
  //         value: 'link-only',
  //         label: 'Anyone with the link',
  //         chip: 'Unlisted',
  //         helper: 'Changing audience will take effect immediately',
  //         icon: 'solar:link-linear',
  //       };

  // const audienceOptions = [
  //   {
  //     value: 'public',
  //     label: 'Anyone on the web',
  //     icon: <Icon icon="solar:global-linear" className="size-4" />,
  //     rightIcon: (
  //       <div className="flex items-center gap-2">
  //         <span className="bg-brand/10 text-brand rounded px-1.5 py-0.5 text-[10px] leading-none font-semibold">
  //           Public
  //         </span>
  //         {linkAudience === 'public' ? (
  //           <Icon
  //             icon="solar:check-circle-bold"
  //             className="text-brand size-4"
  //           />
  //         ) : null}
  //       </div>
  //     ),
  //   },
  //   {
  //     value: 'link-only',
  //     label: 'Anyone with the link',
  //     icon: <Icon icon="solar:link-linear" className="size-4" />,
  //     rightIcon: (
  //       <div className="flex items-center gap-2">
  //         <span className="bg-neutral-gray-300 text-neutral-gray-700 rounded px-1.5 py-0.5 text-[10px] leading-none font-semibold">
  //           Unlisted
  //         </span>
  //         {linkAudience === 'link-only' ? (
  //           <Icon
  //             icon="solar:check-circle-bold"
  //             className="text-brand size-4"
  //           />
  //         ) : null}
  //       </div>
  //     ),
  //   },
  // ];

  useEffect(() => {
    if (!socialImageFile) {
      setSocialImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(socialImageFile);
    setSocialImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [socialImageFile]);

  const handleSocialImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSocialImageFile(file);
  };

  const handleSocialImageAction = () => {
    if (isPublished || hasSocialImage) {
      setSocialImageFile(null);
      setInitialSocialImage(null);
      if (socialImageInputRef.current) {
        socialImageInputRef.current.value = '';
      }
      return;
    }
    socialImageInputRef.current?.click();
  };

  const handleCopyPreviewLink = () => {
    if (!navigator.clipboard) return;
    void navigator.clipboard.writeText(`https://${previewLink}`);
    showToastNotification({
      type: 'success',
      title: 'Link copied to clipboard!',
    });
  };

  const handleSave = () => {
    if (!id) return;

    const formData = new FormData();
    if (socialImageFile) formData.append('socialImage', socialImageFile);

    if (domainPrefix === '' || domainTitle === '') {
      showToastNotification({
        type: 'error',
        title: 'Domain fields cannot be empty',
        description:
          'Please select a subdomain and enter a slug to save your settings.',
      });
      return;
    }

    formData.append(
      'siteInfo',
      JSON.stringify({
        siteId: selectedSiteId,
        pageTitle: siteTitle,
        pageDescription: siteDescription,
        slug: domainTitle,
      })
    );
    formData.append('access', linkAudience);

    updateExperienceMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          showToastNotification({
            type: 'success',
            title: 'Experience settings saved successfully!',
          });
        },
        onError: (err: any) => {
          showToastNotification({
            type: 'error',
            title: 'Failed to save settings',
            description: err?.message,
          });
        },
      }
    );
  };

  const handleTogglePublish = () => {
    if (!id || !experience) return;
    handleSave();
    const newStatus = isPublished ? 'draft' : 'published';
    publishExperienceMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          showToastNotification({
            type: 'success',
            title: `Experience ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`,
          });
          setModalState(null);
        },
        onError: (err: any) => {
          showToastNotification({
            type: 'error',
            title: `Failed to ${newStatus === 'published' ? 'publish' : 'unpublish'}`,
            description: err?.message,
          });
        },
      }
    );
  };

  return (
    <div className="bg-neutral-gray-100 font-metropolis h-full w-full overflow-auto">
      <header className="border-neutral-gray-200 w-full border-b px-4 py-4 sm:py-5 sm:pr-12 sm:pl-8">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="text-neutral-gray-900 inline-flex size-8 cursor-pointer items-center justify-center"
              >
                <Icon icon="solar:arrow-left-linear" className="size-8" />
              </button>
              <h1 className="font-metropolis text-neutral-gray-900 truncate text-2xl leading-[1.2] font-bold">
                Experience Site Settings
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Userprofile variant="avatar-menu" />
            {/* {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt="Profile"
                className="size-9 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="font-metropolis bg-neutral-gray-900 border-neutral-gray-200 flex size-9 items-center justify-center rounded-full border text-xs text-white shadow-sm">
                {getInitials(userName)}
              </div>
            )} */}
            <Button
              size="sm"
              variant="secondary"
              className="h-10! w-[78px]! px-4! py-3! text-sm!"
              content="Cancel"
              onClick={() => navigate(-1)}
            />
            <Button
              size="sm"
              variant="primary"
              className="h-10! w-fit! border-2! border-[rgba(255,255,255,0.1)]! px-4! py-3! text-sm!"
              content="Save"
              onClick={handleSave}
              isLoading={updateExperienceMutation.isPending}
              disabled={
                !isDirty ||
                updateExperienceMutation.isPending ||
                !domainTitle.trim()
              }
            />
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 pb-8 sm:pr-12 sm:pl-8">
        <div className="flex w-full flex-col gap-8 xl:flex-row xl:gap-8">
          <section className="flex w-full min-w-0 flex-1 flex-col">
            <div className="flex flex-col gap-3">
              <h2 className="font-metropolis text-neutral-gray-900 text-base leading-[1.2] font-semibold">
                Site Information
              </h2>
              <Input
                label="Site Title"
                placeholder="Site Title"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                disabled={isPublished}
                containerClassName="w-full"
                className="h-10! bg-white! text-xs!"
              />
              <TextArea
                label="Site Description"
                placeholder={siteDescriptionPlaceholder}
                value={siteDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setSiteDescription(e.target.value)
                }
                rows={3}
                containerClassName="w-full"
                disabled={isPublished}
                className={`h-[86px]! resize-none! bg-white! ${
                  isPublished ? 'placeholder:text-neutral-gray-600!' : ''
                }`}
              />
            </div>

            <SectionDivider side="left" />

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
              <div className="w-full sm:w-[173.333px]">
                <SectionHeading title="Favicon" description="64 x 64 px" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <img
                    src="/assets/images/light-favicon-bg.png"
                    alt="Light favicon background"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {selectedSite?.favicon?.light && (
                    <img
                      src={getImageUrl(selectedSite.favicon.light) as string}
                      alt="Light favicon preview"
                      className="absolute aspect-square object-contain"
                      style={{
                        width: `${(16 / 173.333) * 100}%`,
                        left: `${(68.666 / 173.333) * 100}%`,
                        top: `${(31 / 102.5) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <p className="font-metropolis text-neutral-gray-900 mt-1 text-xs leading-normal font-medium">
                  Light
                </p>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <img
                    src="/assets/images/dark-favicon-bg.png"
                    alt="Dark favicon background"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {selectedSite?.favicon?.dark && (
                    <img
                      src={getImageUrl(selectedSite.favicon.dark) as string}
                      alt="Dark favicon preview"
                      className="absolute aspect-square object-contain"
                      style={{
                        width: `${(16 / 173.333) * 100}%`,
                        left: `${(68.333 / 173.333) * 100}%`,
                        top: `${(31 / 102.5) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <p className="font-metropolis text-neutral-gray-900 mt-1 text-xs leading-normal font-medium">
                  Dark
                </p>
              </div>
            </div>

            <SectionDivider side="left" />

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
              <div className="flex w-full flex-col gap-3 sm:w-[266px] sm:shrink-0">
                <SectionHeading
                  title="Social Sharing Image"
                  description="1200 x 630 px"
                />
                <input
                  ref={socialImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSocialImageUpload}
                />
                <Button
                  size="sm"
                  variant={hasSocialImage ? 'secondary' : 'tertiary'}
                  className={`h-8! ${hasSocialImage ? 'w-[72px]!' : 'w-[66px]!'} px-2! py-3! text-sm! ${isPublished ? 'cursor-not-allowed!' : ''}`}
                  content={hasSocialImage ? 'Remove' : 'Upload'}
                  onClick={handleSocialImageAction}
                  disabled={isPublished}
                />
              </div>

              <div className="bg-neutral-gray-150 relative flex aspect-video w-full flex-1 items-center justify-center overflow-hidden rounded-xl">
                {socialImagePreviewUrl || initialSocialImage ? (
                  <img
                    src={
                      socialImagePreviewUrl || (initialSocialImage as string)
                    }
                    alt="Social sharing preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <p className="font-metropolis text-neutral-gray-600 text-xs leading-normal font-medium">
                    Preview
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="flex w-full min-w-0 flex-1 flex-col">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <SectionHeading
                  title="Site Status"
                  description={
                    isPublished
                      ? 'Your experience is live and publicly accessible'
                      : ' This experience is currently not live'
                  }
                  textWidthClass={isPublished ? 'w-[417px]' : 'w-[466px]'}
                />
                <Button
                  size="sm"
                  variant={isPublished ? 'ghost' : 'primary'}
                  className={
                    isPublished
                      ? 'text-ui-error! h-8! max-w-min bg-white! px-2! py-3! text-sm!'
                      : 'h-8! max-w-min border-2! border-[rgba(255,255,255,0.1)]! px-2! py-3! text-sm!'
                  }
                  content={isPublished ? 'Unpublish Site' : 'Publish'}
                  onClick={() => {
                    if (isPublished) {
                      setModalState('unpublish');
                    } else {
                      handleTogglePublish();
                    }
                  }}
                  isLoading={
                    !isPublished && publishExperienceMutation.isPending
                  }
                />
              </div>

              <div className="flex w-full flex-col gap-2">
                <span
                  className={`inline-flex h-[26px] w-fit items-center justify-center rounded-[4px] border px-2 py-1 text-xs leading-normal font-normal ${
                    isPublished
                      ? 'bg-ui-success-light border-ui-success text-ui-success'
                      : 'bg-neutral-gray-200 border-neutral-gray-600 text-neutral-gray-600'
                  }`}
                >
                  {isPublished ? 'Published' : 'Not Published'}
                </span>
              </div>
            </div>

            <SectionDivider side="right" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <SectionHeading
                  title="Base Domain"
                  description="Create a branded link for your experience within Commverse."
                  textWidthClass="w-full"
                />
                <Button
                  size="sm"
                  variant="tertiary"
                  className="h-8! w-fit! px-2! py-3! text-sm!"
                  content="Save"
                  onClick={handleSave}
                  isLoading={updateExperienceMutation.isPending}
                  disabled={
                    !isDirty ||
                    updateExperienceMutation.isPending ||
                    !domainTitle.trim()
                  }
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-gray-700 text-xs leading-[1.3] font-medium">
                    Link Preview
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-brand truncate text-xs leading-[1.3] font-medium">
                      {previewLink}
                    </p>
                    <button
                      type="button"
                      aria-label="Copy published link"
                      onClick={handleCopyPreviewLink}
                      disabled={!domainTitle.trim()}
                      className={`inline-flex h-5 w-5 items-center justify-center transition-colors ${
                        !domainTitle.trim()
                          ? 'text-neutral-gray-400 cursor-not-allowed'
                          : 'text-neutral-gray-700 hover:text-neutral-gray-900 cursor-pointer'
                      }`}
                    >
                      <Icon icon="solar:copy-linear" className="size-4.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-neutral-gray-700 text-xs leading-[1.3] font-medium">
                    Link Setup
                  </p>

                  <div className="flex w-full flex-wrap gap-1 sm:flex-nowrap">
                    <div className="w-[106px] shrink-0">
                      <FilterDropdown
                        value={selectedSiteId || domainPrefix}
                        onChange={(selected) => {
                          if (
                            selected &&
                            !Array.isArray(selected) &&
                            typeof selected.value === 'string'
                          ) {
                            setSelectedSiteId(selected.value);
                          }
                        }}
                        options={baseDomainOptions}
                        placeholder="Select"
                        menuWidth="250px"
                        className="w-full [&>button]:h-10 [&>button]:w-full [&>button]:min-w-0 [&>button]:px-3 [&>button]:text-xs [&>button>span.rounded-full]:hidden"
                        footerAction={
                          <button
                            type="button"
                            onClick={() =>
                              navigate('/settings/site-settings/general')
                            }
                            className="font-metropolis hover:bg-neutral-gray-200 text-neutral-gray-900 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all duration-150"
                          >
                            <Icon icon="lucide:plus" className="size-4" />
                            Add Subdomain
                          </button>
                        }
                      />
                    </div>

                    <Input
                      value={fixedDomainHost}
                      disabled
                      containerClassName="w-[138px] shrink-0"
                      className="text-neutral-gray-900! disabled:text-neutral-gray-900! h-10! text-xs!"
                    />
                    <Input
                      value={domainTitle}
                      placeholder="select-a-domain-title"
                      onChange={(event) => {
                        const value = event.target.value.toLowerCase();
                        const valid = /^[a-z0-9-]*$/.test(value);
                        if (!valid || value.length > 32) {
                          return;
                        }
                        setDomainTitle(value);
                      }}
                      containerClassName="min-w-[170px] flex-1"
                      className="h-10! bg-white! text-xs!"
                    />
                    <Input
                      value={fixedDomainSuffix}
                      disabled
                      containerClassName="w-[110px]! shrink-0"
                      className="text-neutral-gray-900! disabled:text-neutral-gray-900! h-10! text-xs!"
                    />
                  </div>

                  <p className="text-neutral-gray-600 text-xs leading-[1.3] font-normal">
                    Use lowercase letters, numbers, and hyphens only
                  </p>
                </div>
              </div>
            </div>

            <SectionDivider side="right" />

            <div className="flex items-center justify-between gap-3">
              <SectionHeading
                title="Custom Domain"
                description="Connect your own domain to create a fully branded experience."
                textWidthClass="w-full"
              />
              <span className="border-neutral-gray-900 bg-neutral-gray-100 text-neutral-gray-900 inline-flex shrink-0 items-center justify-center gap-[2px] rounded-[4px] border px-1 py-0.5 text-[10px] leading-[1.35] font-semibold">
                Coming Soon
              </span>
            </div>

            <SectionDivider side="right" />

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

              <div className="text-neutral-gray-600 font-thin">
                Changing audience will take effect immediately
              </div>
            </div>
          </section>
        </div>
      </main>

      <UnpublishModal
        open={modalState === 'unpublish'}
        onClose={() => setModalState(null)}
        onConfirm={handleTogglePublish}
        subdomain={domainPrefix}
        isLoading={publishExperienceMutation.isPending}
      />

      {toastProps && <ToastCard key={toastKey} {...toastProps} />}
    </div>
  );
};

export default ExperienceSettings;
