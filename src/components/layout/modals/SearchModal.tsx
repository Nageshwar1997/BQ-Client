import { useEffect, useMemo, useState } from 'react';
import { CloseIcon, SearchIcon } from '../../../icons';
import { customHooks } from '../../../hooks';
import { debounce } from '../../../utils';
import type { IApiProductQueryProps, IModalWrapper, IProduct } from '../../../types';
import { Service } from '../../../api-service';
import { Input } from '../../ui';
import { ApiStatus } from '../../common';
import { SearchModalSkeleton } from '../skeletons/SearchModalSkeleton';
import { ModalWrapper } from './ModalWrapper';

export const SearchModal = (props: Omit<IModalWrapper, 'children'>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { navigate } = customHooks.PathParams();

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedQuery(value.trim());
      }, 600),
    [],
  );

  useEffect(() => {
    debouncedSetQuery(searchQuery);
  }, [searchQuery, debouncedSetQuery]);

  const queryParams: IApiProductQueryProps = useMemo(
    () => ({
      requiredFields: ['title', 'brand', 'commonImages'],
      populateFields: { category: ['label'] },
      pageParams: { page: 1, limit: 5 },
      queryParams: { search: debouncedQuery },
      enabled: !!debouncedQuery,
    }),
    [debouncedQuery],
  );

  const handleSubmit = (id?: string) => {
    if (id) {
      navigate(`/product/${id}`);
    } else {
      navigate(`/search?search=${searchQuery.trim()}`);
    }
    props.onClose();
  };

  const productsQuery = Service.Product.GetAllProducts(queryParams);
  const products: IProduct[] = productsQuery.data?.pages.flatMap((page) => page.products) || [];

  return (
    <ModalWrapper {...props}>
      <div className="flex h-full w-full flex-col gap-2 pt-2">
        {/* Search Input */}
        <Input
          needRef
          icons={{ left: { icon: <SearchIcon className="stroke-tertiary size-4 md:size-5" /> } }}
          inputProps={{
            placeholder: 'Search products here...',
            value: searchQuery,
            type: 'text',
            name: 'searchQuery',
            onChange: (e) => setSearchQuery(e.target.value),
            onKeyDown: (e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                handleSubmit();
              }
            },
          }}
          className="w-full"
        />
        {/* Query Info */}
        <div
          className={`text-tertiary bg-smoke-eerie mb-1 flex items-center justify-between rounded px-3 py-2 shadow-xs ${
            searchQuery.trim() ? 'opacity-100' : 'pointer-events-none opacity-50'
          }`}
        >
          <div
            className="flex cursor-pointer items-center gap-2 text-xs"
            onClick={() => handleSubmit()}
          >
            <span className="line-clamp-1">
              Results for: <strong>{searchQuery.trim()}</strong>
            </span>
          </div>
          <CloseIcon
            className="stroke-tertiary hover:stroke-primary size-4 cursor-pointer transition"
            onClick={() => setSearchQuery('')}
          />
        </div>
        {/* Result Container */}
        <div className="bg-smoke-eerie flex max-h-87.5 min-h-58.75 w-full flex-1 flex-col overflow-y-auto rounded-lg shadow-inner">
          {productsQuery.isPending && debouncedQuery ? (
            <SearchModalSkeleton count={5} />
          ) : productsQuery.isError ? (
            <ApiStatus
              status="error"
              error={{
                title: 'Something went wrong',
                description: 'Please try again later.',
              }}
              className="gap-1 [&_p]:text-sm [&_svg]:size-8 [&>div]:text-lg"
            />
          ) : products.length ? (
            <ul className="flex flex-col gap-1 p-1">
              {products.map((p: IProduct) => (
                <li
                  key={p._id}
                  className="border-primary/30 hover:bg-primary-inverted/30 flex cursor-pointer items-center gap-2 rounded-sm border p-1 transition"
                  onClick={() => handleSubmit(p._id)}
                >
                  <img
                    src={p.commonImages[0]}
                    alt={p.brand}
                    className="aspect-square size-8 rounded-sm object-cover"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-secondary line-clamp-1 text-xs font-medium">{p.title}</h3>
                    <p className="text-tertiary line-clamp-1 text-[10px]">
                      {p.brand} - {p.category.label}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : debouncedQuery ? (
            <ApiStatus
              status="empty"
              empty={{
                title: `No results found for ${(<strong>{debouncedQuery}</strong>)}`,
              }}
              className="gap-1 [&_p]:text-sm [&_svg]:size-8 [&>div]:text-lg"
            />
          ) : (
            <div className="flex w-full flex-1 items-center justify-center text-center text-sm md:text-base">
              Search for products to view them here
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};
