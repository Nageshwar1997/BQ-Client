import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import FilterDropdown from '../FilterDropdown';
import QRModal from './QRModal';
import { useGetSites } from '../../services/auth-service';
import { EXPERIENCE_DOMAIN, moduleMap } from '../../constants';
import type { TModules } from '../../types';

export type PublishStatus = 'Not Published' | 'Publishing' | 'Published';

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const componentStyling = (status: PublishStatus) => {
  switch (status) {
    case 'Not Published':
      return 'border-neutral-gray-400 bg-neutral-gray-200 text-neutral-gray-600';
    case 'Publishing':
      return 'border-ui-warning bg-ui-warning-light text-ui-warning';
    case 'Published':
      return 'border-ui-success bg-ui-success-light text-ui-success';
    default:
      return '';
  }
};

const PublishStatusTab = ({ status }: { status: PublishStatus }) => {
  return (
    <div
      className={`w-fit rounded-sm border px-2 py-1 font-normal ${componentStyling(status)}`}
    >
      <span>{status}</span>
    </div>
  );
};

const getPublishText = (status: PublishStatus, publishChanges: number) => {
  switch (status) {
    case 'Not Published':
      return 'Publish';
    case 'Publishing':
      return 'Publishing';
    case 'Published':
      return publishChanges > 0 ? 'Update' : 'Up to Date';
  }
};

interface PublishMenuOptionsProps {
  publishOptionsRef: React.RefObject<HTMLDivElement | null>;
  publishStatus: PublishStatus;
  canPublish: boolean;
  publishChanges: number;
  lastPublishedAt: Date | null;
  getRelativeTime: (date: Date) => string;
  onClose: () => void;
  onOpenModal: () => void;
  handlePublish: () => void;
  experienceData?: any;
  onNavigate: (path: string) => void;
  onDomainSettingsChange?: (settings: {
    siteId: string | null;
    slug: string;
  }) => void;
  onShowToast?: (
    title: string,
    state?: 'loading' | 'success' | 'error',
    description?: string
  ) => void;
}

