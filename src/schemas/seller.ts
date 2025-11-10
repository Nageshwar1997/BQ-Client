import z from "zod";
import { zodEnums, zodStringOptional, zodStringRequired } from "../utils/zod";
import {
  ALLOWED_BUSINESSES,
  ALLOWED_COUNTRIES,
  regexes,
  STATES_AND_UNION_TERRITORIES,
} from "../constants";

export const becomeSellerSchema = z.object({
  personalDetails: z.object({
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
  }),
  businessDetails: z.object({
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
    address: z.object({
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
    }),
  }),
  agreeTerms: z
    .boolean()
    .refine((val) => val, "You must accept terms & conditions."),
});
