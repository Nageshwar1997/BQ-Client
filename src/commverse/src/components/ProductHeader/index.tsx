import React, { useEffect, useRef, useMemo, useState } from 'react';
import type { ProductHeaderProps, THeaderVariant } from '../../types';
import {
  blobUrlToFile,
  compareChanges,
  getRelativePublishTime,
  // getSettingChanges,
} from '../../lib/utils';
import SaveWarnModal from '../Overlay/SaveWarnModal';
import {
  useDeleteExperience,
  useDeleteExperienceImage,
  useGetExperienceById,
  usePublishExperience,
  useUpdateExperience,
  useUploadExperienceImages, // useDeleteVizExperience,
  // useGetVizExperiences,
} from '../../services/experience-services';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../Header';
import { defaultSettings, MODULE_MAP } from '../../constants';
import { ASSET_BASE_URL } from '../../env';
// import { useUpload3DAsset } from '../../services/assets-service';
// import { useSpriteWorker } from '../../webWorker/useSpriteWorker';
import {
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useParams,
} from 'react-router';
import ToastCard from '../AlertCards/ToastCard';
import { TryOnSaveWarnModal } from '../../pages/virtual-tryon/component/TryOnModals';
import { useModelStore } from '../../lib/store';
import type { VisualizerProps } from '../../types';
import PublishMenuOptions, { type PublishStatus } from './PublishMenuOptions';

type OverlayState = 'none' | 'options' | 'modal' | 'save-warn';

