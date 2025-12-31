import z from "zod";
import {
  fileValidation,
  zodEnums,
  zodStringOptional,
  zodStringRequired,
} from "../../../utils/zod";
import { regexes } from "../../../constants";

export const registerOtpSchema = z.object({
  email: zodStringRequired({
    field: "email",
    showingFieldName: "Email",
    blockSingleSpace: true,
    customRegexes: [{ regex: regexes.validEmail, message: "must be a valid" }],
  }).toLowerCase(),
});

export const registerSchema = z.object({
  profilePic: fileValidation({
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
    field: "password",
    showingFieldName: "Password",
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
  }),
  confirmPassword: zodStringRequired({
    field: "confirmPassword",
    showingFieldName: "Confirm Password",
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
      field: "password",
      showingFieldName: "Password",
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
  profilePic: fileValidation({
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