const PublishMenuOptions = ({
  publishOptionsRef,
  publishStatus,
  publishChanges,
  canPublish,
  lastPublishedAt,
  getRelativeTime,
  onClose,
  onOpenModal,
  handlePublish,
  experienceData,
  onNavigate,
  onDomainSettingsChange,
  onShowToast,
}: PublishMenuOptionsProps) => {
  // API hooks
  const { data: sitesData } = useGetSites();

  // Local state
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [domainTitle, setDomainTitle] = useState('');
  const [isQrOpen, setIsQrOpen] = useState(false);

  const sites = sitesData?.data || [];

  // Populate from experience data and sync with parent
  useEffect(() => {
    if (experienceData?.siteInfo) {
      const siteId = experienceData.siteInfo.siteId || null;
      const slug = experienceData.siteInfo.slug || '';
      setSelectedSiteId(siteId);
      setDomainTitle(slug);
      // Sync with parent so pendingDomainSettings is set
      if (siteId && slug) {
        onDomainSettingsChange?.({ siteId, slug });
      }
    }
  }, [experienceData]);

  // Default to first site if none selected and sync with parent
  useEffect(() => {
    if (!selectedSiteId && sites.length > 0) {
      const defaultSiteId = sites[0]._id;
      setSelectedSiteId(defaultSiteId);
      onDomainSettingsChange?.({ siteId: defaultSiteId, slug: domainTitle });
    }
  }, [sites, selectedSiteId]);

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

  const selectedSite = useMemo(
    () => sites.find((s: any) => s._id === selectedSiteId),
    [sites, selectedSiteId]
  );

  const domainPrefix = selectedSite?.subdomain.split('.')[0] || '';

  const expModule = experienceData?.type || '';
  const isArExperience = expModule === 'ar_experience';
  const fixedDomainHost = EXPERIENCE_DOMAIN + '/';
  const fixedDomainSuffix = `/${
    (expModule && moduleMap[expModule as TModules]) || 'experience'
  }`;

  const previewLink = `${
    domainPrefix === '' ? '<select domain>' : toSlug(domainPrefix)
  }${fixedDomainHost}${
    domainTitle === '' ? '<domain-title>' : toSlug(domainTitle)
  }${fixedDomainSuffix}`;
  const fullDomainLink = `https://${previewLink}`;

  const handleCopyLink = () => {
    if (!navigator.clipboard) return;
    void navigator.clipboard.writeText(`https://${previewLink}`);
    onShowToast?.('Link copied to clipboard!');
  };

  const handleCopyEmbedCode = () => {
    if (!navigator.clipboard) return;
    const iframeCode = `<iframe
  src="${fullDomainLink}"
  width="100%"
  height="600"
  style="outline: none; border: none;"
></iframe>`;
    void navigator.clipboard.writeText(iframeCode);
    onShowToast?.('Embed code copied to clipboard!');
  };

  const handlePublishClick = () => {
    // Validate subdomain and domain title
    if (!selectedSiteId) {
      onShowToast?.('Please select a subdomain', 'error');
      return;
    }
    if (!domainTitle || domainTitle.trim() === '') {
      onShowToast?.('Please enter a domain title', 'error');
      return;
    }

    onClose();
    handlePublish();
    onOpenModal();
  };

  const handleSiteChange = (siteId: string) => {
    setSelectedSiteId(siteId);
    onDomainSettingsChange?.({
      siteId,
      slug: domainTitle,
    });
  };

  const handleDomainTitleChange = (value: string) => {
    // Only allow alphanumerics and hyphens
    value = value.toLowerCase();
    const valid = /^[a-z0-9-]*$/.test(value) && value.length < 32;
    if (!valid) {
      // onShowToast?.(
      //   'Domain title can only contain letters, numbers, and hyphens.',
      //   'error'
      // );
      return;
    }
    setDomainTitle(value);
    onDomainSettingsChange?.({
      siteId: selectedSiteId,
      slug: value,
    });
  };
  return (
    <div
      ref={publishOptionsRef}
      className="bg-neutral-gray-100 font-neutral-gray-900 border-neutral-gray-200 shadow-toast-card absolute right-8 bottom-0 z-9999999999 flex w-[320px] translate-y-full transform flex-col gap-5 rounded-xl border p-5"
    >
      <span className="text-[14px] font-semibold">Publish your experience</span>
      <div className="grid grid-cols-[96px_1fr] items-center gap-x-3 gap-y-4 text-[12px] font-semibold">
        <span>Sub Domain</span>
        <FilterDropdown
          value={selectedSiteId || domainPrefix}
          onChange={(selected) => {
            if (
              selected &&
              !Array.isArray(selected) &&
              typeof selected.value === 'string'
            ) {
              handleSiteChange(selected.value);
            }
          }}
          options={baseDomainOptions}
          placeholder="Select"
          menuWidth="250px"
          className="w-full [&>button]:h-8 [&>button]:w-full [&>button]:min-w-0 [&>button]:px-3 [&>button]:text-xs [&>button>span.rounded-full]:hidden"
          footerAction={
            <button
              type="button"
              onClick={() => onNavigate('/settings/site-settings/general')}
              className="font-metropolis hover:bg-neutral-gray-200 text-neutral-gray-900 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all duration-150"
            >
              <Icon icon="lucide:plus" className="size-4" />
              Add Subdomain
            </button>
          }
        />

        <span>Domain Title</span>
        <Input
          type="text"
          placeholder="domain-title"
          value={domainTitle}
          onChange={(e) => handleDomainTitleChange(e.target.value)}
          className="px-3! py-2! text-[12px] font-normal"
        />

        <span>Domain</span>
        <div className="flex items-center gap-2 truncate text-[12px] font-normal">
          {previewLink.includes('<') ? (
            <span className="text-neutral-gray-600">
              Publish to create link
            </span>
          ) : (
            <>
              <span className="text-brand truncate">{previewLink}</span>
              <button
                type="button"
                aria-label="Copy link"
                onClick={handleCopyLink}
                className="text-neutral-gray-700 hover:text-neutral-gray-900 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center"
              >
                <Icon icon="solar:copy-linear" className="size-4" />
              </button>
            </>
          )}
        </div>

        <span>Status</span>
        <PublishStatusTab status={publishStatus} />

        <span>Changes</span>
        <span className="font-normal">
          {publishStatus != 'Published'
            ? '-'
            : `${publishChanges === 0 ? 'No' : publishChanges} changes`}
        </span>

        <span>Issues</span>
        <span className="font-normal">No Issues</span>
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        {publishStatus === 'Published' && lastPublishedAt ? (
          <span className="text-[10px] font-normal">
            Last published {getRelativeTime(lastPublishedAt)}
          </span>
        ) : (
          <span className="text-center text-[10px] font-normal">
            By publishing, you agree to Commverse Studio's Beta Terms and
            Acceptable Use Policy
          </span>
        )}
        <Button
          variant="secondary"
          disabled={
            publishStatus != 'Published' ||
            (isArExperience && previewLink.includes('<'))
          }
          leftIcon={<Icon icon="solar:code-linear" width={20} height={20} />}
          content={isArExperience ? 'Show QR' : 'Copy Embed Code'}
          className="text-[14px]"
          onClick={() => {
            if (isArExperience) {
              setIsQrOpen(true);
            } else {
              handleCopyEmbedCode();
            }
          }}
        />
        <Button
          isLoading={publishStatus === 'Publishing'}
          content={getPublishText(publishStatus, publishChanges)}
          className="text-[14px]"
          disabled={publishStatus === 'Publishing' || !canPublish}
          onClick={handlePublishClick}
        />
      </div>

      {isArExperience && (
        <QRModal
          open={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          link={fullDomainLink}
          experienceTitle={experienceData?.title || experienceData?.name}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};

export default PublishMenuOptions;
