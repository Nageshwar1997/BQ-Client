import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import Button from '../../components/Button';
import DividerText from '../../components/DividerText';
import Input from '../../components/Input';
import { GoogleIcon, MicrosoftIcon } from '../../icons';
import { useState } from 'react';
import {
  emailSchema,
  loginSchema,
  otpSchema,
  resetPasswordSchema,
  setPasswordSchema,
} from '../../schema/auth.schema';
import type {
  AuthStep,
  LoginFormData,
  OtpFormData,
  ResetPasswordFormData,
  SetPasswordFormData,
} from '../../types';
import {
  useCheckIfEmailExists,
  useForgotPassword,
  useForgotPasswordVerifyOTP,
  useLoginUser,
  useRegisterUser,
  useResetPassword,
  useVerifyOTP,
} from '../../services/auth-service';
import { trackUserLogin } from '../../lib/mixpanel';
import { saveUser } from '../../lib/utils';
import { VITE_GATEWAY_BASE_URL } from '../../env';

const Auth = () => {
  const [step, setStep] = useState<AuthStep>('EMAIL');
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const navigate = useNavigate();

  // ===== Queries =====
  const checkIfEmailExistsQuery = useCheckIfEmailExists();
  const loginUserQuery = useLoginUser();
  const verifyOTPQuery = useVerifyOTP();
  const registerUserQuery = useRegisterUser();
  const forgotPasswordQuery = useForgotPassword();
  const forgotPasswordVerifyOtpQuery = useForgotPasswordVerifyOTP();
  const resetPasswordQuery = useResetPassword();
  const emailForm = useForm<Pick<LoginFormData, 'email'>>({
    resolver: zodResolver(emailSchema),
  });
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const otpForm = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });
  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const setPasswordForm = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

  const checkIfEmailExists = async (data: Pick<LoginFormData, 'email'>) => {
    await checkIfEmailExistsQuery.mutateAsync(data, {
      onSuccess: async (successData) => {
        const { emailTaken, providers } = successData?.data ?? {};
        const hasLocal = (providers ?? []).includes('local');

        if (!emailTaken || !hasLocal) {
          // New user OR OAuth-only user linking local — go through OTP flow
          // Backend has already sent the OTP in both cases
          setStep('SIGNUP_OTP');
          otpForm.setValue('email', data?.email);
        } else {
          // Has local auth — show password form
          loginForm.setValue('email', data?.email);
          setStep('LOGIN_PASSWORD');
        }
      },
    });
  };

  const handleLogin = async (data: LoginFormData) => {
    await loginUserQuery.mutateAsync(data, {
      onSuccess: (response) => {
        saveUser(response?.data);
        if (response?.success) {
          trackUserLogin(response?.data?.user?.email ?? data.email);
          navigate('/dashboard');
          setErrorInfo(null);
        }
      },
      onError: (error) => {
        if (
          error.message == 'Password is incorrect' ||
          error.message === 'Invalid email or password'
        ) {
          loginForm.setError('password', {
            type: 'custom',
            message: 'Invalid login credentials',
          });
        } else {
          setErrorInfo(
            error.message || 'Something went wrong. Please try again.'
          );
        }
      },
    });
  };

  const handleOtpVerification = async (body: OtpFormData) => {
    if (step === 'FORGOT_PASSWORD_OTP') {
      await forgotPasswordVerifyOtpQuery.mutateAsync(body, {
        // On successful OTP verification, navigate to set password
        onSuccess: (data) => {
          if (data?.success) {
            resetPasswordForm.setValue('email', body?.email);
            otpForm.reset();
            setStep('RESET_PASSWORD');
            setErrorInfo(null);
          }
        },
        onError: (error) => {
          if (error.message == 'Invalid or expired OTP') {
            otpForm.setError('otp', {
              type: 'custom',
              message: 'Invalid or expired OTP',
            });
          } else {
            setErrorInfo(
              error.message || 'Something went wrong. Please try again.'
            );
          }
        },
      });
    } else if (step === 'SIGNUP_OTP') {
      await verifyOTPQuery.mutateAsync(body, {
        // On successful OTP verification, navigate to set password
        onSuccess: (data) => {
          if (data?.success) {
            setPasswordForm.setValue('email', body?.email);
            otpForm.reset();
            setStep('SET_PASSWORD');
            setErrorInfo(null);
          }
        },
        onError: (error) => {
          if (error.message == 'Invalid or expired OTP') {
            otpForm.setError('otp', {
              type: 'custom',
              message: 'Token has expired or is invalid',
            });
          } else {
            setErrorInfo(
              error.message || 'Something went wrong. Please try again.'
            );
          }
        },
      });
    }
  };

  const handleSetPassword = async (data: SetPasswordFormData) => {
    const { confirmPassword, ...payload } = data;
    await registerUserQuery.mutateAsync(payload, {
      onSuccess: (data) => {
        if (data?.success) {
          saveUser({ token: data?.data?.token, user: data?.data?.user });
          setErrorInfo(null);
          navigate('/dashboard');
        }
      },
      onError: (error) => {
        setErrorInfo(
          error.message || 'Something went wrong. Please try again.'
        );
      },
    });
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    const payload = {
      email: data.email,
      password: data.newPassword,
    };
    await resetPasswordQuery.mutateAsync(payload as any, {
      onSuccess: (data) => {
        if (data?.success) {
          saveUser({ token: data?.data?.token, user: data?.data?.user });
          setErrorInfo(null);
          navigate('/dashboard');
        }
      },
      onError: (error) => {
        setErrorInfo(
          error.message || 'Something went wrong. Please try again.'
        );
      },
    });
  };

  const handleContinue = () => {
    switch (step) {
      case 'EMAIL':
        emailForm.handleSubmit(checkIfEmailExists)();
        break;
      case 'LOGIN_PASSWORD':
        loginForm.handleSubmit(handleLogin)();
        break;
      case 'SIGNUP_OTP':
      case 'FORGOT_PASSWORD_OTP':
        otpForm.handleSubmit(handleOtpVerification)();
        break;
      case 'SET_PASSWORD':
        setPasswordForm.handleSubmit(handleSetPassword)();
        break;
      case 'RESET_PASSWORD':
        resetPasswordForm.handleSubmit(handleResetPassword)();
        break;
      default:
        break;
    }
  };

  // Handle back button navigation
  const handleBack = () => {
    setErrorInfo(null);
    switch (step) {
      case 'LOGIN_PASSWORD':
        {
          setStep('EMAIL');
          loginForm.reset();
        }
        break;
      case 'SIGNUP_OTP':
        {
          setStep('EMAIL');
          otpForm.reset();
        }
        break;
      case 'SET_PASSWORD':
        {
          setStep('EMAIL');
          setPasswordForm.reset();
        }
        break;
      case 'FORGOT_PASSWORD_OTP':
        {
          setStep('LOGIN_PASSWORD');
          otpForm.reset();
        }
        break;
      case 'RESET_PASSWORD':
        {
          setStep('LOGIN_PASSWORD');
          resetPasswordForm.reset();
        }
        break;
      default:
        window.open('https://commverse.studio/');
        break;
    }
  };

  const showSocialAuth = step === 'EMAIL' || step === 'LOGIN_PASSWORD';
  const showOtpInfo = step === 'SIGNUP_OTP' || step === 'FORGOT_PASSWORD_OTP';

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedEmail = emailForm.watch('email');

  const getWelcomeText = (step: AuthStep) => {
    switch (step) {
      case 'EMAIL':
        return 'Welcome';
      case 'LOGIN_PASSWORD':
        return 'Welcome back';
      case 'SIGNUP_OTP':
        return 'One more step';
      case 'FORGOT_PASSWORD_OTP':
        return 'One more step';
      case 'SET_PASSWORD':
        return 'Set your password';
      case 'RESET_PASSWORD':
        return 'Reset your password';
      default:
        return 'Welcome';
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-12">
        <Button
          variant="ghost"
          leftIcon={
            <Icon icon="solar:alt-arrow-left-linear" className="size-5" />
          }
          content="Back"
          className="h-auto! w-fit! self-start"
          onClick={handleBack}
        />

        <div className="flex w-full max-w-md flex-1 flex-col justify-center gap-8">
          <img
            src="/assets/icons/Commverse Logo - Final.svg"
            alt="Logo"
            className="h-12 w-full max-w-34 self-center"
          />

          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-neutral-gray-700 text-2xl font-bold">
              {getWelcomeText(step)}
            </h2>

            {showOtpInfo && (
              <p className="text-neutral-gray-900 font-metropolis text-sm">
                We sent a temporary code to {watchedEmail}
              </p>
            )}
          </div>

          {/* Social Auth */}
          {showSocialAuth && (
            <div className="flex flex-col gap-3">
              <Button
                variant="secondary"
                leftIcon={<GoogleIcon />}
                content="Google"
                size="sm"
                onClick={() => {
                  window.location.href = `${VITE_GATEWAY_BASE_URL}/auth/oauth/google`;
                }}
              />
              <Button
                variant="secondary"
                leftIcon={<MicrosoftIcon />}
                content="Microsoft"
                size="sm"
                onClick={() => {
                  window.location.href = `${VITE_GATEWAY_BASE_URL}/auth/oauth/microsoft`;
                }}
              />

              <DividerText text="or" />
            </div>
          )}

          {/* Forms */}
          <div className="flex flex-col gap-4">
            {/* Email Step */}
            {step === 'EMAIL' && (
              <form onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter email address"
                  error={emailForm.formState.errors.email?.message}
                  {...emailForm.register('email')}
                />
              </form>
            )}
            {step === 'SET_PASSWORD' && (
              <form onSubmit={(e) => e.preventDefault()}>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  {...setPasswordForm.register('password')}
                  error={setPasswordForm.formState.errors.password?.message}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  {...setPasswordForm.register('confirmPassword')}
                  error={
                    setPasswordForm.formState.errors.confirmPassword?.message
                  }
                  containerClassName="mt-4"
                />
              </form>
            )}
            {/* Login Password Step */}
            {step === 'LOGIN_PASSWORD' && (
              <form onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter email address"
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                  containerClassName="mt-4"
                />
              </form>
            )}

            {/* Signup OTP Step */}
            {step === 'SIGNUP_OTP' && (
              <form onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="number"
                  placeholder="Enter login code"
                  error={otpForm.formState.errors.otp?.message}
                  {...otpForm.register('otp')}
                />
              </form>
            )}

            {/* Forgot Password OTP Step */}
            {step === 'FORGOT_PASSWORD_OTP' && (
              <form onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="number"
                  placeholder="Enter login code"
                  error={otpForm.formState.errors.otp?.message}
                  {...otpForm.register('otp')}
                />
              </form>
            )}

            {/* Reset Password Step */}
            {step === 'RESET_PASSWORD' && (
              <form onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  error={
                    resetPasswordForm.formState.errors.newPassword?.message
                  }
                  {...resetPasswordForm.register('newPassword')}
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  error={
                    resetPasswordForm.formState.errors.confirmPassword?.message
                  }
                  {...resetPasswordForm.register('confirmPassword')}
                  containerClassName="mt-4"
                />
              </form>
            )}

            {/* Forgot Password Link */}
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Button
              type="button"
              content="Continue"
              onClick={handleContinue}
              isLoading={
                loginUserQuery.isPending ||
                checkIfEmailExistsQuery.isPending ||
                resetPasswordQuery.isPending ||
                verifyOTPQuery.isPending ||
                registerUserQuery.isPending
              }
            />
            <span className="text-ui-error font-metropolis mx-auto w-full text-center text-xs leading-3.5 font-normal text-wrap">
              {errorInfo}
            </span>
            {step === 'LOGIN_PASSWORD' && (
              <Button
                variant="link"
                content="Forgot your password?"
                onClick={() => {
                  const email = emailForm.getValues('email');
                  forgotPasswordQuery.mutateAsync(
                    { email },
                    {
                      onSuccess: () => (
                        setStep('FORGOT_PASSWORD_OTP'),
                        otpForm.setValue('email', email)
                      ),
                      onError: (error) => {
                        setErrorInfo(
                          error.message ||
                            'Something went wrong. Please try again.'
                        );
                      },
                    }
                  );
                }}
                isLoading={forgotPasswordQuery.isPending}
                className="self-center text-xs!"
              />
            )}
          </div>
        </div>

        <div className="text-neutral-gray-600 font-metropolis flex items-center gap-2 text-xs font-normal">
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
          <div className="bg-neutral-gray-600 h-full w-px" />
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>

      <div className="hidden flex-1 lg:block">
        <img
          src="/assets/images/auth-bg.webp"
          alt="Auth Background"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Auth;
