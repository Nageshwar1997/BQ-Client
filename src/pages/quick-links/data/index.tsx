import {
  ALLOWED_BUSINESSES,
  ALLOWED_COUNTRIES,
  STATES_AND_UNION_TERRITORIES,
} from "../../../constants";
import { TBecomeSellerForm } from "../../../types";

export const becomeSellerFormMapData: TBecomeSellerForm = {
  personalDetails: [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Personal Email",
      placeholder: "Enter your email address",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "phoneNumber",
      label: "Personal Number",
      placeholder: "Enter your phone number",
      type: "number",
      autoComplete: "tel",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter new password",
      type: "password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Re-enter your password",
      type: "password",
      autoComplete: "new-password",
    },
  ],
  businessDetails: [
    {
      name: "name",
      label: "Business Name",
      placeholder: "Enter business name",
      type: "text",
      autoComplete: "organization",
    },
    {
      name: "email",
      label: "Business Email",
      placeholder: "Enter business email address",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "phoneNumber",
      label: "Business Contact Number",
      placeholder: "Enter business contact number",
      type: "number",
      autoComplete: "tel",
    },
    {
      name: "category",
      label: "Business Category",
      placeholder: "Select business category",
      type: "select",
      options: ALLOWED_BUSINESSES.map((item) => ({
        name: item,
        value: item,
      })),
      autoComplete: "organization-title",
    },
  ],
  businessAddress: [
    {
      name: "address",
      label: "Address",
      placeholder: "Enter business address",
      type: "text",
      autoComplete: "street-address",
    },
    {
      name: "landmark",
      label: "Landmark (Optional)",
      placeholder: "Enter landmark",
      type: "text",
      autoComplete: "address-line2",
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter city",
      type: "text",
      autoComplete: "address-level2",
    },
    {
      name: "state",
      label: "State/Province",
      placeholder: "Select state",
      type: "select",
      options: STATES_AND_UNION_TERRITORIES.map((state) => ({
        name: state,
        value: state,
      })),
      autoComplete: "address-level1",
    },
    {
      name: "pinCode",
      label: "Pin/Zip Code",
      placeholder: "Enter pin/zip code",
      type: "number",
      autoComplete: "postal-code",
    },
    {
      name: "country",
      label: "Country",
      placeholder: "Select country",
      type: "select",
      options: ALLOWED_COUNTRIES.map((country) => ({
        name: country,
        value: country,
      })),
      autoComplete: "country-name",
    },
    {
      name: "pan",
      label: "PAN Number",
      placeholder: "Enter PAN number",
      type: "text",
      autoComplete: "organization-pan-id",
    },
    {
      name: "gst",
      label: "GST Number",
      placeholder: "Enter GST number",
      type: "text",
      autoComplete: "organization-tax-id",
    },
  ],
  requiredDocuments: [
    {
      name: "gst",
      label: "GST Registration Certificate",
      placeholder: "Upload GST certificate",
      type: "file",
      autoComplete: "off",
    },
    {
      name: "itr",
      label: "Income Tax Proof",
      placeholder: "Upload Income Tax proof",
      type: "file",
      autoComplete: "off",
    },
    {
      name: "businessAddressProof",
      label: "Business Address Proof (Any 1)",
      placeholder: "Upload Business Address proof",
      type: "file",
      autoComplete: "off",
    },
  ],
};

export const becomeSellerDefaultValues = {
  personalDetails: {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  },
  businessAddress: {
    address: "",
    city: "",
    state: "",
    country: "India",
    gst: "",
    landmark: "",
    pan: "",
    pinCode: "",
  },
  requiredDocuments: {
    gst: undefined,
    itr: undefined,
    businessAddressProof: undefined,
  },
  businessDetails: { category: "", email: "", name: "", phoneNumber: "" },
  agreeTerms: false,
};
