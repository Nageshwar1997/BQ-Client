import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import {
  deleteGeneratedMediaById,
  linkGeneratedMediaToProduct,
  listGeneratedMedia,
  unlinkGeneratedMediaFromProduct,
  type GeneratedMediaItem,
} from '../../../services/ai-creative-studio';
import { MoreOptionsMenu } from '../../../components/MoreOptionsMenu';
import { ImageWithFallback } from '../context/ImageWithFallback';
import { ImagePreview } from './ImagePreview';
import ProductAssetAssignmentModal from '../../../components/ProductAssetAssignmentModal';
import type { ProductData } from '../../../components/ProductListItem';
import { assetOption, experienceOptions } from '../../3d-asset-library';
import { ExperienceFilterIcon } from '../../../icons';
import { AICreativeStudioNavbar } from './ChatInterface';

type LibraryItem = {
  id: string;
  url: string;
  type: 'image' | 'video';
  outputKey: string;
  generatedMediaId: string;
  linkedProductId: string | null;
  linkedProductName: string | null;
};

type LibraryGroup = {
  id: string;
  date: string;
  items: LibraryItem[];
};

function PlayIcon() {
  return (
    <div className="flex size-[48px] items-center justify-center rounded-full bg-white shadow-sm">
      <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.6667 10.2679C20 11.0377 20 12.9623 18.6667 13.7321L4.00001 22.2009C2.66668 22.9707 1.00001 22.0085 1.00001 20.4689L1.00001 3.53109C1.00001 1.99149 2.66668 1.02924 4.00001 1.79904L18.6667 10.2679Z"
          fill="#18181A"
        />
      </svg>
    </div>
  );
}

const formatDate = (value: Date): string =>
  value.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });

const toLibraryGroups = (items: GeneratedMediaItem[]): LibraryGroup[] => {
  const dateMap = new Map<string, LibraryGroup>();

  items
    .filter((item) => item.outputs.length > 0)
    .forEach((item) => {
      const date = formatDate(item.generatedAt ?? item.createdAt);

      const mappedItems = item.outputs.map((output, index) => ({
        id: `${item.id}-${index + 1}`,
        url: output.url,
        type: item.mediaType,
        outputKey: output.key,
        generatedMediaId: item.id,
        linkedProductId: item.linkedProductId,
        linkedProductName: item.linkedProductName,
      }));

      const existing = dateMap.get(date);
      if (!existing) {
        dateMap.set(date, {
          id: date,
          date,
          items: mappedItems,
        });
        return;
      }

      existing.items.push(...mappedItems);
    });

  return Array.from(dateMap.values());
};

