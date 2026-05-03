import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount) => failureCount < 3,
    },
    mutations: { retry: false },
  },

  queryCache: new QueryCache({
    onSuccess: (data, query) => {
      console.log('✅ Query Success:', {
        queryKey: query.queryKey,
        data,
      });
    },
    onError: (error, query) => {
      console.error('❌ Query Error:', {
        queryKey: query.queryKey,
        error,
      });
    },
    onSettled: (data, error, query) => {
      console.log('📦 Query Settled:', {
        queryKey: query.queryKey,
        hasData: !!data,
        hasError: !!error,
      });
    },
  }),

  mutationCache: new MutationCache({
    onSuccess: (data, variables, _context, mutation) => {
      console.log('✅ Mutation Success:', {
        mutationKey: mutation.options.mutationKey,
        variables,
        data,
      });
    },
    onError: (error, variables, _context, mutation) => {
      console.error('❌ Mutation Error:', {
        mutationKey: mutation.options.mutationKey,
        variables,
        error,
      });
    },
    onSettled: (data, error, _variables, _context, mutation) => {
      console.log('📦 Mutation Settled:', {
        mutationKey: mutation.options.mutationKey,
        hasData: !!data,
        hasError: !!error,
      });
    },
  }),
});
