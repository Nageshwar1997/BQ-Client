import type { envType, PresetName, RotationalAxis, Vector2, Vector3 } from '.';
import type { Media } from '../components/ImageUploader';

export type TproductData = {
  productName: string;
  category: string;
  basePrice: number;
  sellingPrice: number;
  description: string;
};

export type TvisualizerSettings = {
  modelTransform: {
    scale: number;
    rotation: Vector3;
    rotationAxis: RotationalAxis;
  };
  camera: {
    position: Vector3;
  };
  shadowIntensity: number;
  zoom: {
    min: number;
    max: number;
  };
  environment: {
    grounded: boolean;
    envHeight: number;
    envRadius: number;
    envScale: number;
    presetName: PresetName;
    envType: envType;
    customEnvName: string | null;
    envBgColor: string;
    lightIntensity: number;
  };
  ctaBtn: {
    enabled: boolean;
    position: string;
    btnColor: string;
    textColor: string;
    offset: Vector2;
    content: string;
    url: string;
  };
  brandLogo: {
    enabled: boolean;
    position: string;
    offset: Vector2;
    opacity: number;
    scale: number;
  };
};

export type TmodelFile = File | null;

export type TcustomEnvFile = File | null;

export type TbrandLogoFile = File | null;

export interface Upload3DAssetData {
  title: string;
  category: string;
  modelFile: File;
}

export interface DownloadFileOptions {
  url: string;
  filename?: string;
  extension?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export interface Category {
  _id: string;
  name: string;
  subcategories?: { _id?: string; name: string }[];
}

export interface Edition {
  name: string;
  imageUrl: string;
  color: string;
}

export interface VariantField {
  selectedType: string;
  activeTabId: string;
  editions: Edition[];
  customType?: string;
}

export interface ProductFormData {
  productName: string;
  productId: string;
  categoryId: string | null;
  price: string;
  productDescription: string;
  productSlug: string;
  productLink: string;
  subCategoryId?: string | null;
  media: Media;
  variants: VariantField[];
}

export interface ProductCMSItem {
  _id: string;
  productName?: string;
  productId?: string;
  slug?: string;
  description?: string;
  productLink?: string;
  subcategory?: string;
  media?: {
    images?: Array<{
      key?: string;
      filename?: string;
      url?: string;
      size?: number | string;
    }>;
    videos?: Array<{
      key?: string;
      filename?: string;
      url?: string;
      size?: number | string;
    }>;
    models3d?: Array<{
      assetId?:
        | string
        | { _id?: string; id?: string; assetId?: string; $oid?: string };
      title?: string;
      modelUrl?: string;
      spriteUrl?: string;
      thumbnailUrl?: string;
      size?: number | string;
      fileSize?: number | string;
    }>;
  };
  price?: {
    amount?: number;
    currency?: string;
  };
  category?: {
    id?: string | null;
    name?: string;
  };
  variants?: Array<{
    type?: string;
    name?: string;
    editions?: Array<{
      type?: 'pipette' | 'image';
      name?: string;
      hexColor?: string;
      mediaIndex?: number;
    }>;
  }>;
  experiences?: Array<{ type?: string; count?: number }>;
}

export interface CategoryOption {
  id: string;
  value: string;
  label: string;
}

export type CatalogPaidPlanKey = 'pro' | 'business';

export interface CatalogPlanPricePoint {
  itemPriceId: string;
  currencyCode: string;
  amount: number;
}

export interface CatalogPlanPricing {
  monthly: Partial<Record<string, CatalogPlanPricePoint>>;
  annual: Partial<Record<string, CatalogPlanPricePoint>>;
}

export interface SubscriptionPricingCatalogData {
  source: string;
  retrievedAt: string;
  plans: {
    pro?: CatalogPlanPricing;
    business?: CatalogPlanPricing;
  };
  displayHints?: {
    free?: { monthlyAmount: number; yearlyAmount: number };
    enterprise?: { pricingType: 'custom' };
  };
}

export interface SubscriptionPricingApiResponse {
  success: boolean;
  data: SubscriptionPricingCatalogData;
}

export type BillingCurrency = 'USD' | 'INR';

