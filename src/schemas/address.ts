import z from "zod";
import { zodEnums, zodStringOptional, zodStringRequired } from "../utils/zod";
import {
  ADDRESS_TYPES,
  ALLOWED_COUNTRIES,
  regexes,
  STATES_AND_UNION_TERRITORIES,
} from "../constants";

export const addAddressSchema = z.object({
  type: zodEnums({
    field: "type",
    showingFieldName: "Address Type",
    enums: ADDRESS_TYPES,
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
  email: zodStringRequired({
    field: "email",
    showingFieldName: "Email",
    blockSingleSpace: true,
    customRegexes: [{ regex: regexes.validEmail, message: "must be a valid" }],
  }),
  altPhoneNumber: zodStringOptional({
    field: "altPhoneNumber",
    showingFieldName: "Alternate phone number",
    blockSingleSpace: true,
    nonEmpty: false,
    customRegexes: [
      { regex: regexes.phoneStart, message: "must start with 6, 7, 8, or 9" },
      { regex: regexes.phoneExactLength, message: "must be exactly 10 digits" },
      {
        regex: regexes.validPhone,
        message: "must be exactly 10 digits and must start with 6, 7, 8, or 9",
      },
    ],
  }),
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
  gst: zodStringOptional({
    field: "gst",
    showingFieldName: "GST Number",
    blockSingleSpace: true,
    nonEmpty: false,
    min: 15,
    max: 15,
    customRegexes: [
      { regex: regexes.validGST, message: "Please provide a valid GST number" },
    ],
  }),
});
