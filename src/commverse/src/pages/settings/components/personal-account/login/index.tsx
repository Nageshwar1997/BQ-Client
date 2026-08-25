import { Fragment, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import Button from '../../../../../components/Button';
import Divider from '../../../../../components/Divider';
import Modal from '../../../../../components/Modal';
import Input from '../../../../../components/Input';
import ToastCard from '../../../../../components/AlertCards/ToastCard';
import {
  newPasswordSchema,
  otpSchema,
  passwordSchema,
} from '../../../../../schema/auth.schema';
import { useRegisterSettingsHeaderActions } from '../../../../../hooks/useRegisterSettingsHeaderActions';
import {
  useDeleteAccount,
  useForgotPassword,
  useForgotPasswordVerifyOTP,
  useLoginUser,
  useResetPassword,
  useSignOutAll,
} from '../../../../../services/auth-service';
import { clearLoggedInData, getUser } from '../../../../../lib/utils';
import type {
  LoginFormData,
  NewPasswordFormData,
  OtpFormData,
  ToastCardProps,
} from '../../../../../types';

const Login = () => {
  const [modalState, setModalState] = useState<
    'existing-pwd' | 'otp' | 'new-pwd' | 'sign-out' | 'delete' | null
  >(null);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState<number>(0);

  const loginUserQuery = useLoginUser();
  const forgotPasswordQuery = useForgotPassword();
  const verifyOTPQuery = useForgotPasswordVerifyOTP();
  const resetPasswordQuery = useResetPassword();
  const signOutAllQuery = useSignOutAll();
  const deleteAccountQuery = useDeleteAccount();
  const user = getUser();

  const existingPwdForm = useForm<Pick<LoginFormData, 'password'>>({
    resolver: zodResolver(passwordSchema),
    shouldFocusError: false,
    mode: 'onChange',
  });
  const newPwdForm = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    shouldFocusError: false,
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    shouldFocusError: false,
  });

  const {
    formState: {
      errors: existingPwdFormErrors,
      isValid: isExistingPwdFormValid,
    },
  } = existingPwdForm;
  const newPwdFormErrors = newPwdForm.formState.errors;
  const otpFormErrors = otpForm.formState.errors;

  const showToast = (toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  };

  const handleExistingPwdFormSubmit = existingPwdForm.handleSubmit((data) => {
    const email = user?.user?.email;

    if (!email) {
      showToast({
        type: 'error',
        title: 'Unable to verify password',
        description: 'No email found for the current user.',
      });
      return;
    }

    loginUserQuery.mutate(
      {
        email,
        password: data.password,
      },
      {
        onSuccess: () => {
          existingPwdForm.clearErrors('password');
          forgotPasswordQuery.mutate(
            { email },
            {
              onSuccess: () => {
                showToast({
                  type: 'success',
                  title: 'OTP sent',
                  description: 'Check your inbox for the OTP.',
                });
                otpForm.setValue('email', email);
                setModalState('otp');
              },
              onError: (error) => {
                showToast({
                  type: 'error',
                  title: 'Unable to send OTP',
                  description: error.message,
                });
              },
            }
          );
        },
        onError: () => {
          existingPwdForm.setError('password', {
            type: 'custom',
            message: 'Entered password does not match your current password',
          });
        },
      }
    );
  });

  const handleOTPVerification = otpForm.handleSubmit((data) => {
    const email = user?.user?.email;

    if (!email) {
      showToast({
        type: 'error',
        title: 'Unable to verify OTP',
        description: 'No email found for the current user.',
      });
      return;
    }

    verifyOTPQuery.mutate(
      { email, otp: data.otp },
      {
        onSuccess: (res) => {
          if (res?.success) {
            otpForm.clearErrors('otp');
            setModalState('new-pwd');
          }
        },
        onError: (error) => {
          if (error.message == 'Invalid or expired OTP') {
            otpForm.setError('otp', {
              type: 'custom',
              message: 'Invalid or expired OTP',
            });
          } else {
            showToast({
              type: 'error',
              title: 'Unable to verify OTP',
              description: error.message,
            });
          }
        },
      }
    );
  });

  const handleForgotPassword = () => {
    const email = user?.user?.email;

    if (!email) {
      showToast({
        type: 'error',
        title: 'Unable to request reset',
        description: 'No email found for the current user.',
      });
      return;
    }

    forgotPasswordQuery.mutate(
      { email },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            title: 'Reset email sent',
            description: 'Check your inbox for reset instructions.',
          });
        },
        onError: (error) => {
          showToast({
            type: 'error',
            title: 'Unable to send reset email',
            description: error.message,
          });
        },
      }
    );
  };

  const handleChangePassword = newPwdForm.handleSubmit((data) => {
    const email = user?.user?.email;

    if (!email) {
      showToast({
        type: 'error',
        title: 'Unable to change password',
        description: 'No email found for the current user.',
      });
      return;
    }

    resetPasswordQuery.mutate(
      {
        email,
        password: data.newPassword,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            title: 'Password changed successfully',
          });
          resetModalState();
        },
        onError: (error) => {
          showToast({
            type: 'error',
            title: 'Unable to change password',
            description: error.message,
          });
        },
      }
    );
  });

  const handleDeleteAccountSubmit = existingPwdForm.handleSubmit((data) => {
    deleteAccountQuery.mutate(
      { password: data.password },
      {
        onSuccess: () => {
          clearLoggedInData();
        },
        onError: (error) => {
          showToast({
            type: 'error',
            title: 'Unable to delete account',
            description: error.message,
          });
        },
      }
    );
  });

  const handleHeaderSave = () => {
    showToast({
      type: 'warning',
      title: 'No save action available',
      description: 'There are no editable settings to save in this section.',
    });
  };

  const handleHeaderCancel = () => {
    showToast({
      type: 'warning',
      title: 'No cancel action available',
      description: 'There are no pending changes to discard in this section.',
    });
  };

  const resetModalState = () => {
    setModalState(null);
    existingPwdForm.reset();
    newPwdForm.reset();
    otpForm.reset();
  };

  useRegisterSettingsHeaderActions(
    useMemo(() => ({
      saveBtnProps: {
        onClick: handleHeaderSave,
      },
      cancelBtnProps: {
        onClick: handleHeaderCancel,
      },
    }), [handleHeaderCancel, handleHeaderSave])
  );

  const handleSignOutAll = () => {
    signOutAllQuery.mutate(undefined, {
      onSuccess: () => {
        clearLoggedInData();
      },
      onError: (error) => {
        showToast({
          type: 'error',
          title: 'Unable to sign out all devices',
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="text-neutral-gray-900 font-metropolis flex max-w-3/5 flex-col gap-3">
      <div className="leading-5 font-semibold">Login</div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 text-xs leading-[18px] font-medium">
          <div>Password</div>
          {/* TODO: feature to be implemented */}
          {/* <div className="text-neutral-gray-600">
            Password last updated: November 6, 2025
          </div> */}
        </div>
        <Button
          variant="tertiary"
          content="Update"
          size="sm"
          className="h-8! w-min p-2!"
          onClick={() => setModalState('existing-pwd')}
        />
      </div>
      <Divider className="border-t-neutral-gray-200! border-transparent!" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 text-xs leading-[18px] font-medium">
          <div>Sign out from all devices</div>
          <div className="text-neutral-gray-600 max-w-4/5">
            Logged in on a shared device but forgot to sign out? End all
            sessions by signing out from all devices.
          </div>
        </div>
        <Button
          variant="secondary"
          content="Sign out from all devices"
          size="sm"
          className="h-8! w-min p-2!"
          onClick={() => setModalState('sign-out')}
        />
      </div>
      <Divider className="border-t-neutral-gray-200! border-transparent!" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 text-xs leading-[18px] font-medium">
          <div>Delete your account</div>
          <div className="text-neutral-gray-600 max-w-[70%]">
            By deleting your account, you'll no longer be able to access any of
            your Creation or log in.
          </div>
        </div>
        <Button
          variant="ghost"
          content="Delete account"
          size="sm"
          className="text-ui-error! h-8! w-min p-2!"
          onClick={() => setModalState('delete')}
        />
      </div>
      <Modal
        open={modalState !== null}
        onClose={resetModalState}
        className={`[&>div]:h-min ${modalState === 'delete' ? '[&>div]:w-[534px]' : '[&>div]:w-[460px]'}`}
      >
        <div className="text-neutral-gray-900 flex h-full w-full flex-col items-center gap-6 p-10">
          {modalState === 'existing-pwd' ? (
            <Fragment>
              <div className="self-start text-2xl leading-7 font-bold">
                Confirm Your Existing Password
              </div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                containerClassName="w-full"
                className="h-10"
                error={existingPwdFormErrors.password?.message}
                {...existingPwdForm.register('password')}
              />
              <div className="grid w-full grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  content="Cancel"
                  size="sm"
                  className="h-10!"
                  onClick={resetModalState}
                />
                <Button
                  content="Confirm Password"
                  size="sm"
                  className="h-10!"
                  onClick={handleExistingPwdFormSubmit}
                  isLoading={
                    loginUserQuery.isPending || forgotPasswordQuery.isPending
                  }
                  disabled={
                    loginUserQuery.isPending || forgotPasswordQuery.isPending
                  }
                />
              </div>
              {/* <Button
                variant="link"
                size="sm"
                content="Forgot Password ?"
                className="text-neutral-gray-700 text-xs!"
                onClick={handleForgotPassword}
                isLoading={
                  forgotPasswordQuery.isPending && modalState !== 'existing-pwd'
                }
              /> */}
            </Fragment>
          ) : modalState === 'otp' ? (
            <Fragment>
              <div className="self-start text-2xl leading-3 font-bold">
                Verification Code
              </div>
              <div className="text-neutral-gray-600 mb-2 self-start text-sm font-medium">
                We sent a temporary code to{' '}
                <span className="text-neutral-gray-900">
                  {user?.user?.email}
                </span>
              </div>
              <Input
                label="Verification Code"
                type="number"
                placeholder="Enter login code"
                containerClassName="w-full"
                className="h-10"
                error={otpFormErrors.otp?.message}
                {...otpForm.register('otp')}
              />
              <div className="grid w-full grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  content="Cancel"
                  size="sm"
                  className="h-10!"
                  onClick={resetModalState}
                />
                <Button
                  content="Verify OTP"
                  size="sm"
                  className="h-10!"
                  onClick={handleOTPVerification}
                  isLoading={verifyOTPQuery.isPending}
                  disabled={verifyOTPQuery.isPending}
                />
              </div>
            </Fragment>
          ) : modalState === 'new-pwd' ? (
            <Fragment>
              <div className="self-start text-2xl leading-7 font-bold">
                Enter New Password
              </div>
              <Input
                label="Enter Password"
                type="password"
                placeholder="Enter Password"
                containerClassName="w-full"
                className="h-10"
                error={newPwdFormErrors.newPassword?.message}
                {...newPwdForm.register('newPassword')}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter Password"
                containerClassName="w-full"
                className="h-10"
                error={newPwdFormErrors.confirmPassword?.message}
                {...newPwdForm.register('confirmPassword')}
              />
              <div className="grid w-full grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  content="Cancel"
                  size="sm"
                  className="h-10!"
                  onClick={resetModalState}
                />
                <Button
                  content="Change Password"
                  size="sm"
                  className="h-10!"
                  onClick={handleChangePassword}
                  isLoading={resetPasswordQuery.isPending}
                  disabled={resetPasswordQuery.isPending}
                />
              </div>
            </Fragment>
          ) : modalState === 'sign-out' ? (
            <Fragment>
              <div className="self-start text-2xl leading-7 font-bold">
                Sign Out all devices
              </div>
              <div className="text-xs leading-[18px] font-medium">
                You will lose changes if edits made from other devices aren't
                saved yet.
              </div>
              <div className="grid w-full grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  content="Cancel"
                  size="sm"
                  className="h-10!"
                  onClick={resetModalState}
                />
                <Button
                  variant="ghost"
                  content="Sign out"
                  size="sm"
                  className="text-ui-error! h-10!"
                  onClick={handleSignOutAll}
                  isLoading={signOutAllQuery.isPending}
                  disabled={signOutAllQuery.isPending}
                />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="self-start text-2xl leading-7 font-bold">
                You're about to delete your account
              </div>
              <div className="flex flex-col items-center gap-4 text-sm leading-[18px] font-medium">
                <div className="bg-ui-warning-light text-ui-warning flex gap-1.5 rounded-md p-4">
                  <Icon
                    icon="solar:info-circle-outline"
                    className="h-4 min-w-4"
                  />
                  <div>
                    After selecting "Delete account" you have 14 days to log
                    back in and restore it before it's permanently deleted..
                  </div>
                </div>
                <div className="self-start text-black">
                  Deleting your account means you will lose:
                </div>
                <div className="font-semibold">
                  All of your account content, including All Experience,
                  folders, uploaded media.
                </div>
                <Input
                  type="password"
                  label="Please confirm your password if you want to proceed:"
                  placeholder="Enter Password"
                  containerClassName="w-full"
                  className="h-10"
                  {...existingPwdForm.register('password')}
                />
                <div className="grid w-full grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    content="Cancel"
                    size="sm"
                    className="h-10!"
                    onClick={resetModalState}
                  />
                  <Button
                    variant="ghost"
                    content="Delete Account"
                    size="sm"
                    className={`text-ui-error! h-10! ${!isExistingPwdFormValid ? 'opacity-50' : ''}`}
                    disabled={
                      !isExistingPwdFormValid || deleteAccountQuery.isPending
                    }
                    onClick={handleDeleteAccountSubmit}
                    isLoading={deleteAccountQuery.isPending}
                  />
                </div>
                <Button
                  variant="link"
                  size="sm"
                  content="Forgot Password ?"
                  className="text-xs!"
                  onClick={handleForgotPassword}
                  isLoading={forgotPasswordQuery.isPending}
                />
              </div>
            </Fragment>
          )}
        </div>
      </Modal>

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </div>
  );
};

export default Login;
