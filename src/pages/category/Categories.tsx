import { CATEGORY_LEVELS_MAP, SORT_MAP } from '@beautinique/frontend-constants';
import type { TSort } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import {
  type ComponentProps,
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import LoadingText from '@/components/layout/loaders/LoadingText';
import ConfirmModal from '@/components/layout/modals/ConfirmModal';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Badge from '@/components/ui/Badge';
import { EMPTY_ARRAY, QUERY_PARAMS_KEY_MAP } from '@/constants/common.constants';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useDeleteCategory,
  useGetCategoriesByParentLevel,
} from '@/services/product-service/category.service.query';
import type { TCategory } from '@/types/api.type';
import type { ICatModal, TCatTable } from '@/types/component.type';
import { getFilteredAndSortedCats } from '@/utils/api.util';

import CategoryActions from './children/CategoryActions';
import CategoryInfo from './children/CategoryInfo';
import CategoryModal from './children/CategoryModal';
import CategoryTableTopInfo from './children/CategoryTableTopInfo';

const TH_TITLES = ['Category', 'Level', 'Parent', 'Actions'] as const;

const q_cat_keys = QUERY_PARAMS_KEY_MAP.category;

const ApiStatusRow = (
  props: Record<'haveLength' | 'isError' | 'isLoading', boolean> & Pick<TCategory, 'level'>,
) => {
  const { isError, isLoading, haveLength, level } = props;

  return (
    <TableRow className="border-y-primary/5 border-y first:border-t-0 last:border-b-0">
      <TableRowCell colSpan={4}>
        {isLoading ? (
          <LoadingText text="Loading..." className="mx-auto my-2" />
        ) : (
          <ApiStatus
            className="min-h-0!"
            status={isError ? 'error' : 'empty'}
            title={
              isError
                ? 'Failed to load categories'
                : haveLength
                  ? 'No matching categories found'
                  : 'No categories available'
            }
            description={
              isError
                ? `Something went wrong while fetching level ${String(level)} categories. Please try again.`
                : haveLength
                  ? 'Try searching with a different keyword or clear the search.'
                  : `No level ${String(level)} categories have been added under this category yet.`
            }
          />
        )}
      </TableRowCell>
    </TableRow>
  );
};