const ProductHeader: React.FC<ProductHeaderProps> = ({ module, settings }) => {
  const [activeOverlay, setActiveOverlay] = useState<OverlayState>('none');
  const [publishStatus, setPublishStatus] =
    useState<PublishStatus>('Not Published');
  const [showFirstPublishModal, setShowFirstPublishModal] = useState(false);
  const [lastPublishedAt, setLastPublishedAt] = useState<Date | null>(null);
  const [initData, setInitData] = useState<VisualizerProps | null>(null);
  const [publishedData, setPublishedData] = useState<VisualizerProps | null>(
    null
  );
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [pendingDomainSettings, setPendingDomainSettings] = useState<{
    siteId: string | null;
    slug: string;
  } | null>(null);
  const [initialDomainSettings, setInitialDomainSettings] = useState<{
    siteId: string | null;
    slug: string;
  } | null>(null);
  const [publishedDomainSettings, setPublishedDomainSettings] = useState<{
    siteId: string | null;
    slug: string;
  } | null>(null);
  const wasInitiallyPublishedRef = useRef<boolean | null>(null);
  const params = useParams<{ id?: string; experienceId?: string }>();
  const experienceId = params.experienceId ?? params.id;
  const navigate = useNavigate();

  const getExperienceQuery = useGetExperienceById(experienceId || '');
  const queryClient = useQueryClient();

  const updateExp = useUpdateExperience();
  const deleteExp = useDeleteExperience();

  //saving the draft data in initData on load
  useEffect(() => {
    if (initData || !getExperienceQuery.data?.data?.draftData) return;

    try {
      const parsedDraftData = JSON.parse(
        getExperienceQuery.data.data.draftData
      );

      let parsedPublishedData = null;
      if (getExperienceQuery.data.data.publishedData) {
        try {
          parsedPublishedData =
            typeof getExperienceQuery.data.data.publishedData === 'string'
              ? JSON.parse(getExperienceQuery.data.data.publishedData)
              : getExperienceQuery.data.data.publishedData;
        } catch (parseError) {
          console.warn('Error parsing published data:', parseError);
        }
      }

      const freshModelUrl = getExperienceQuery.data?.data?.assets?.[0]
        ?.modelUrl as string | undefined;
      if (freshModelUrl) {
        setModelUrl(freshModelUrl);
      }

      setInitData({ ...parsedDraftData });
      setPublishedData(parsedPublishedData);

      // Store initial domain settings from experience
      const expSiteInfo = getExperienceQuery.data.data.siteInfo;
      if (expSiteInfo) {
        const domainSettings = {
          siteId: expSiteInfo.siteId || null,
          slug: expSiteInfo.slug || '',
        };
        setInitialDomainSettings(domainSettings);
        // If already published, also set published domain settings
        if (getExperienceQuery.data.data.status === 'published') {
          setPublishedDomainSettings(domainSettings);
        }
      }
    } catch (error) {
      console.error('Error parsing initial draft data:', error);
      setInitData(defaultSettings);
    }
  }, [getExperienceQuery.data?.data?.draftData]);

  // Publish modal only on first upload
  useEffect(() => {
    const experienceData = getExperienceQuery.data?.data;
    if (!experienceData) return;

    if (wasInitiallyPublishedRef.current === null) {
      wasInitiallyPublishedRef.current = experienceData.status === 'published';
    }

    if (experienceData.status === 'published') {
      setPublishStatus('Published');
      if (experienceData.publishedAt) {
        setLastPublishedAt(new Date(experienceData.publishedAt));
      }
    } else {
      setPublishStatus('Not Published');
    }
  }, [getExperienceQuery.data?.data]);

  useEffect(() => {
    wasInitiallyPublishedRef.current = null;
    setShowFirstPublishModal(false);
  }, [experienceId]);

  const changes = useMemo(() => {
    if (!initData) return 0;
    const settingsChanges = compareChanges(settings, initData);
    // Only count domain changes if pendingDomainSettings exists and differs from initial
    let domainChanges = 0;
    if (pendingDomainSettings) {
      const initSiteId = initialDomainSettings?.siteId ?? null;
      const initSlug = initialDomainSettings?.slug ?? '';
      if (
        pendingDomainSettings.siteId !== initSiteId ||
        pendingDomainSettings.slug !== initSlug
      ) {
        domainChanges = 1;
      }
    }
    return settingsChanges + domainChanges;
  }, [initData, settings, pendingDomainSettings, initialDomainSettings]);

  const publishChanges = useMemo(() => {
    // If not published yet, count changes from defaults
    if (publishStatus === 'Not Published') {
      const changesFromDefaults = compareChanges(settings, defaultSettings);
      let domainChanges = 0;
      if (pendingDomainSettings) {
        if (pendingDomainSettings.siteId || pendingDomainSettings.slug) {
          domainChanges = 1;
        }
      }
      return changesFromDefaults + domainChanges;
    }
    if (!publishedData) return 0;
    const settingsChanges = compareChanges(settings, publishedData);

    // Check if domain settings have changed from the published state
    let domainChanges = 0;
    if (pendingDomainSettings) {
      const pubSiteId = publishedDomainSettings?.siteId ?? null;
      const pubSlug = publishedDomainSettings?.slug ?? '';
      if (
        pendingDomainSettings.siteId !== pubSiteId ||
        pendingDomainSettings.slug !== pubSlug
      ) {
        domainChanges = 1;
      }
    }

    return settingsChanges + domainChanges;
  }, [
    publishedData,
    settings,
    pendingDomainSettings,
    publishedDomainSettings,
    publishStatus,
    initData,
  ]);

  const handleNavigateToSettings = () => {
    if (module && experienceId) {
      navigate(`/${module}/${experienceId}/settings`);
    }
  };

  const hasUnsavedChanges = changes > 0;
  const { status } = useModelStore();

  // Detect if a configurator experience has no model added
  const isEmptyConfiguratorExperience =
    module === '3d_configurator' &&
    !modelUrl &&
    !settings.modelUrl &&
    !settings.modelFile &&
    publishStatus === 'Not Published';
  const publishOptionsRef = useRef<HTMLDivElement>(null);

  function getDraftData() {
    switch (module) {
      case '3d_visualizer':
        return JSON.stringify({
          modelTransform: settings.modelTransform,
          camera: {
            position: settings.camera.position,
          },
          shadowIntensity: settings.shadowIntensity,
          zoom: settings.zoom,
          environment: settings.environment,
          ctaBtn: settings.ctaBtn,
          brandLogo: settings.brandLogo,
        });
      case 'ar_experience':
        return JSON.stringify({
          modelTransform: settings.modelTransform,
          arAnchor: settings.arAnchor,
          shadowIntensity: settings.shadowIntensity,
          shadowSoftness: settings.shadowSoftness,
          zoom: settings.zoom,
          environment: {
            presetName: settings.environment.presetName,
            envType: settings.environment.envType,
            customEnvUrl: settings.environment.customEnvUrl,
            customEnvName: settings.environment.customEnvName,
            envBgColor: settings.environment.envBgColor,
            lightIntensity: settings.environment.lightIntensity,
          },
        });
      case '3d_configurator':
        return JSON.stringify(settings);
      default:
        return '';
    }
  }

  const publishExperience = usePublishExperience();
  const uploadImages = useUploadExperienceImages();
  const deleteExperienceImage = useDeleteExperienceImage();

  const toStorageKey = (value: string): string | null => {
    if (!value) return null;

    try {
      const normalized = value.startsWith('http')
        ? new URL(value).pathname
        : value;

      // Remove leading slash if present
      const withoutLeadingSlash = normalized.startsWith('/')
        ? normalized.slice(1)
        : normalized;

      if (withoutLeadingSlash.startsWith('experiences/uploads/')) {
        return withoutLeadingSlash;
      }
      return null;
    } catch {
      const withoutLeadingSlash = value.startsWith('/')
        ? value.slice(1)
        : value;
      if (withoutLeadingSlash.startsWith('experiences/uploads/'))
        return withoutLeadingSlash;
      return null;
    }
  };

  const toAssetUrl = (value: string): string => {
    if (!value) return value;
    if (value.startsWith('http')) return value;

    const normalizedPath = value.startsWith('/') ? value : `/${value}`;
    return new URL(normalizedPath, ASSET_BASE_URL).toString();
  };

  const canPublish =
    status === 'ready' &&
    (hasUnsavedChanges || publishChanges > 0) &&
    !!experienceId;

  const handleSave = async (): Promise<string | null> => {
    if (module === '3d_configurator') {
      const objectUrlsToRevoke: string[] = [];
      const modelFileUrl = settings.modelFile
        ? URL.createObjectURL(settings.modelFile)
        : settings.modelUrl || modelUrl;
      if (settings.modelFile && modelFileUrl?.startsWith('blob:')) {
        objectUrlsToRevoke.push(modelFileUrl);
      }

      const settingsAssetDataByModelUrl = new Map<string, string | null>();
      for (const entry of settings.assetData ?? []) {
        if (!entry?.modelUrl) continue;
        settingsAssetDataByModelUrl.set(entry.modelUrl, entry.assetId ?? null);
      }

      const normalizedVariants = (settings.variants ?? []).map((variant) => ({
        ...variant,
        editions: (variant.editions ?? []).map((edition) => {
          let editionModelUrl = edition.modelUrl ?? null;

          if (!editionModelUrl && edition.modelFile) {
            const generatedUrl = URL.createObjectURL(edition.modelFile);
            editionModelUrl = generatedUrl;
            objectUrlsToRevoke.push(generatedUrl);
          }

          const inferredEditionModelId = editionModelUrl
            ? (settingsAssetDataByModelUrl.get(editionModelUrl) ?? null)
            : null;
          const editionModelId = edition.modelId ?? inferredEditionModelId;

          return {
            ...edition,
            modelFile: null,
            modelUrl: editionModelUrl,
            modelId: editionModelId,
          };
        }),
      }));

      const discoveredAssetData = normalizedVariants.flatMap((variant) =>
        variant.editions
          .filter((edition) => !!edition.modelUrl)
          .map((edition) => ({
            assetId: edition.modelId ?? null,
            modelUrl: edition.modelUrl as string,
          }))
      );

      const mergedAssetData = [
        ...(settings.assetData ?? []),
        ...discoveredAssetData,
      ];
      const assetDataMap = new Map<
        string,
        { assetId: string | null; modelUrl: string }
      >();

      for (const entry of mergedAssetData) {
        if (!entry?.modelUrl) continue;
        const key = entry.assetId
          ? `id:${entry.assetId}`
          : `url:${entry.modelUrl}`;
        assetDataMap.set(key, {
          assetId: entry.assetId ?? null,
          modelUrl: entry.modelUrl,
        });
      }

      for (const id of settings.assetId ?? []) {
        const key = `id:${id}`;
        if (!assetDataMap.has(key) && (settings.modelUrl || modelFileUrl)) {
          assetDataMap.set(key, {
            assetId: id,
            modelUrl: (settings.modelUrl ?? modelFileUrl) as string,
          });
        }
      }

      const assetObjects =
        assetDataMap.size > 0 ? Array.from(assetDataMap.values()) : [];

      // Extract unique assetIds for linking to experience
      const assetIds = assetObjects
        .map((obj) => obj.assetId)
        .filter((id): id is string => !!id);
      const uniqueAssetIds = [...new Set(assetIds)];

      const configuratorPayload = {
        ...settings,
        modelFile: null,
        variants: normalizedVariants,
        assetData: assetObjects,
        modelFileUrl: modelFileUrl ?? null,
        modelUrl: settings.modelUrl ?? modelFileUrl ?? modelUrl ?? null,
      };
      objectUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));

      // Actually save to API
      if (!experienceId) {
        setToastStatus({
          visible: true,
          state: 'error',
          title: 'Save Failed',
          message: 'Experience ID not found',
        });
        setTimeout(() => {
          setToastStatus((prev) => ({ ...prev, visible: false }));
        }, 3000);
        return null;
      }

      setToastStatus({
        visible: true,
        state: 'loading',
        title: 'Saving...',
        message: 'Saving your configurator experience',
      });

      try {
        const draftData = JSON.stringify(configuratorPayload);
        await updateExp.mutateAsync({
          id: experienceId,
          data: {
            draftData,
            ...(uniqueAssetIds.length > 0 && { assetIds: uniqueAssetIds }),
            ...(pendingDomainSettings?.siteId &&
              pendingDomainSettings?.slug && {
                siteInfo: {
                  siteId: pendingDomainSettings.siteId,
                  slug: pendingDomainSettings.slug,
                },
              }),
          },
        });

        setInitData(JSON.parse(JSON.stringify(settings)) as VisualizerProps);
        settings.experienceId = experienceId;

        // Update initial domain settings after successful save
        if (pendingDomainSettings) {
          setInitialDomainSettings({ ...pendingDomainSettings });
        }

        setToastStatus({
          visible: true,
          state: 'success',
          title: 'Experience Saved',
          message: 'Your configurator experience has been saved',
        });
        setTimeout(() => {
          setToastStatus((prev) => ({ ...prev, visible: false }));
        }, 3000);

        return experienceId;
      } catch (err) {
        console.error('Error saving configurator experience:', err);
        setToastStatus({
          visible: true,
          state: 'error',
          title: 'Save Failed',
          message: 'An error occurred while saving',
        });
        setTimeout(() => {
          setToastStatus((prev) => ({ ...prev, visible: false }));
        }, 3000);
        return null;
      }
    }

    const files: File[] = [];
    const uploadTargets: Array<'customEnv' | 'brandLogo'> = [];

    const shouldUploadCustomEnv =
      !!settings.environment.customEnvUrl &&
      (settings.environment.customEnvUrl.startsWith('blob:') ||
        settings.environment.customEnvUrl.startsWith('data:'));

    if (shouldUploadCustomEnv && settings.environment.customEnvUrl) {
      const envName = settings.environment.customEnvName || 'custom-env';
      const fileName = envName.includes('.') ? envName : `${envName}.hdr`;
      const extension = fileName.split('.').pop()?.toLowerCase();

      let mimeType = 'image/vnd.radiance';
      if (extension === 'jpg' || extension === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (extension === 'exr') {
        mimeType = 'image/x-exr';
      }

      const customEnvFile = await blobUrlToFile(
        settings.environment.customEnvUrl,
        fileName,
        mimeType
      );
      if (customEnvFile) {
        files.push(customEnvFile);
        uploadTargets.push('customEnv');
      }
    }

    if (module === '3d_visualizer') {
      const shouldUploadBrandLogo = settings.brandLogo.logo instanceof File;
      if (shouldUploadBrandLogo && settings.brandLogo.logo) {
        files.push(settings.brandLogo.logo);
        uploadTargets.push('brandLogo');
      }
    }

    try {
      if (files.length > 0) {
        try {
          setToastStatus({
            visible: true,
            state: 'loading',
            title: 'Uploading Assets...',
            message: `Uploading ${files.length} file(s)`,
          });

          const formData = new FormData();
          files.forEach((file) => formData.append('images', file));

          const imageKeysToDelete: string[] = [];
          if (
            uploadTargets.includes('customEnv') &&
            initData?.environment?.customEnvUrl
          ) {
            const customEnvKey = toStorageKey(
              initData.environment.customEnvUrl
            );
            if (customEnvKey) {
              imageKeysToDelete.push(customEnvKey);
            }
          }
          if (
            uploadTargets.includes('brandLogo') &&
            initData?.brandLogo?.logo
          ) {
            const existingLogo = initData.brandLogo.logo;
            if (typeof existingLogo === 'string') {
              const logoKey = toStorageKey(existingLogo);
              if (logoKey) {
                imageKeysToDelete.push(logoKey);
              }
            }
          }

          if (imageKeysToDelete.length > 0) {
            try {
              await deleteExperienceImage.mutateAsync(
                Array.from(new Set(imageKeysToDelete))
              );
            } catch (deleteError) {
              // Log but don't block the save if delete fails
              console.warn('Failed to delete old images:', deleteError);
            }
          }

          try {
            const response = await uploadImages.mutateAsync(formData);

            console.log('Upload response:', response, uploadTargets);

            uploadTargets.forEach((target, index) => {
              console.log('Response: ', response);
              const uploadedValue = response?.data?.images[index];
              if (!uploadedValue) return;

              if (target === 'customEnv') {
                settings.environment.customEnvUrl = toAssetUrl(uploadedValue);
              }

              if (target === 'brandLogo') {
                settings.brandLogo.logo = toAssetUrl(
                  uploadedValue
                ) as unknown as File;

                console.log('Updated brand logo URL:', settings.brandLogo.logo);
              }
            });

            setToastStatus({
              visible: true,
              state: 'success',
              title: 'Assets Uploaded',
              message: 'Files uploaded successfully',
            });
            setTimeout(() => {
              setToastStatus((prev) => ({ ...prev, visible: false }));
            }, 3000);
          } catch (error) {
            console.error('Upload failed:', error);
            setToastStatus({
              visible: true,
              state: 'error',
              title: 'Upload Failed',
              message: 'Failed to upload assets',
            });
            setTimeout(() => {
              setToastStatus((prev) => ({ ...prev, visible: false }));
            }, 3000);
            return null;
          }
        } catch (err) {
          console.error(
            'Error processing custom environment or brand logo:',
            err
          );
          setToastStatus({
            visible: true,
            state: 'error',
            title: 'Upload Failed',
            message: 'Error processing files',
          });
          setTimeout(() => {
            setToastStatus((prev) => ({ ...prev, visible: false }));
          }, 3000);
          return null;
        }
      }

      setToastStatus({
        visible: true,
        state: 'loading',
        title: 'Saving Experience...',
        message: 'Saving your configuration',
      });

      const draftData = getDraftData();

      if (!experienceId) {
        throw new Error('Experience ID not found');
      }

      await updateExp.mutateAsync({
        id: experienceId,
        data: {
          draftData,
          ...(pendingDomainSettings?.siteId &&
            pendingDomainSettings?.slug && {
              siteInfo: {
                siteId: pendingDomainSettings.siteId,
                slug: pendingDomainSettings.slug,
              },
            }),
        },
      });

      setInitData(JSON.parse(JSON.stringify(settings)) as VisualizerProps);
      settings.experienceId = experienceId;

      // Update initial domain settings after successful save
      if (pendingDomainSettings) {
        setInitialDomainSettings({ ...pendingDomainSettings });
      }

      setToastStatus({
        visible: true,
        state: 'success',
        title: 'Experience Saved',
        message: 'Your experience has been saved successfully',
      });
      setTimeout(() => {
        setToastStatus((prev) => ({ ...prev, visible: false }));
      }, 3000);

      return experienceId;
    } catch (err) {
      console.error('Error saving experience:', err);
      setToastStatus({
        visible: true,
        state: 'error',
        title: 'Save Failed',
        message: 'An error occurred while saving',
      });
      setTimeout(() => {
        setToastStatus((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return null;
    }
  };

  const handlePublish = async () => {
    try {
      setToastStatus({
        visible: true,
        state: 'loading',
        title: 'Publishing...',
        message: 'Your experience is being published',
      });

      setPublishStatus('Publishing');
      const experienceId = await handleSave();

      if (!experienceId) {
        throw new Error('Experience ID not found after save');
      }

      setToastStatus({
        visible: true,
        state: 'loading',
        title: 'Publishing...',
        message: 'Finalizing your publication',
      });

      const publishResponse = await publishExperience.mutateAsync({
        id: experienceId,
        status: 'published',
      });

      if (publishResponse?.data?.publishedAt) {
        setLastPublishedAt(new Date(publishResponse.data.publishedAt));
      }

      // Update publishedData to match current settings after successful publish
      setPublishedData(JSON.parse(JSON.stringify(settings)) as VisualizerProps);

      // Update domain settings after successful publish
      if (pendingDomainSettings) {
        setInitialDomainSettings({ ...pendingDomainSettings });
        setPublishedDomainSettings({ ...pendingDomainSettings });
      }

      setPublishStatus('Published');
      if (wasInitiallyPublishedRef.current === false) {
        setShowFirstPublishModal(true);
        wasInitiallyPublishedRef.current = true;
      }

      setToastStatus({
        visible: true,
        state: 'success',
        title: 'Published Successfully',
        message: 'Your experience is now live',
      });
      setTimeout(() => {
        setToastStatus((prev) => ({ ...prev, visible: false }));
      }, 3000);

      setActiveOverlay('modal');
    } catch (error) {
      console.error('Publish failed:', error);
      setPublishStatus('Not Published');
      setToastStatus({
        visible: true,
        state: 'error',
        title: 'Publish Failed',
        message: 'Failed to publish experience',
      });
      setTimeout(() => {
        setToastStatus((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  useEffect(() => {
    if (activeOverlay !== 'options') return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is inside QR modal
      const qrModal = (target as HTMLElement).closest('[data-qr-modal="true"]');
      if (qrModal) return;

      if (
        publishOptionsRef.current &&
        !publishOptionsRef.current.contains(target)
      ) {
        setActiveOverlay('none');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeOverlay]);

  const [toastStatus, setToastStatus] = useState<{
    visible: boolean;
    state: 'loading' | 'success' | 'error';
    title: string;
    message: string;
  }>({
    visible: false,
    state: 'loading',
    title: 'Publishing...',
    message: 'Your experience is being published.',
  });
  const [showSaveWarnModal, setShowSaveWarnModal] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<
    (() => void) | null
  >(null);

  // Navigation blocking with useBlocker
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (hasUnsavedChanges || isEmptyConfiguratorExperience) &&
      currentLocation.pathname !== nextLocation.pathname
  );

  // Auto-delete empty configurator experience on navigation (no modal needed)
  useEffect(() => {
    if (
      blocker.state === 'blocked' &&
      isEmptyConfiguratorExperience &&
      !hasUnsavedChanges
    ) {
      // No unsaved changes, just empty configurator - delete and proceed without modal
      (async () => {
        if (experienceId) {
          try {
            await deleteExp.mutateAsync(experienceId);
            queryClient.invalidateQueries({ queryKey: ['get-experiences'] });
          } catch (err) {
            console.warn(
              'Failed to delete empty configurator experience:',
              err
            );
          }
        }
        blocker.proceed();
      })();
    }
  }, [
    blocker.state,
    isEmptyConfiguratorExperience,
    hasUnsavedChanges,
    experienceId,
  ]);

  // Handle browser refresh/close
  useBeforeUnload((event) => {
    if (!hasUnsavedChanges) return;
    event.preventDefault();
    event.returnValue = '';
  });

  // Show modal when navigation is blocked (only for unsaved changes, not empty configurator deletion)
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    // Don't show modal if it's just an empty configurator being auto-deleted
    if (isEmptyConfiguratorExperience && !hasUnsavedChanges) return;

    setPendingCloseAction(null);
    setShowSaveWarnModal(true);
  }, [blocker.state, isEmptyConfiguratorExperience, hasUnsavedChanges]);

  const handleDiscardChanges = async () => {
    // Delete empty configurator experience on discard
    if (isEmptyConfiguratorExperience && experienceId) {
      try {
        await deleteExp.mutateAsync(experienceId);
        queryClient.invalidateQueries({ queryKey: ['get-experiences'] });
      } catch (err) {
        console.warn('Failed to delete empty configurator experience:', err);
      }
    }

    setShowSaveWarnModal(false);

    if (blocker.state === 'blocked') {
      blocker.proceed();
      return;
    }

    pendingCloseAction?.();
    setPendingCloseAction(null);
  };

  const handleStayOnPage = () => {
    setShowSaveWarnModal(false);

    if (blocker.state === 'blocked') {
      blocker.reset();
    }

    setPendingCloseAction(null);
  };

  const handleSaveAndExit = async () => {
    const savedId = await handleSave();

    if (!savedId) {
      // Save failed, stay on page
      return;
    }

    // Invalidate the experience queries so fresh data is fetched next time
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['get-experience-by-id', savedId],
      }),
      queryClient.invalidateQueries({
        queryKey: ['get-experiences'],
      }),
    ]);

    setShowSaveWarnModal(false);

    if (blocker.state === 'blocked') {
      blocker.proceed();
      return;
    }

    pendingCloseAction?.();
    setPendingCloseAction(null);
  };

  // const handleCloseWithWarning = (closeAction: () => void) => {
  //   if (!hasUnsavedChanges) {
  //     closeAction();
  //     return;
  //   }

  //   setPendingCloseAction(() => closeAction);
  //   setShowSaveWarnModal(true);
  // };

  return (
    <>
      <Header
        section={MODULE_MAP[module] as THeaderVariant}
        onIconClick={() => {
          if (hasUnsavedChanges) {
            setActiveOverlay('save-warn');
          }
        }}
        buttons={{
          settings: {
            disabled: !experienceId,
            onClick: handleNavigateToSettings,
          },
          publish: {
            disabled: !experienceId,
            modalContent: activeOverlay === 'options' && (
              <PublishMenuOptions
                publishOptionsRef={publishOptionsRef}
                publishStatus={publishStatus}
                publishChanges={publishChanges}
                canPublish={canPublish}
                lastPublishedAt={lastPublishedAt}
                getRelativeTime={getRelativePublishTime}
                onClose={() => setActiveOverlay('none')}
                onOpenModal={() => setActiveOverlay('modal')}
                handlePublish={() => {
                  handlePublish();
                }}
                experienceData={getExperienceQuery.data?.data}
                onNavigate={navigate}
                onDomainSettingsChange={(settings) => {
                  setPendingDomainSettings(settings);
                }}
                onShowToast={(title, state = 'success') => {
                  setToastStatus({
                    visible: true,
                    state,
                    title,
                    message: '',
                  });
                  setTimeout(() => {
                    setToastStatus((prev) => ({ ...prev, visible: false }));
                  }, 3000);
                }}
              />
            ),

            onClick: () => setActiveOverlay('options'),
          },
          save: {
            onClick: () => {
              handleSave();
            },
            disabled: status !== 'ready' || !hasUnsavedChanges,
          },
        }}
      />
      <div className="mb-4 w-full border-t border-gray-200" />

      <div>
        {showFirstPublishModal && (
          <>{/* <PublishModal src="/assets/images/testProduct.webp" /> */}</>
        )}
        {activeOverlay === 'save-warn' && (
          <SaveWarnModal
            onClose={() => setActiveOverlay('none')}
            onDiscardChanges={async () => {
              if (isEmptyConfiguratorExperience && experienceId) {
                try {
                  await deleteExp.mutateAsync(experienceId);
                  queryClient.invalidateQueries({
                    queryKey: ['get-experiences'],
                  });
                } catch (err) {
                  console.warn(
                    'Failed to delete empty configurator experience:',
                    err
                  );
                }
              }
              navigate('/dashboard');
            }}
            onSaveExit={async () => {
              await handleSave();
              navigate('/dashboard');
            }}
          />
        )}
      </div>

      {/* Navigation blocking save warn modal */}
      <TryOnSaveWarnModal
        open={showSaveWarnModal}
        onClose={handleStayOnPage}
        onDiscardChanges={handleDiscardChanges}
        onSaveAndExit={handleSaveAndExit}
      />
      {toastStatus.visible && (
        <ToastCard
          type={toastStatus.state}
          title={toastStatus.title}
          description={toastStatus.message}
          autoClose={false}
        />
      )}

      {/* {activeOverlay === 'modal' && <PublishModal src='/assets/images/testProduct.webp' />} */}

      {activeOverlay === 'save-warn' && (
        <SaveWarnModal onClose={() => setActiveOverlay('none')} />
      )}
    </>
  );
};

export default ProductHeader;
