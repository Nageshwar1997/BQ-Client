import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserApi } from '../api';
import { QUERY_KEYS } from '../../constants';
import { getUserToken, toaster } from '../../utils';
import { InvalidateQueries } from '../InvalidateQueries';
import { useQueryParams } from '../../hooks';
import { store } from '../../store';

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
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };

  public ChangePassword = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.change,
      mutationFn: this.change_password,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };

  public UpdatePassword = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.update,
      mutationFn: this.update_password,
      onSuccess: (data) => (toaster('success', data?.message), invalidate.user()),
      onError: (error) => toaster('error', error),
    });
  };

  public ResetPasswordTokenValidityCheck = () => {
    const { params } = useQueryParams();
    return useQuery({
      queryKey: QUERY_KEYS.users.user.password.token_validity.reset_password_check,
      queryFn: () => this.reset_password_token_validity_check(params.token),
      retry: false,
    });
  };

  public ForgotPasswordTokenValidityCheck = () => {
    const { params } = useQueryParams();
    return useQuery({
      queryKey: QUERY_KEYS.users.user.password.token_validity.forgot_password_check,
      queryFn: () => this.forgot_password_token_validity_check(params.token),
      retry: false,
    });
  };

  public ResetPasswordSendLink = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.link.reset_password_send,
      mutationFn: this.reset_password_send_link,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };

  public ForgotPasswordSendLink = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.link.forgot_password_send,
      mutationFn: this.forgot_password_send_link,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };

  public ForgotPasswordResendLink = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.link.forgot_password_resend,
      mutationFn: this.forgot_password_resend_link,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };

  public ResetPassword = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.reset,
      mutationFn: this.reset_password,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };

  public ForgotPassword = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.user.password.forgot,
      mutationFn: this.forgot_password,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };

  public ApplySeller = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.users.seller.apply,
      mutationFn: this.apply_seller,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };

  public GetWishlist = () => {
    const token = getUserToken();
    const { authenticated } = store.user.getState();
    const { params } = useQueryParams();

    return useQuery({
      queryKey: [...QUERY_KEYS.users.wishlist.get, !!params.login, authenticated, !!token],
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
      onSuccess: (data) => (toaster('success', data?.message), invalidate.wishlist()),
      onError: (error) => toaster('error', error),
    });
  };

  public RemoveProductFromWishlist = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.users.wishlist.remove,
      mutationFn: this.remove_product_from_wishlist,
      onSuccess: (data) => (toaster('success', data?.message), invalidate.wishlist()),
      onError: (error) => toaster('error', error),
    });
  };
}
