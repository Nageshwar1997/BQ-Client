import { Icon } from '@iconify/react';
import Button from '../Button';
import { type ButtonProps, type PublishStatus } from '../../types';
import { PublishStatusTab } from './PublishStatusTab';
import Input from '../Input';
import { useEffect, useMemo, useRef, useState } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { Link, useNavigate } from 'react-router';
import { getRelativePublishedText } from '../../lib/utils';
import FilterDropdown from '../FilterDropdown';
import { useGetSites } from '../../services/auth-service';
import { useUpdateExperience } from '../../services/experience-services';

const PublishOptionsModal: React.FC<{
  publishStatus: PublishStatus;
  changes: number;
  issues: number;
  onClose: () => void;
  buttonProps: ButtonProps;
  isPublishing?: boolean;
  experienceTitle: string;
  onTitleChange: (value: string) => void;
  publishedAt?: string;
  publishedLink?: string;
  className?: string;
  experienceData?: any;
  onDomainSettingsChange?: (settings: {
    siteId: string | null;
    slug: string;
  }) => void;
}> = ({
  publishStatus,
  changes,
  issues,
  onClose,
  onTitleChange,
  buttonProps,
  isPublishing = false,
  experienceTitle,
  publishedAt,
  publishedLink,
  className,
  experienceData,
  onDomainSettingsChange,
}) => {
  const navigate = useNavigate();
  const { data: sitesData } = useGetSites();
  const { mutate: updateExperience } = useUpdateExperience();

  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState({
    iframe: false,
    link: false,
  });
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [domainTitle, setDomainTitle] = useState('');

  const sites = sitesData?.data || [];
  const selectedSite = useMemo(
    () => sites.find((s: any) => s._id === selectedSiteId),
    [sites, selectedSiteId]
  );
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

  const domainPrefix = selectedSite?.subdomain.split('.')[0] || '';
  const experienceSiteId = experienceData?.siteInfo?.siteId || null;
  const experienceSlug = experienceData?.siteInfo?.slug || '';

  useEffect(() => {
    setSelectedSiteId(experienceSiteId);
    setDomainTitle(experienceSlug);

    if (experienceSiteId && experienceSlug) {
      onDomainSettingsChange?.({
        siteId: experienceSiteId,
        slug: experienceSlug,
      });
    }
  }, [experienceSiteId, experienceSlug, onDomainSettingsChange]);

  useEffect(() => {
    if (!selectedSiteId && sites.length > 0) {
      const defaultSiteId = sites[0]._id;
      setSelectedSiteId(defaultSiteId);
      onDomainSettingsChange?.({
        siteId: defaultSiteId,
        slug: domainTitle,
      });
    }
  }, [domainTitle, onDomainSettingsChange, selectedSiteId, sites]);

  useOutsideClick({
    ref: [containerRef],
    handler: () => onClose(),
  });

  const handleCopyLink = () => {
    if (!publishedLink) return;
    navigator.clipboard.writeText(publishedLink);
    setCopied((prev) => ({ ...prev, link: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, link: false })), 3000);
  };

  const handleCopyIframe = () => {
    if (!publishedLink) return;
    const iframeCode = `<iframe src="${publishedLink}" width="100%" height="600" frameborder="0" loading="lazy" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    setCopied((prev) => ({ ...prev, iframe: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, iframe: false })), 3000);
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
    const valid = /^[a-zA-Z0-9-]*$/.test(value) && value.length < 32;
    if (!valid) return;
    setDomainTitle(value);
    onDomainSettingsChange?.({
      siteId: selectedSiteId,
      slug: value,
    });
  };

  const commitSlugUpdate = () => {
    const experienceId = experienceData?._id ?? experienceData?.id;
    if (!experienceId || !selectedSiteId) return;
    updateExperience({
      id: experienceId,
      data: { siteInfo: { siteId: selectedSiteId, slug: domainTitle } },
    });
  };

  return (
    <div
      ref={containerRef}
      className={`font-metropolis bg-neutral-gray-100 text-neutral-gray-900 border-neutral-gray-200 shadow-toast-card absolute top-14 right-0 z-10 flex w-xs flex-col gap-5 rounded-xl border p-5 ${className}`}
    >
      <span className="text-sm/[17px] font-semibold">
        Publish your experience
      </span>
      <div className="grid grid-cols-[96px_1fr] items-center gap-x-2 gap-y-4 text-xs/4.5 font-semibold">
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
              onClick={() => navigate('/settings/site-settings/general')}
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
          onBlur={commitSlugUpdate}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
              commitSlugUpdate();
            }
          }}
          className="px-3! py-2! text-[12px] font-normal"
        />

        {/* Title */}
        <span>Title</span>
        <Input
          type="text"
          placeholder="Title"
          className="px-3! py-2! text-xs font-normal"
          value={experienceTitle}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        {/* Domain */}
        <span>Domain</span>
        <div className="flex min-w-0 items-center gap-2 font-medium">
          {publishStatus === 'Published' && publishedLink ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Link
                to={publishedLink}
                target="_blank"
                className="text-brand min-w-0 flex-1 truncate"
              >
                {publishedLink}
              </Link>
              <Icon
                icon="solar:copy-linear"
                onClick={handleCopyLink}
                className="text-neutral-gray-500 size-4 shrink-0 cursor-pointer"
              />
            </div>
          ) : (
            'Publish to create link'
          )}
        </div>

        {/* Status */}
        <span>Status</span>
        <PublishStatusTab status={publishStatus} />

        {/* Changes */}
        <span>Changes</span>
        <span className="font-normal">
          {changes === 0 ? 'No' : changes} changes
        </span>

        {/* Issues */}
        <span>Issues</span>
        <div className="flex items-center gap-2 font-normal">
          <span>{issues || 'No'} Issues</span>
          {issues > 0 && (
            <Icon
              icon="solar:danger-triangle-linear"
              className="text-neutral-gray-500 size-3"
            />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <p className="text-center text-[10px]/3.5">
          {publishStatus === 'Not Published' ? (
            <span>
              By publishing, you agree to{' '}
              <strong>Commverse Studio’s Beta Terms</strong> and{' '}
              <strong>Acceptable Use Policy</strong>
            </span>
          ) : publishStatus === 'Publishing' ? (
            'Publishing may take a few minutes—feel free to continue working and check back later'
          ) : publishedAt ? (
            getRelativePublishedText(publishedAt)
          ) : (
            'Experience is published'
          )}
        </p>
        {publishStatus === 'Published' && (
          <Button
            content={copied.iframe ? 'Copied!' : 'Copy Embed Code'}
            size="sm"
            disabled={copied.iframe}
            variant="tertiary"
            className="h-10!"
            onClick={handleCopyIframe}
          />
        )}
        <Button
          content={
            isPublishing || publishStatus === 'Publishing'
              ? 'Publishing'
              : 'Publish'
          }
          size="sm"
          className="h-10!"
          isLoading={isPublishing}
          {...buttonProps}
        />
      </div>
    </div>
  );
};

export default PublishOptionsModal;