export function LibraryView() {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [groups, setGroups] = useState<LibraryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLinkingProduct, setIsLinkingProduct] = useState(false);
  const [pendingAddItem, setPendingAddItem] = useState<LibraryItem | null>(
    null
  );
  const [isAddToProductModalOpen, setIsAddToProductModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchLibrary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listGeneratedMedia({
          page: 1,
          limit: 100,
          status: 'completed',
        });

        if (!mounted) return;
        setGroups(toLibraryGroups(response.items));
      } catch (loadError) {
        if (!mounted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load generated media library.'
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchLibrary();

    return () => {
      mounted = false;
    };
  }, []);

  const allItems = useMemo(() => {
    return groups.flatMap((group) => group.items);
  }, [groups]);

  const handleUnlinkCurrentItem = useCallback(async (item: LibraryItem) => {
    if (!item.linkedProductId) return;

    setIsUnlinking(true);
    setError(null);
    try {
      await unlinkGeneratedMediaFromProduct({
        generatedMediaId: item.generatedMediaId,
        outputKey: item.outputKey,
      });

      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          items: group.items.map((groupItem) =>
            groupItem.generatedMediaId === item.generatedMediaId &&
            groupItem.outputKey === item.outputKey
              ? {
                  ...groupItem,
                  linkedProductId: null,
                  linkedProductName: null,
                }
              : groupItem
          ),
        }))
      );
    } catch (unlinkError) {
      setError(
        unlinkError instanceof Error
          ? unlinkError.message
          : 'Failed to unlink product.'
      );
    } finally {
      setIsUnlinking(false);
    }
  }, []);

  const handleDeleteCurrentItem = useCallback(async (item: LibraryItem) => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteGeneratedMediaById(item.generatedMediaId);

      setGroups((prev) =>
        prev
          .map((group) => ({
            ...group,
            items: group.items.filter(
              (groupItem) =>
                groupItem.generatedMediaId !== item.generatedMediaId
            ),
          }))
          .filter((group) => group.items.length > 0)
      );

      setPreviewIndex(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Failed to delete generated media.'
      );
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const handleThumbnailClick = (itemId: string) => {
    const index = allItems.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      setPreviewIndex(index);
    }
  };

  const handleDownloadItem = useCallback(async (item: LibraryItem) => {
    const extension = item.type === 'video' ? 'mp4' : 'png';
    const fileName = `generated-${item.id}.${extension}`;

    try {
      const response = await fetch(item.url);
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      const anchor = document.createElement('a');
      anchor.href = item.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  }, []);

  const handleOpenAddToProduct = useCallback((item: LibraryItem) => {
    if (!item.generatedMediaId || !item.outputKey) {
      setError('Unable to link this output to a product.');
      return;
    }

    setError(null);
    setPendingAddItem(item);
    setIsAddToProductModalOpen(true);
  }, []);

  const handleCloseAddToProduct = useCallback(() => {
    if (isLinkingProduct) return;
    setIsAddToProductModalOpen(false);
    setPendingAddItem(null);
  }, [isLinkingProduct]);

  const handleSelectProductForAddToProduct = useCallback(
    async (product: ProductData) => {
      if (!pendingAddItem || isLinkingProduct) return false;

      const generatedMediaId = pendingAddItem.generatedMediaId;
      const outputKey = pendingAddItem.outputKey;
      if (!generatedMediaId || !outputKey) {
        setError('Unable to link this output to a product.');
        return false;
      }

      setIsLinkingProduct(true);
      setError(null);
      try {
        await linkGeneratedMediaToProduct({
          generatedMediaId,
          outputKey,
          productId: product.id,
        });

        setGroups((prev) =>
          prev.map((group) => ({
            ...group,
            items: group.items.map((groupItem) =>
              groupItem.generatedMediaId === generatedMediaId &&
              groupItem.outputKey === outputKey
                ? {
                    ...groupItem,
                    linkedProductId: product.id,
                    linkedProductName: product.name || 'Linked Product',
                  }
                : groupItem
            ),
          }))
        );

        setPendingAddItem(null);
        setIsAddToProductModalOpen(false);
        return true;
      } catch (linkError) {
        setError(
          linkError instanceof Error
            ? linkError.message
            : 'Failed to link media to product.'
        );
        return false;
      } finally {
        setIsLinkingProduct(false);
      }
    },
    [isLinkingProduct, pendingAddItem]
  );

  return (
    <div className="font-metropolis flex size-full flex-col overflow-y-auto bg-white">
      <AICreativeStudioNavbar
        title="AI Creative Studio"
        description="Generated media library"
      />

      <main className="flex flex-col gap-[48px] pt-[24px] pr-[48px] pb-[64px] pl-[32px]">
        {isLoading && (
          <p className="text-[14px] text-[#797A80]">Loading library...</p>
        )}

        {!isLoading && error && (
          <p className="text-[14px] text-[#C81E1E]">{error}</p>
        )}

        {!isLoading && !error && groups.length === 0 && (
          <p className="text-[14px] text-[#797A80]">
            No generated media yet. Create an image or video from chat to see it
            here.
          </p>
        )}

        {!isLoading &&
          !error &&
          groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#18181A]">
                  {group.date}
                </h2>
              </div>
              <div className="flex flex-wrap gap-1">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleThumbnailClick(item.id)}
                    className="group relative size-[160px] cursor-pointer overflow-hidden rounded-[20px] border border-[#E2E3EA]"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <MoreOptionsMenu
                        triggerIcon="solar:menu-dots-bold"
                        position="bottom-right"
                        triggerClassName="bg-white/90 hover:bg-white"
                        menuItems={[
                          {
                            label: 'Download',
                            icon: 'solar:download-minimalistic-linear',
                            onClick: () => {
                              void handleDownloadItem(item);
                            },
                          },
                          {
                            label: 'Delete',
                            icon: 'ic:twotone-delete-outline',
                            variant: 'danger',
                            showDividerAbove: true,
                            onClick: () => {
                              void handleDeleteCurrentItem(item);
                            },
                          },
                        ]}
                      />
                    </div>
                    {item.type === 'video' ? (
                      <video
                        src={item.url}
                        className="size-full object-cover transition-transform group-hover:scale-105"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <ImageWithFallback
                        src={item.url}
                        alt="Generated media"
                        className="size-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <PlayIcon />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 rounded-[20px] border border-black/5" />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </main>

      {previewIndex !== null && (
        <ImagePreview
          items={allItems}
          initialIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onUnlink={handleUnlinkCurrentItem}
          onAddToProduct={handleOpenAddToProduct}
          onDelete={handleDeleteCurrentItem}
          isUnlinking={isUnlinking}
          isDeleting={isDeleting}
        />
      )}

      <ProductAssetAssignmentModal
        open={isAddToProductModalOpen}
        onClose={handleCloseAddToProduct}
        products={[]}
        selectionMode="product-only"
        onProductSelect={handleSelectProductForAddToProduct}
        productFilters={[
          {
            label: 'Experiences',
            icon: <ExperienceFilterIcon className="size-4 text-[#18181A]" />,
            options: experienceOptions,
          },
          {
            label: 'Assets',
            icon: <Icon icon="solar:box-minimalistic-linear" />,
            options: assetOption,
          },
        ]}
      />
    </div>
  );
}
