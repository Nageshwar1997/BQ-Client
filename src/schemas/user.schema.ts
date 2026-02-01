import { object } from 'zod';
import { zodCustomIssue, zodString } from '../utils/zod';
import { passwordValidationOptions } from '../constants';

const baseNewConfirmSchema = object({
  newPassword: zodString({
    ...passwordValidationOptions,
    field: 'newPassword',
    label: 'New password',
  }),
  confirmPassword: zodString({
    ...passwordValidationOptions,
    field: 'confirmPassword',
    label: 'Confirm password',
  }),
});

export const updatePasswordSchema = baseNewConfirmSchema.superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    zodCustomIssue(ctx, 'Confirm password does not match new password', 'confirmPassword');
  }
});

export const changePasswordSchema = baseNewConfirmSchema
  .extend({
    oldPassword: zodString({
      ...passwordValidationOptions,
      field: 'oldPassword',
      label: 'Current password',
    }),
  })
  .superRefine((data, ctx) => {
    const { oldPassword, newPassword, confirmPassword } = data ?? {};

    // Old & New must not be same
    if (oldPassword === newPassword) {
      zodCustomIssue(ctx, 'New password must be different from current password', 'newPassword');
    }

    // Old & Confirm must not be same
    if (oldPassword === confirmPassword) {
      zodCustomIssue(
        ctx,
        'Confirm password must be different from current password',
        'confirmPassword',
      );
    }

    // New & Confirm must match
    if (newPassword !== confirmPassword) {
      zodCustomIssue(ctx, 'Confirm password does not match new password', 'confirmPassword');
    }
  });
