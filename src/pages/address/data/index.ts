import { STATES_AND_UNION_TERRITORIES } from "../../../constants";
import { TAddressForm } from "../../../types";

export const addAddressFormMapData: Omit<TAddressForm, "isDefaultAddress">[] = [
  {
    name: "firstName",
    label: "First Name",
    placeholder: "Enter first name",
    autoComplete: "given-name",
    type: "text",
  },
  {
    name: "lastName",
    label: "Last Name",
    placeholder: "Enter last name",
    autoComplete: "family-name",
    type: "text",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter phone number",
    autoComplete: "tel",
    type: "number",
  },
  {
    name: "altPhoneNumber",
    label: "Alternate Phone Number (Optional)",
    placeholder: "Enter alternate phone number",
    autoComplete: "tel",
    type: "number",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter address",
    autoComplete: "address-line1",
    type: "text",
  },
  {
    name: "landmark",
    label: "Landmark (Optional)",
    placeholder: "Enter landmark",
    autoComplete: "address-line2",
    type: "text",
  },
  {
    name: "city",
    label: "City",
    placeholder: "Enter city",
    autoComplete: "address-level2",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter email",
    autoComplete: "email",
    type: "email",
  },
  {
    name: "pinCode",
    label: "Pin Code",
    placeholder: "Enter pin code",
    autoComplete: "postal-code",
    type: "number",
  },
  {
    name: "gst",
    label: "GST Number (Optional)",
    placeholder: "Enter GST number",
    autoComplete: "postal-code",
    type: "string",
  },
  {
    name: "state",
    label: "State/Province",
    placeholder: "Select state/Province",
    autoComplete: "address-level1",
    options: STATES_AND_UNION_TERRITORIES.map((state) => ({
      name: state,
      value: state,
    })),
  },
  {
    name: "country",
    label: "Country",
    placeholder: "Select country",
    autoComplete: "country",
    options: [{ name: "India", value: "India" }],
  },
];

export const addressInitialValues = {
  type: "both",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
  altPhoneNumber: "",
  city: "",
  country: "India",
  gst: "",
  landmark: "",
  pinCode: "",
  state: "",
  email: "",
  isDefaultAddress: false,
};
