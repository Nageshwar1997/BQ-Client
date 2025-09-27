import Input from "../../../components/input/Input";
import Radio from "../../../components/input/Radio";
import Select from "../../../components/input/Select";
import { STATES_AND_UNION_TERRITORIES } from "../../../constants";

const AddressForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <Radio
        onChange={(value) => console.log(value)}
        options={[
          { label: "Billing", value: "billing" },
          { label: "Shipping", value: "shipping" },
          { label: "Both", value: "both" },
        ]}
        value={""}
      />
      <Input
        label="First Name"
        inputProps={{ name: "firstName", type: "text" }}
      />
      <Input
        label="Last Name"
        inputProps={{ name: "lastName", type: "text" }}
      />
      <Input label="Email" inputProps={{ name: "email", type: "text" }} />
      <Input
        label="Phone Number"
        inputProps={{ name: "phoneNumber", type: "text" }}
      />
      <Input
        label="Alternate Phone Number"
        inputProps={{ name: "altPhoneNumber", type: "text" }}
      />
      <Input label="Address" inputProps={{ name: "address", type: "text" }} />
      <Input label="Landmark" inputProps={{ name: "landmark", type: "text" }} />
      <Input label="City" inputProps={{ name: "city", type: "text" }} />
      <Select
        label="State/Union Territory"
        options={STATES_AND_UNION_TERRITORIES.map((state) => ({
          name: state,
          value: state,
        }))}
        selectProps={{ value: "", placeholder: "Select State/Union Territory" }}
      />
      <Input
        label="Pin Code"
        inputProps={{ name: "pinCode", type: "number" }}
      />
      <Input
        label="GST Number (Optional)"
        inputProps={{ name: "gst", type: "text" }}
      />
      <Select
        label="Country"
        options={[{ name: "India", value: "India" }]}
        selectProps={{
          value: "India",
          placeholder: "Select Country",
          disabled: true,
        }}
      />
    </div>
  );
};

export default AddressForm;
