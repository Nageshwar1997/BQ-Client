import { useNavigate, useParams } from 'react-router';
import TopHeader from '../../../components/TopHeader';
import Create3DViewerBanner from './components/Create3DViewerBanner';
import CreateExperiencesControls from './components/CreateExperiencesControls';
import CreateFooter from './components/CreateFooter';
import { ASSET_BASE_URL, PUBLISH_BASE_URL } from '../../../env';
import CreateExperiencesGrid, {
  type CreateExperienceItem,
} from './components/CreateExperiencesGrid';
import {
  type CreateBannerVariant,
  createBannerVariantMap,
} from './components/createBannerVariants';

import { useGetExperiences } from '../../../services/experience-service';

import {
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  //   useUpdateExperienceStatus,
  //   useUpdateExperience,
} from '../../../services/experience-services';
import { useGet3DAssets } from '../../../services/assets-service';
import Loader from '../../../components/Loader';
// import RenameModal from '../../../components/Overlay/RenameModal';
import ToastCard from '../../../components/AlertCards/ToastCard';
import { useEffect, useState, useMemo } from 'react';
import ProductResultModal from '../../virtual-tryon/component/ProductResultModal';
import RenameModal from '../../../components/Overlay/RenameModal';
import { getDefaultPayload, handleApiError } from '../../../lib/utils';
import { handleListExperiences } from '../../../services/api';

const PENDING_TRYON_CLEANUP_KEY = 'onboarding:pending-tryon-cleanup';

const variantToTypeMap: Record<string, string> = {
  '3d-visualizer': '3d_visualizer',
  'ar-experience': 'ar_experience',
  '3d-configurator': '3d_configurator',
  'virtual-try-on': 'beauty_tryon',
  'immersive-store': 'immersive_store',
};

// Map URL slugs to CreateBannerVariant values
const urlSlugToVariantMap: Record<string, CreateBannerVariant> = {
  '3d-visualizer': '3d-visualizer',
  'ar-experience': 'ar-experience',
  'virtual-try-on': 'virtual-try-on',
  '3d-configurator': '3d-configurator',
  configurator: '3d-configurator',
  'immersive-store': 'immersive-store',
  'ai-content': 'ai-content',
};

