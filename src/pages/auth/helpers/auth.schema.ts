import z from "zod";
import {
  singleFileOrUrlValidation,
  zodEnums,
  zodStringOptional,
  zodStringRequired,
} from "../../../utils/zod";
import { regexes } from "../../../constants";

const commonPasswordFields = {
  blockSingleSpace: true,
  min: 6,
  max: 20,
  customRegexes: [
    {
      regex: regexes.atLeastOneUppercaseLetter,
      message: "must contain at least one uppercase letter",
    },
    {
      regex: regexes.atLeastOneLowercaseLetter,
      message: "must contain at least one lowercase letter",
    },
    {
      regex: regexes.atLeastOneDigit,
      message: "must contain at least one number",
    },
    {
      regex: regexes.atLeastOneSpecialCharacter,
      message: "must contain at least one special character e.g. @$!%*?&#",
    },
    {
      regex: regexes.password,
      message:
        "must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    },
  ],
};

export const registerOtpSchema = z.object({
  email: zodStringRequired({
    field: "email",
    showingFieldName: "Email",
    blockSingleSpace: true,
    customRegexes: [{ regex: regexes.validEmail, message: "must be a valid" }],
  }).toLowerCase(),
});

export const registerSchema = z.object({
  profilePic: singleFileOrUrlValidation({
    field: "profilePic",
    showingFieldName: "Profile Pic",
    required: false,
  }),
  otp: zodStringRequired({
    field: "otp",
    showingFieldName: "OTP",
    blockSingleSpace: true,
    min: 6,
    max: 6,
    customRegexes: [
      {
        regex: regexes.validOTP,
        message: "must be a valid 6 digit number. It can contain only digits",
      },
    ],
  }),
  firstName: zodStringRequired({
    field: "firstName",
    showingFieldName: "First Name",
    blockMultipleSpaces: true,
    min: 2,
    max: 50,
    customRegexes: [
      {
        regex: regexes.validName,
        message:
          "can only contain letters and only one space is allowed between words",
      },
    ],
  }),
  lastName: zodStringRequired({
    field: "lastName",
    showingFieldName: "Last Name",
    blockMultipleSpaces: true,
    min: 2,
    max: 50,
    customRegexes: [
      {
        regex: regexes.validName,
        message:
          "can only contain letters and only one space is allowed between words",
      },
    ],
  }),
  email: zodStringRequired({
    field: "email",
    showingFieldName: "Email",
    blockSingleSpace: true,
    customRegexes: [{ regex: regexes.validEmail, message: "must be a valid" }],
  }).toLowerCase(),
  phoneNumber: zodStringRequired({
    field: "phoneNumber",
    showingFieldName: "Phone number",
    blockSingleSpace: true,
    customRegexes: [
      { regex: regexes.phoneStart, message: "must start with 6, 7, 8, or 9" },
      { regex: regexes.phoneExactLength, message: "must be exactly 10 digits" },
      {
        regex: regexes.validPhone,
        message: "must be exactly 10 digits and must start with 6, 7, 8, or 9",
      },
    ],
  }),
  password: zodStringRequired({
    ...commonPasswordFields,
    field: "password",
    showingFieldName: "Password",
  }),
  confirmPassword: zodStringRequired({
    ...commonPasswordFields,
    field: "confirmPassword",
    showingFieldName: "Confirm Password",
  }),
  remember: z.boolean().optional().default(false),
});

export const loginSchema = z
  .object({
    loginMethod: zodEnums({
      field: "loginMethod",
      showingFieldName: "Login method",
      enums: ["email", "phoneNumber"],
    }),
    email: zodStringOptional({
      field: "email",
      showingFieldName: "Email",
      customRegexes: [{ regex: regexes.validEmail, message: "must be valid" }],
    }).transform((val) => val?.toLowerCase()),
    phoneNumber: zodStringOptional({
      field: "phoneNumber",
      showingFieldName: "Phone number",
      customRegexes: [
        {
          regex: regexes.validPhone,
          message:
            "must be a valid Indian number starting with 6, 7, 8, or 9 and be exactly 10 digits long.",
        },
      ],
    }),
    password: zodStringRequired({
      ...commonPasswordFields,
      field: "password",
      showingFieldName: "Password",
    }),
    remember: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.loginMethod === "email") {
      if (!data.email || data.email.trim() === "") {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Email is required",
        });
      }
    }
    if (data.loginMethod === "phoneNumber") {
      if (!data.phoneNumber || data.phoneNumber.trim() === "") {
        ctx.addIssue({
          path: ["phoneNumber"],
          code: z.ZodIssueCode.custom,
          message: "Phone number is required",
        });
      }
    }
  });

export const updateUserSchema = z.object({
  profilePic: singleFileOrUrlValidation({
    field: "profilePic",
    showingFieldName: "Profile Pic",
  }),
  firstName: zodStringRequired({
    field: "firstName",
    showingFieldName: "First Name",
    blockMultipleSpaces: true,
    min: 2,
    max: 50,
    customRegexes: [
      {
        regex: regexes.validName,
        message:
          "can only contain letters and only one space is allowed between words",
      },
    ],
  }),
  lastName: zodStringRequired({
    field: "lastName",
    showingFieldName: "Last Name",
    blockMultipleSpaces: true,
    min: 2,
    max: 50,
    customRegexes: [
      {
        regex: regexes.validName,
        message:
          "can only contain letters and only one space is allowed between words",
      },
    ],
  }),
  email: zodStringRequired({
    field: "email",
    showingFieldName: "Email",
    blockSingleSpace: true,
    customRegexes: [{ regex: regexes.validEmail, message: "must be a valid" }],
  }).toLowerCase(),
  phoneNumber: zodStringRequired({
    field: "phoneNumber",
    showingFieldName: "Phone number",
    blockSingleSpace: true,
    customRegexes: [
      { regex: regexes.phoneStart, message: "must start with 6, 7, 8, or 9" },
      {
        regex: regexes.phoneExactLength,
        message: "must be exactly 10 digits",
      },
      {
        regex: regexes.validPhone,
        message: "must be exactly 10 digits and must start with 6, 7, 8, or 9",
      },
    ],
  }),
});

export const updatePasswordSchema = z
  .object({
    oldPassword: zodStringRequired({
      ...commonPasswordFields,
      field: "oldPassword",
      showingFieldName: "Current password",
    }),
    newPassword: zodStringRequired({
      ...commonPasswordFields,
      field: "newPassword",
      showingFieldName: "New password",
    }),
    confirmPassword: zodStringRequired({
      ...commonPasswordFields,
      field: "confirmPassword",
      showingFieldName: "Confirm password",
    }),
  })
  .superRefine((data, ctx) => {
    const { oldPassword, newPassword, confirmPassword } = data;

    // Old & New must not be same
    if (oldPassword === newPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: "New password must be different from current password",
      });
    }

    // Old & Confirm must not be same
    if (oldPassword === confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Confirm password must be different from current password",
      });
    }

    // New & Confirm must match
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Confirm password does not match new password",
      });
    }
  });
