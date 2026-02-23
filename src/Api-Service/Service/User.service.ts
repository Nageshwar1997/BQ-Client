import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserApi } from '../Api/User.api';
import { QUERY_KEYS } from '@/Constants';
import { InvalidateQueries } from '../InvalidateQueries';
import { Hook } from '@/Hooks';
import { Store } from '@/Stores';
import { getUserToken, toaster } from '@/Utils';

export class UserService extends UserApi {
  public GetUserDetails = (enabled: boolean = true) => {
    const token = getUserToken();
    return useQuery({
      queryKey: [...QUERY_KEYS.users.user.details, !!token],
      queryFn: this.get_user,
      retry: false,
      staleTime: Infinity,
      gcTime: Infinity,
      enabled: !!(token && enabled),
      placeholderData: keepPreviousData,
    });
  };

  public UpdateUserDetails = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.update,
      mutationFn: this.update_user,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public ChangePassword = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.change,
      mutationFn: this.change_password,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public UpdatePassword = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.update,
      mutationFn: this.update_password,
      onSuccess: ({ message }) => (toaster('success', message), invalidate.user()),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public ResetPasswordTokenValidityCheck = () => {
    const { queryParams } = Hook.QueryParams();
    return useQuery({
      queryKey: QUERY_KEYS.users.user.password.token_validity.reset_password_check,
      queryFn: () => this.reset_password_token_validity_check(queryParams.token),
      retry: false,
    });
  };

  public ForgotPasswordTokenValidityCheck = () => {
    const { queryParams } = Hook.QueryParams();
    return useQuery({
      queryKey: QUERY_KEYS.users.user.password.token_validity.forgot_password_check,
      queryFn: () => this.forgot_password_token_validity_check(queryParams.token),
      retry: false,
    });
  };

  public ResetPasswordSendLink = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.link.reset_password_send,
      mutationFn: this.reset_password_send_link,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public ForgotPasswordSendLink = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.link.forgot_password_send,
      mutationFn: this.forgot_password_send_link,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public ForgotPasswordResendLink = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.link.forgot_password_resend,
      mutationFn: this.forgot_password_resend_link,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public ResetPassword = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.reset,
      mutationFn: this.reset_password,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public ForgotPassword = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.forgot,
      mutationFn: this.forgot_password,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public ApplySeller = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.seller.apply,
      mutationFn: this.apply_seller,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public GetWishlist = () => {
    const token = getUserToken();
    const { authenticated } = Store.User.getState();
    const { queryParams } = Hook.QueryParams();

    return useQuery({
      queryKey: [...QUERY_KEYS.users.wishlist.get, !!queryParams.login, authenticated, !!token],
      queryFn: this.get_wishlist,
      retry: false,
      staleTime: 0.5 * 60 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      enabled: authenticated,
      placeholderData: keepPreviousData,
    });
  };

  public AddProductToWishlist = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.users.wishlist.add,
      mutationFn: this.add_product_to_wishlist,
      onSuccess: ({ message }) => (toaster('success', message), invalidate.wishlist()),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public RemoveProductFromWishlist = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.users.wishlist.remove,
      mutationFn: this.remove_product_from_wishlist,
      onSuccess: ({ message }) => (toaster('success', message), invalidate.wishlist()),
      onError: ({ message }) => toaster('error', message),
    });
  };
}