const BannerDashboard = () => {
  const navigate = useNavigate();
  const { bannerId } = useParams<{ bannerId: string }>();
  const createExperience = useCreateExperience();
  const deleteExperience = useDeleteExperience();

  const activeVariant: CreateBannerVariant =
    urlSlugToVariantMap[bannerId ?? ''] || '3d-visualizer';

  const isAIContent = activeVariant === 'ai-content';

  const experienceQuery = useGetExperiences({
    limit: 10,
    type: variantToTypeMap[activeVariant],
  });

  const assetsQuery = useGet3DAssets({
    assetType: 'generated',
  });

  const handleCreateConfigExp = () => {
    const payLoad = getDefaultPayload('', '', '', '3d_configurator');
    createExperience.mutate(payLoad, {
      onSuccess: (response) => {
        const experienceId = response?.data?._id || response?.data?.id;
        if (experienceId) {
          navigate(`/configurator/${experienceId}`);
        }
      },
      onError: (error) => {
        const description = handleApiError({
          error: error as Error,
          fallback: 'There was an error creating the configurator experience.',
        });
        showToast('error', 'Failed to Create Experience', description);
        console.error('Create experience error:', error);
      },
    });
  };

  const queryResult = isAIContent ? assetsQuery : experienceQuery;
  const isLoading = queryResult.isLoading;

  useEffect(() => {
    if (
      !['virtual-try-on', 'ar-experience'].includes(activeVariant) ||
      typeof sessionStorage === 'undefined'
    ) {
      return;
    }

    const rawCleanup = sessionStorage.getItem(PENDING_TRYON_CLEANUP_KEY);
    if (!rawCleanup?.trim()) return;

    let isActive = true;

    const runPendingCleanup = async () => {
      try {
        const parsed = JSON.parse(rawCleanup) as {
          experienceIds?: string[];
          titles?: string[];
          productId?: string | null;
        };
        const experienceIds = Array.isArray(parsed.experienceIds)
          ? parsed.experienceIds.filter(
              (value): value is string =>
                typeof value === 'string' && value.trim().length > 0
            )
          : [];
        const titles = Array.isArray(parsed.titles)
          ? parsed.titles.filter(
              (value): value is string =>
                typeof value === 'string' && value.trim().length > 0
            )
          : [];
        const productId =
          typeof parsed.productId === 'string' && parsed.productId.trim()
            ? parsed.productId
            : null;

        const [
          beautyResponse,
          fashionResponse,
          arDraftResponse,
          arPublishedResponse,
        ] = await Promise.all([
          handleListExperiences({
            page: 1,
            limit: 100,
            status: 'draft',
            type: 'beauty_tryon',
          }),
          handleListExperiences({
            page: 1,
            limit: 100,
            status: 'draft',
            type: 'fashion_tryon',
          }),
          handleListExperiences({
            page: 1,
            limit: 100,
            status: 'draft',
            type: 'ar_experience',
          }),
          handleListExperiences({
            page: 1,
            limit: 100,
            status: 'published',
            type: 'ar_experience',
          }),
        ]);

        const combinedResults = [
          ...(Array.isArray(beautyResponse?.data) ? beautyResponse.data : []),
          ...(Array.isArray(fashionResponse?.data) ? fashionResponse.data : []),
          ...(Array.isArray(arDraftResponse?.data) ? arDraftResponse.data : []),
          ...(Array.isArray(arPublishedResponse?.data)
            ? arPublishedResponse.data
            : []),
        ];

        const idsToDelete = Array.from(
          new Set([
            ...experienceIds,
            ...combinedResults
              .filter((item: any) => {
                const title =
                  typeof item?.title === 'string' ? item.title.trim() : '';
                const itemProductId =
                  typeof item?.productId === 'string'
                    ? item.productId.trim()
                    : '';
                return (
                  titles.includes(title) ||
                  (productId && itemProductId === productId)
                );
              })
              .map((item: any) => item?._id)
              .filter(
                (value: unknown): value is string =>
                  typeof value === 'string' && value.trim().length > 0
              ),
          ])
        );

        await Promise.allSettled(
          idsToDelete.map((id) => deleteExperience.mutateAsync(id))
        );
      } catch {
        // Ignore cleanup failures here; we remove the key only on success path below.
      } finally {
        if (!isActive) return;
        sessionStorage.removeItem(PENDING_TRYON_CLEANUP_KEY);
        void experienceQuery.refetch();
      }
    };

    void runPendingCleanup();

    return () => {
      isActive = false;
    };
  }, [activeVariant, deleteExperience, experienceQuery]);

  const experienceId = !isAIContent ? queryResult.data?.data?.[0]?._id : null;
  const activeConfig = useMemo(
    () => ({
      ...createBannerVariantMap[activeVariant],
      experienceId,
    }),
    [activeVariant, experienceId]
  );
  const handleMainCtaClick = () => {
    if (activeConfig.routePath === '/configurator') {
      handleCreateConfigExp();
      return;
    }
    navigate(activeConfig.routePath);
  };

  const [activeFilter, setActiveFilter] = useState<
    'all' | 'published' | 'drafts'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAction, setActiveAction] = useState<'sort' | 'date'>('date');
  const [dateDirection, setDateDirection] = useState<'asc' | 'desc'>('desc');
  const [alphaDirection, setAlphaDirection] = useState<'asc' | 'desc'>('asc');

  const rawExperiences: CreateExperienceItem[] = (
    queryResult.data?.data || []
  ).map((item: any) => {
    return {
      id: item._id,
      siteInfo: item.siteInfo,
      status:
        item.status?.toLowerCase() === 'published' ? 'published' : 'draft',
      title: item.title,
      experienceType: item.type,
      updatedAt: (() => {
        const date = new Date(item.updatedAt);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${month}/${day}`;
      })(),
      updatedAtRaw: new Date(item.updatedAt).getTime(),
      totalViews: item.views?.toString() || '0',
      imageUrl: item.assets?.[0]?.spriteKey
        ? new URL(item.assets[0].spriteKey, ASSET_BASE_URL).toString()
        : '',
    };
  });

  const experiences = useMemo(() => {
    let filtered = [...rawExperiences];

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(
        (exp) =>
          exp.status === (activeFilter === 'published' ? 'published' : 'draft')
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((exp) =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (activeAction === 'date') {
      filtered.sort((a, b) => {
        const timeA = (a as any).updatedAtRaw || 0;
        const timeB = (b as any).updatedAtRaw || 0;
        return dateDirection === 'desc' ? timeB - timeA : timeA - timeB;
      });
    } else {
      filtered.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (alphaDirection === 'asc') {
          return titleA.localeCompare(titleB);
        } else {
          return titleB.localeCompare(titleA);
        }
      });
    }

    return filtered;
  }, [
    rawExperiences,
    activeFilter,
    searchTerm,
    activeAction,
    dateDirection,
    alphaDirection,
  ]);

  const [activeModal, setActiveModal] = useState<
    'delete' | 'unpublish' | 'rename' | 'none'
  >('none');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    description?: string;
  }>({
    open: false,
    type: 'success',
    title: '',
  });

  const showToast = (
    type: 'success' | 'error',
    title: string,
    description?: string
  ) => {
    setToast({ open: true, type, title, description });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 5000);
  };

  //   const updateStatusMutation = useUpdateExperienceStatus();
  const updateExperienceMutation = useUpdateExperience();
  //   const deleteMutation = useDeleteExperience();

  //   const handlePublish = (id: string) => {
  //     updateStatusMutation.mutate(
  //       { id, status: 'published' },
  //       {
  //         onSuccess: () => {
  //           experienceQuery.refetch();
  //           showToast(
  //             'success',
  //             'Experience Published',
  //             'Your experience is now live.'
  //           );
  //         },
  //       }
  //     );
  //   };

  const handleUnpublish = (id: string, experienceType: string) => {
    if (activeConfig.routePath === '/virtual-try-on') {
      navigate(`/${experienceType}/${id}/settings`);
    } else {
      navigate(`/${activeConfig.routePath}/${id}/settings`);
    }
  };

  // const handlePublish = (id: string) => {
  //   navigate(`${activeConfig.routePath}/${id}/settings`);
  // };

  // const confirmUnpublish = () => {
  //   if (!selectedId) return;
  //   updateStatusMutation.mutate(
  //     { id: selectedId, status: 'draft' },
  //     {
  //       onSuccess: () => {
  //         experienceQuery.refetch();
  //         showToast(
  //           'success',
  //           'Experience Unpublished',
  //           'Your experience has been moved to drafts.'
  //         );
  //       },
  //     }
  //   );
  // };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setActiveModal('delete');
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    deleteExperience.mutate(selectedId, {
      onSuccess: () => {
        experienceQuery.refetch();
        showToast(
          'success',
          'Experience Deleted',
          'The experience has been removed successfully.'
        );
        setActiveModal('none');
      },
    });
  };

  const handleRename = (id: string, currentTitle: string) => {
    setSelectedId(id);
    setSelectedTitle(currentTitle);
    setActiveModal('rename');
  };

  const confirmRename = (newTitle: string) => {
    if (!selectedId) return;
    updateExperienceMutation.mutate(
      {
        id: selectedId,
        data: { title: newTitle },
      },
      {
        onSuccess: () => {
          experienceQuery.refetch();
          showToast(
            'success',
            'Experience Renamed',
            `Renamed to "${newTitle}"`
          );
          setActiveModal('none');
        },
        onError: () => {
          showToast(
            'error',
            'Rename Failed',
            'There was an error renaming the experience. Please try again.'
          );
        },
      }
    );
  };

  // TODO: update
  const handlePreview = (siteInfo: any, expType: string) => {
    const previewLink = `https://${siteInfo.subdomain}.${PUBLISH_BASE_URL}/${siteInfo.slug}/${expType}`;
    window.open(previewLink, '_blank');
  };

  const handleCopyLink = (siteInfo: any, expType: string) => {
    const previewLink = `https://${siteInfo.subdomain}.${PUBLISH_BASE_URL}/${siteInfo.slug}/${expType}`;
    navigator.clipboard.writeText(previewLink);
    showToast('success', 'Link Copied');
  };

  // const handleCopyEmbedCode = (siteInfo: any) => {
  //   const previewLink = `http://${siteInfo.subdomain}.${PUBLISH_BASE_URL}/${siteInfo.slug}/3d-visualizer`;
  //   const embedCode = `<iframe
  //       src="${previewLink}"
  //       width="100%"
  //       height="600"
  //       style="outline: none; border: none;"
  //     ></iframe>`;
  //   copyToClipboard(embedCode);
  //   showToast(
  //     'success',
  //     'Embed Code Copied',
  //     'The experience embed code has been copied to your clipboard.'
  //   );
  // };

  if (isLoading) {
    const loaderVariantMap: Record<string, string> = {
      '3d-configurator': 'configurator',
      'immersive-store': 'storefront',
      'ai-content': 'versa-ai',
    };

    return (
      <div className="flex h-[calc(100vh-88px)] w-full items-center justify-center">
        <Loader
          section={(loaderVariantMap[activeVariant] || activeVariant) as any}
        />
      </div>
    );
  }

  return (
    <div className="size-full overflow-y-auto">
      <TopHeader />
      <div className="px-8 pt-3 pb-12">
        <div className="mx-auto flex w-full max-w-[min(100%,calc((100vh-88px)*16/9))] flex-col">
          <Create3DViewerBanner
            variant={activeVariant}
            onButtonClick={handleMainCtaClick}
          />
          {rawExperiences.length > 0 && (
            <CreateExperiencesControls
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeAction={activeAction}
              onActionChange={setActiveAction}
              dateDirection={dateDirection}
              onDateDirectionChange={setDateDirection}
              alphaDirection={alphaDirection}
              onAlphaDirectionChange={setAlphaDirection}
              allFilterIcon={activeConfig.heroIcon}
            />
          )}
          <CreateExperiencesGrid
            experiences={experiences}
            emptyStateTitle={activeConfig.emptyStateTitle}
            emptyStateDescription={activeConfig.emptyStateDescription}
            emptyStateButtonText={activeConfig.buttonText}
            emptyStateButtonIcon={activeConfig.buttonIcon}
            onEmptyStateButtonClick={handleMainCtaClick}
            // onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            onDelete={handleDelete}
            onRename={(id) => {
              const exp = experiences.find((e) => e.id === id);
              handleRename(id, exp?.title || '');
            }}
            onPreview={handlePreview}
            onCopyLink={handleCopyLink}
            onEdit={(id) => {
              navigate(`${activeConfig.routePath}/${id}`);
            }}
          />

          {activeModal === 'delete' && (
            // @ts-expect-error
            <ProductResultModal
              open={activeModal === 'delete'}
              onClose={() => {
                setActiveModal('none');
              }}
              type="warning"
              title="Are you sure you want to delete this Experience?"
              description="Deleting the experience stop any published experiences from working"
              // product={{
              //   title: activeConfig.title,
              //   description: activeConfig.description,
              //   price: activeConfig.price,
              //   image: activeConfig.image,
              // }}
              showLeftSection={false}
              buttons={[
                {
                  content: 'Cancel',
                  variant: 'secondary',
                  onClick: () => setActiveModal('none'),
                  // disabled: deleteProductCMSMutation.isPending,
                },
                {
                  content: 'Delete',
                  // ? 'Deleting...'
                  // : 'Delete',
                  variant: 'outline',
                  className: 'w-full text-ui-error border-ui-error',
                  onClick: confirmDelete,
                  // disabled: deleteProductCMSMutation.isPending,
                },
              ]}
            />
          )}

          {activeModal === 'rename' && (
            <RenameModal
              open={true}
              initialValue={selectedTitle}
              onClose={() => setActiveModal('none')}
              onConfirm={confirmRename}
            />
          )}

          {toast.open && (
            <ToastCard
              key={Date.now()} // Force remount to trigger animation
              type={toast.type}
              title={toast.title}
              description={toast.description}
              autoClose={true}
            />
          )}
          {experiences.length > 0 && (
            <CreateFooter
              title={activeConfig.title}
              subtitle={activeConfig.subtitle}
              buttonText={activeConfig.buttonText}
              buttonIcon={activeConfig.buttonIcon}
              buttonBgColor={activeConfig.buttonBgColor}
              onButtonClick={handleMainCtaClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerDashboard;
