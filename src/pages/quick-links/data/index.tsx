import {
  ALLOWED_BUSINESSES,
  ALLOWED_COUNTRIES,
  STATES_AND_UNION_TERRITORIES,
} from "../../../constants";

export const becomeSellerFormMapData = {
  personalDetails: [
    {
      name: "personalDetails.name",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
      autoComplete: "name",
    },
    {
      name: "personalDetails.email",
      label: "Personal Email",
      placeholder: "Enter your email address",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "personalDetails.phoneNumber",
      label: "Personal Number",
      placeholder: "Enter your phone number",
      type: "number",
      prefixText: "+91",
      autoComplete: "tel",
    },
    {
      name: "personalDetails.password",
      label: "Password",
      placeholder: "Enter new password",
      type: "password",
      showToggle: true,
      autoComplete: "new-password",
    },
    {
      name: "personalDetails.confirmPassword",
      label: "Confirm Password",
      placeholder: "Re-enter your password",
      type: "password",
      showToggle: true,
      autoComplete: "new-password",
    },
  ],
  businessDetails: [
    {
      name: "businessDetails.name",
      label: "Business Name",
      placeholder: "Enter business name",
      type: "text",
      autoComplete: "organization",
    },
    {
      name: "businessDetails.email",
      label: "Business Email",
      placeholder: "Enter business email address",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "businessDetails.phoneNumber",
      label: "Business Contact Number",
      placeholder: "Enter business contact number",
      type: "number",
      prefixText: "+91",
      autoComplete: "tel",
    },
    {
      name: "businessDetails.category",
      label: "Business Category",
      placeholder: "Select business category",
      type: "select",
      options: ALLOWED_BUSINESSES.map((item) => ({
        name: item,
        value: item,
      })),
      autoComplete: "organization-title", // category-like autofill
    },
  ],
  businessAddress: [
    {
      name: "businessDetails.address.address",
      label: "Address",
      placeholder: "Enter business address",
      type: "text",
      autoComplete: "street-address",
    },
    {
      name: "businessDetails.address.landmark",
      label: "Landmark (Optional)",
      placeholder: "Enter landmark",
      type: "text",
      autoComplete: "address-line2",
    },
    {
      name: "businessDetails.address.city",
      label: "City",
      placeholder: "Enter city",
      type: "text",
      autoComplete: "address-level2",
    },
    {
      name: "businessDetails.address.state",
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
      name: "businessDetails.address.pinCode",
      label: "Pin/Zip Code",
      placeholder: "Enter pin/zip code",
      type: "number",
      autoComplete: "postal-code",
    },
    {
      name: "businessDetails.address.country",
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
      name: "businessDetails.address.pan",
      label: "PAN Number",
      placeholder: "Enter PAN number",
      type: "text",
      autoComplete: "organization-pan-id",
    },
    {
      name: "businessDetails.address.gst",
      label: "GST Number (Optional)",
      placeholder: "Enter GST number",
      type: "text",
      autoComplete: "organization-tax-id",
    },
  ],
};
