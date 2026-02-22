import { Link } from 'react-router-dom';
import {
  ALLOWED_BUSINESSES,
  ALLOWED_COUNTRIES,
  ALLOWED_IMAGE_FORMATS,
  STATES_AND_UNION_TERRITORIES,
} from '../../../constants';
// import { TBecomeSellerForm } from '../../../types';

export const becomeSellerFormMapData: TBecomeSellerForm = {
  personalDetails: [
    {
      name: 'name',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      type: 'text',
      autoComplete: 'name',
      disabled: true,
    },
    {
      name: 'email',
      label: 'Personal Email',
      placeholder: 'Enter your email address',
      type: 'email',
      autoComplete: 'email',
      disabled: true,
    },
    {
      name: 'phoneNumber',
      label: 'Personal Number',
      placeholder: 'Enter your phone number',
      type: 'number',
      autoComplete: 'tel',
      disabled: true,
    },
  ],
  businessDetails: [
    {
      name: 'name',
      label: 'Business Name',
      placeholder: 'Enter business name',
      type: 'text',
      autoComplete: 'organization',
    },
    {
      name: 'email',
      label: 'Business Email',
      placeholder: 'Enter business email address',
      type: 'email',
      autoComplete: 'email',
    },
    {
      name: 'phoneNumber',
      label: 'Business Contact Number',
      placeholder: 'Enter business contact number',
      type: 'number',
      autoComplete: 'tel',
    },
    {
      name: 'category',
      label: 'Business Category',
      placeholder: 'Select business category',
      type: 'select',
      options: ALLOWED_BUSINESSES.map((item) => ({
        name: item,
        value: item,
      })),
      autoComplete: 'organization-title',
    },
  ],
  businessAddress: [
    {
      name: 'address',
      label: 'Address',
      placeholder: 'Enter business address',
      type: 'text',
      autoComplete: 'street-address',
    },
    {
      name: 'landmark',
      label: 'Landmark (Optional)',
      placeholder: 'Enter landmark',
      type: 'text',
      autoComplete: 'address-line2',
    },
    {
      name: 'city',
      label: 'City',
      placeholder: 'Enter city',
      type: 'text',
      autoComplete: 'address-level2',
    },
    {
      name: 'state',
      label: 'State/Province',
      placeholder: 'Select state',
      type: 'select',
      options: STATES_AND_UNION_TERRITORIES.map((state) => ({
        name: state,
        value: state,
      })),
      autoComplete: 'address-level1',
    },
    {
      name: 'pinCode',
      label: 'Pin/Zip Code',
      placeholder: 'Enter pin/zip code',
      type: 'number',
      autoComplete: 'postal-code',
    },
    {
      name: 'country',
      label: 'Country',
      placeholder: 'Select country',
      type: 'select',
      options: ALLOWED_COUNTRIES.map((country) => ({
        name: country,
        value: country,
      })),
      disabled: true,
      autoComplete: 'country-name',
    },
    {
      name: 'pan',
      label: 'PAN Number',
      placeholder: 'Enter PAN number',
      type: 'text',
      autoComplete: 'organization-pan-id',
    },
    {
      name: 'gst',
      label: 'GST Number',
      placeholder: 'Enter GST number',
      type: 'text',
      autoComplete: 'organization-tax-id',
    },
  ],
  requiredDocuments: [
    {
      name: 'gst',
      label: 'GST Registration Certificate',
      placeholder: 'Upload GST certificate',
      type: 'file',
      autoComplete: 'off',
    },
    {
      name: 'itr',
      label: 'Income Tax Proof',
      placeholder: 'Upload Income Tax proof',
      type: 'file',
      autoComplete: 'off',
    },
    {
      name: 'addressProof',
      label: 'Business Address Proof (Any 1)',
      placeholder: 'Upload Business Address proof',
      type: 'file',
      autoComplete: 'off',
    },
    {
      name: 'geoTagging',
      label: 'Geo-Tagging Image',
      placeholder: 'Upload Shop Image With Geo-Tagging',
      type: 'file',
      autoComplete: 'off',
    },
  ],
};

export const becomeSellerDefaultValues = {
  personalDetails: {
    name: '',
    email: '',
    phoneNumber: '',
  },
  businessAddress: {
    address: '',
    city: '',
    state: '',
    country: 'India',
    gst: '',
    landmark: '',
    pan: '',
    pinCode: '',
  },
  requiredDocuments: {
    gst: undefined,
    itr: undefined,
    addressProof: undefined,
    geoTagging: undefined,
  },
  businessDetails: { category: '', email: '', name: '', phoneNumber: '' },
  agreeTerms: false,
};

const commonInstructions = [
  'Ensure that the document is clear and legible, with all details visible.',
  <>
    Upload the document in{' '}
    <span className="font-medium text-wrap">
      {ALLOWED_IMAGE_FORMATS.map((type) => type.split('/')[1].toUpperCase()).join(', ')}
    </span>{' '}
    format.
  </>,
  <>
    The maximum file size allowed is <span className="font-medium">0.5 MB</span>.
  </>,
];

export const BECOME_A_SELLER_DOCUMENT_INSTRUCTIONS = {
  gst: {
    title: 'GST',
    instructions: [
      'The document must be a valid GST Registration Certificate issued by the Government of India.',
      'The document should include the GSTIN (Goods and Services Tax Identification Number), legal name of the business, and the date of registration.',
      ...commonInstructions,
    ],
    options: [],
  },
  itr: {
    title: 'ITR Proof',
    instructions: [
      'The document must be a valid Income Tax Return (ITR) acknowledgment or assessment order issued by the Income Tax Department of India.',
      'The document should include the PAN (Permanent Account Number) of the business or individual, assessment year, and the date of filing.',
      ...commonInstructions,
    ],
    options: [],
  },
  addressProof: {
    title: 'Address Proof',
    instructions: [
      'The document must be a valid address proof for the business, such as a utility bill, lease agreement, or property tax receipt.',
      'The document should include the business name, address, and date of issue.',
      ...commonInstructions,
    ],
    options: [
      'Utility Bill (Electricity, Water, Gas, Internet) not older than 3 months',
      'Lease or Rent Agreement',
      'Property Tax Receipt',
      'Bank Statement showing business address',
      'Government-issued Business License or Certificate',
      'Affidavit from a Gazetted Officer (if applicable)',
      'NOC from the Property Owner (if applicable)',
      'Certificate of Incorporation (for registered companies)',
      'Shop and Establishment License',
      'Municipal Khata Copy',
    ],
  },
  geoTagging: {
    title: 'Geo-Tagging',
    instructions: [
      'The image must clearly show the business location from the outside or nearby surroundings.',
      'Ensure that the location is accurate and corresponds to the business address provided.',
      'The image should be well-lit, focused, and free of obstructions.',
      'Include recognizable landmarks or building signage if possible to verify the location.',
      <>
        Use a trusted geo-tagging app such as{' '}
        <Link
          to="https://play.google.com/store/apps/details?id=com.gpsmapcamera.geotagginglocationonphoto"
          target="_blank"
          className="bg-accent-duo bg-clip-text font-medium text-transparent"
        >
          GPS Map Camera
        </Link>
        , or{' '}
        <Link
          to="https://play.google.com/store/apps/details?id=com.gonext.gpsphotolocation"
          target="_blank"
          className="bg-accent-duo bg-clip-text font-medium text-transparent"
        >
          GPS Photo
        </Link>{' '}
        to embed GPS coordinates in the image.
      </>,

      'Do not crop or edit the image in a way that removes location context.',
      ...commonInstructions,
    ],
    options: [],
  },
};