const CategoryHead = ({ level }: { level: TCategory['level'] }) => {
  const { queryParams, removeParams, setParams } = useQueryParams();
  const sortKey =
    `sort_${String(level)}` as (typeof q_cat_keys.level)[keyof typeof q_cat_keys.level]['sort'];

  const handleSort = () => {
    if (queryParams[sortKey] === SORT_MAP.asc) {
      setParams({ [sortKey]: SORT_MAP.desc });
    } else if (queryParams[sortKey] === SORT_MAP.desc) {
      removeParams([sortKey]);
    } else {
      setParams({ [sortKey]: SORT_MAP.asc });
    }
  };
  return (
    <TableHead>
      <TableRow>
        {TH_TITLES.map((title) => (
          <TableHeadCell className="first:text-left last:text-right" key={title}>
            {title === 'Category' ? (
              <button
                type="button"
                onClick={handleSort}
                className="hover:text-primary/80 group flex cursor-pointer items-center gap-2"
              >
                {title}
                <Icon
                  icon={
                    queryParams[sortKey] === SORT_MAP.asc
                      ? 'solar:arrow-up-linear'
                      : queryParams[sortKey] === SORT_MAP.desc
                        ? 'solar:arrow-down-linear'
                        : 'solar:sort-linear'
                  }
                  className="group-hover:text-primary/80 size-4"
                />
              </button>
            ) : (
              title
            )}
          </TableHeadCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const CategoryRow = (props: TCatTable & ComponentProps<'tr'>) => {
  const { category, mainCatId, onDelete, onEdit, className = '', ...trProps } = props;

  return (
    <TableRow
      tabIndex={0}
      {...trProps}
      className={`border-y-primary/5 border-y first:border-t-0 last:border-b-0 ${className}`}
    >
      <TableRowCell className="text-left">
        <CategoryInfo category={category} />
      </TableRowCell>
      <TableRowCell>
        <Badge content={`Level ${String(category.level)}`} />
      </TableRowCell>
      <TableRowCell className="text-primary/65 uppercase">
        {'parent' in category ? category.parent : 'N/A'}
      </TableRowCell>
      <TableRowCell className="text-right">
        <CategoryActions
          category={category}
          mainCatId={mainCatId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </TableRowCell>
    </TableRow>
  );
};

const L3Table = ({ category: parentCat, mainCatId, onDelete, onEdit }: TCatTable) => {
  const { queryParams } = useQueryParams();
  const search = useDeferredValue(queryParams[q_cat_keys.level.l3.search] ?? '');
  const sort = useDeferredValue(queryParams[q_cat_keys.level.l3.sort]) as TSort | undefined;

  const {
    data: categories = EMPTY_ARRAY,
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L3,
    parent: parentCat._id,
  });
  const filteredCats = useMemo(
    () => getFilteredAndSortedCats(categories, search, sort),
    [categories, search, sort],
  );

  return (
    <div className="border-primary/10 bg-primary/2 rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${String(filteredCats.length)}/${String(categories.length)} items`}
        level={CATEGORY_LEVELS_MAP.L3}
        name={parentCat.name}
      />
      <Table>
        <CategoryHead level={CATEGORY_LEVELS_MAP.L3} />
        <TableBody>
          {filteredCats.length ? (
            filteredCats.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                mainCatId={mainCatId}
                onDelete={onDelete}
                onEdit={onEdit}
                className="hover:bg-primary/1"
              />
            ))
          ) : (
            <ApiStatusRow
              haveLength={!!categories.length}
              isError={isError}
              isLoading={isLoading}
              level={CATEGORY_LEVELS_MAP.L3}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const L2Table = ({ category: parentCat, onDelete, onEdit }: TCatTable) => {
  const { queryParams } = useQueryParams();
  const search = useDeferredValue(queryParams[q_cat_keys.level.l2.search] ?? '');
  const sort = useDeferredValue(queryParams[q_cat_keys.level.l2.sort]) as TSort | undefined;
  const [selectedId, setSelectedId] = useState('');
  const [prevParentCatId, setPrevParentCatId] = useState(parentCat._id);

  if (parentCat._id !== prevParentCatId) {
    setPrevParentCatId(parentCat._id);
    setSelectedId('');
  }

  const {
    data: categories = EMPTY_ARRAY,
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L2,
    parent: parentCat._id,
  });
  const filteredCats = useMemo(
    () => getFilteredAndSortedCats(categories, search, sort),
    [categories, search, sort],
  );

  return (
    <div className="border-primary/10 bg-primary/2 rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${String(filteredCats.length)}/${String(categories.length)} items`}
        level={CATEGORY_LEVELS_MAP.L2}
        name={parentCat.name}
      />
      <Table>
        <CategoryHead level={CATEGORY_LEVELS_MAP.L2} />
        <TableBody>
          {filteredCats.length ? (
            filteredCats.map((category) => (
              <Fragment key={category._id}>
                <CategoryRow
                  category={category}
                  onClick={() => {
                    setSelectedId((prevId) => (prevId === category._id ? '' : category._id));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedId((prevId) => (prevId === category._id ? '' : category._id));
                    }
                  }}
                  className={`cursor-pointer ${selectedId === category._id ? 'bg-primary/5' : 'hover:bg-primary/1'}`}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
                {selectedId === category._id && (
                  <TableRow>
                    <TableRowCell colSpan={4} className="border-b-0 px-0!">
                      <L3Table
                        onDelete={onDelete}
                        onEdit={onEdit}
                        category={category}
                        mainCatId={parentCat._id}
                      />
                    </TableRowCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            <ApiStatusRow
              haveLength={!!categories.length}
              isError={isError}
              isLoading={isLoading}
              level={CATEGORY_LEVELS_MAP.L2}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const L1Table = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();
  const search = useDeferredValue(queryParams[q_cat_keys.level.l1.search] ?? '');
  const sort = useDeferredValue(queryParams[q_cat_keys.level.l2.sort]) as TSort | undefined;
  const [selectedId, setSelectedId] = useState('');
  const [editData, setEditData] = useState<ICatModal | null>(null);
  const [deleteId, setDeleteId] = useState('');
  const {
    data: categories = EMPTY_ARRAY,
    isLoading,
    isError,
  } = useGetCategoriesByParentLevel({ level: CATEGORY_LEVELS_MAP.L1 });

  const deleteCategory = useDeleteCategory({ categoryId: deleteId });

  const handleEdit = (data: ICatModal) => {
    setEditData(data);

    setParams({ [q_cat_keys.mode]: q_cat_keys.edit });
  };

  const handleDelete = async () => {
    await deleteCategory.mutateAsync(deleteId, {
      onSettled: () => {
        setDeleteId('');

        setSelectedId((prev) => (prev === deleteId ? '' : prev));
      },
    });
  };

  const handleOnClose = () => {
    setEditData(null);
    removeParams([q_cat_keys.mode]);
  };

  const filteredCats = useMemo(
    () => getFilteredAndSortedCats(categories, search, sort),
    [categories, search, sort],
  );

  /**
   * Intentionally runs once on mount only, to clear a stray leftover `?mode=` param left over from
   * a previous session/reload - re-running this on every query-param change would close the
   * add/edit modal the moment the user opens it.
   */
  useEffect(() => {
    removeParams([q_cat_keys.mode]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border-primary/10 bg-secondary-invert rounded-xl border">
      <CategoryTableTopInfo
        badgeText={`${String(filteredCats.length)}/${String(categories.length)} items`}
        level={CATEGORY_LEVELS_MAP.L1}
        name=""
        className="flex w-full flex-row-reverse items-center justify-between gap-3 space-y-0!"
      />
      <ScrollableGradientContainer
        direction="horizontal"
        gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
      >
        <Table>
          <CategoryHead level={CATEGORY_LEVELS_MAP.L1} />
          <TableBody>
            {filteredCats.length ? (
              filteredCats.map((category) => (
                <Fragment key={category._id}>
                  <CategoryRow
                    category={category}
                    onClick={() => {
                      setSelectedId((prevId) => (prevId === category._id ? '' : category._id));
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedId((prevId) => (prevId === category._id ? '' : category._id));
                      }
                    }}
                    className={`cursor-pointer ${selectedId === category._id ? 'bg-primary/5' : 'hover:bg-primary/1'}`}
                    onDelete={(categoryId) => {
                      setDeleteId(categoryId);
                    }}
                    onEdit={handleEdit}
                  />
                  {selectedId === category._id && (
                    <TableRow>
                      <TableRowCell colSpan={4} className="border-b-0 px-0!">
                        <L2Table
                          onDelete={(categoryId) => {
                            setDeleteId(categoryId);
                          }}
                          onEdit={handleEdit}
                          category={category}
                        />
                      </TableRowCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <ApiStatusRow
                haveLength={!!categories.length}
                isError={isError}
                isLoading={isLoading}
                level={CATEGORY_LEVELS_MAP.L3}
              />
            )}
          </TableBody>
        </Table>
      </ScrollableGradientContainer>
      {!!editData && queryParams[q_cat_keys.mode] === q_cat_keys.edit && (
        <CategoryModal {...editData} onClose={handleOnClose} />
      )}
      {!!deleteId && (
        <ConfirmModal
          modalProps={{
            isOpen: !!deleteId,
            onClose: () => {
              setDeleteId('');
            },
          }}
          type="warning"
          title="Are you sure?"
          description="Are you sure you want to delete this category? This action cannot be undone."
          buttons={{
            left: {
              content: 'Cancel',
              buttonProps: {
                onClick: () => {
                  setDeleteId('');
                },
              },
            },
            right: { content: 'Delete', buttonProps: { onClick: handleDelete } },
          }}
        />
      )}
    </div>
  );
};

const Categories = () => {
  const { queryParams, setParams, clearParams } = useQueryParams();

  const params = useMemo(() => {
    return [
      queryParams[q_cat_keys.level.l1.search],
      queryParams[q_cat_keys.level.l1.sort],
      queryParams[q_cat_keys.level.l2.search],
      queryParams[q_cat_keys.level.l2.sort],
      queryParams[q_cat_keys.level.l3.search],
      queryParams[q_cat_keys.level.l3.sort],
    ].filter(Boolean);
  }, [queryParams]);

  return (
    <Fragment>
      {queryParams[q_cat_keys.mode] === q_cat_keys.add && <CategoryModal />}
      <PageWrapper
        navbar={{
          buttons: [
            {
              content: 'Clear',
              pattern: 'secondary',
              leftIcon: { icon: 'solar:eraser-linear', className: '*:stroke-[2.5]' },
              buttonProps: { onClick: clearParams },
              className: !params.length ? 'hidden' : '',
            },
            {
              content: 'Add',
              pattern: 'primary',
              leftIcon: { icon: 'solar:add-circle-linear', className: '*:stroke-[2.5]' },
              buttonProps: {
                onClick: () => {
                  setParams({ [q_cat_keys.mode]: q_cat_keys.add });
                },
              },
            },
          ],
        }}
      >
        <L1Table />
      </PageWrapper>
    </Fragment>
  );
};

export default Categories;
