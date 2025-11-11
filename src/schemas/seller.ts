import z from "zod";
import {
  zodEnums,
  zodFileOrUrl,
  zodStringOptional,
  zodStringRequired,
} from "../utils/zod";
import {
  ALLOWED_BUSINESSES,
  ALLOWED_COUNTRIES,
  MB,
  regexes,
  STATES_AND_UNION_TERRITORIES,
} from "../constants";

export const personalDetailsSchema = z.object({
  name: zodStringRequired({
    field: "name",
    showingFieldName: "Name",
    min: 2,
    max: 50,
    blockMultipleSpaces: true,
  }),
  email: zodStringRequired({
    field: "email",
    showingFieldName: "Email",
    blockSingleSpace: true,
    customRegexes: [{ regex: regexes.validEmail, message: "must be valid" }],
  }),
  phoneNumber: zodStringRequired({
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
});

export const businessDetailsSchema = z.object({
  name: zodStringRequired({
    field: "name",
    showingFieldName: "Name",
    min: 2,
    blockMultipleSpaces: true,
  }),
  email: zodStringRequired({
    field: "email",
    showingFieldName: "Email",
    blockSingleSpace: true,
    customRegexes: [{ regex: regexes.validEmail, message: "must be valid" }],
  }),
  phoneNumber: zodStringRequired({
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
  category: zodEnums({
    enums: ALLOWED_BUSINESSES,
    field: "category",
    showingFieldName: "Business Category",
  }),
});

export const businessDetailsAddressSchema = z.object({
  address: zodStringRequired({
    field: "address",
    showingFieldName: "Address",
    blockMultipleSpaces: true,
    min: 2,
  }),
  landmark: zodStringOptional({
    field: "Landmark",
    showingFieldName: "Address",
    blockMultipleSpaces: true,
    min: 2,
    nonEmpty: false,
  }),
  city: zodStringRequired({
    field: "city",
    showingFieldName: "City",
    blockMultipleSpaces: true,
    min: 2,
  }),
  state: zodEnums({
    field: "state",
    showingFieldName: "State/Province",
    enums: STATES_AND_UNION_TERRITORIES,
  }),
  pinCode: zodStringRequired({
    field: "pinCode",
    showingFieldName: "Pin Code",
    blockSingleSpace: true,
    min: 6,
    max: 6,
    customRegexes: [
      {
        regex: regexes.validPinCode,
        message: "must be exactly 6 digits, valid pin code",
      },
    ],
  }),
  country: zodEnums({
    field: "country",
    showingFieldName: "Country",
    enums: ALLOWED_COUNTRIES,
  }),
  pan: zodStringRequired({
    field: "pan",
    showingFieldName: "PAN Number",
    customRegexes: [{ regex: regexes.validPan, message: "must be valid" }],
  }),
  gst: zodStringRequired({
    field: "gst",
    showingFieldName: "GST Number",
    blockSingleSpace: true,
    nonEmpty: false,
    min: 15,
    max: 15,
    customRegexes: [
      {
        regex: regexes.validGST,
        message: "Please provide a valid GST number",
      },
    ],
  }),
});

const fileValidation = (field: string, showingFieldName?: string) =>
  z.unknown().superRefine((file, ctx) => {
    zodFileOrUrl({
      fileOrUrl: file,
      field,
      showingFieldName,
      ctx,
      maxImageFileSize: 0.2 * MB,
    });
  });
export const requiredDocumentsSchema = z.object({
  gst: fileValidation("gst", "GST Registration Certificate"),
  itr: fileValidation("itr", "Income Tax Proof"),
  businessAddressProof: fileValidation(
    "businessAddressProof",
    "Business Address Proof"
  ),
});

export const becomeSellerBaseSchema = z.object({
  personalDetails: personalDetailsSchema,
  businessDetails: businessDetailsSchema,
  businessAddress: businessDetailsAddressSchema,
  requiredDocuments: requiredDocumentsSchema,
});

export const becomeSellerSchema = becomeSellerBaseSchema.extend({
  agreeTerms: z
    .boolean()
    .refine((val) => val, "You must accept terms & conditions."),
});
