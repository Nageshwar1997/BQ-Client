import type {
  InputHTMLAttributes,
  ReactNode,
  RefObject,
  ButtonHTMLAttributes,
  JSX,
  SVGProps,
} from 'react';
import { z } from 'zod';
import type {
  loginSchema,
  newPasswordSchema,
  otpSchema,
  resetPasswordSchema,
  setPasswordSchema,
} from '../schema/auth.schema';
import type {
  profileSchema,
  linkSchema,
  colorsSchema,
  typographySchema,
  assetsSchema,
  vibeSchema,
  updateVibeSchema,
  updateGeneralSchema,
  updateBrandProfileSchema,
} from '../schema/settings.schema';
import React from 'react';
import type { tryOnSchema } from '../pages/virtual-tryon/component/Schema';
import type {
  Control,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  UseFormGetValues,
} from 'react-hook-form';
import type { ProductFormData } from './api.types';
import type { AssetItem } from '../components/ImageUploader';
import type { IToastCard } from '../components/AlertCards/ToastCard';
import * as THREE from 'three';
import type { fashionTryOnSchema } from '../pages/fashion-tryon/components/FashionSchema';

export type TIcon = SVGProps<SVGSVGElement>;

export type IconType = JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>;
export type AssetLibraryItemInteractionVariant = 'linkable' | 'selectable';

export interface AssetLibraryItemProps {
  _id?: string;
  id?: string;
  image?: string;
  modelUrl: string;
  linkedProductId?: string;
  fileType: string;
  productNameLinkedTo: string | null;
  fileSize: string;
  title: string;
  category: { name: string; _id: string } | null;
  liveUrl?: string | null;
  onDownload?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAddToProduct?: (id: string) => void;
  onUnlinkFromProduct?: (data: { assetId: string; productId: string }) => void;
  onMoreOptions?: () => void;
  onCTA?: () => void;
  onCreateExperience?: (id: string) => void;
  isExperience?: boolean;
  productToAdded?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  isAIGenerated?: boolean;
  moduleCategory?: {
    title: string;
    variant: string;
    count?: number;
  }[];
  spriteUrl?: string;
  thumbnailUrl?: string;
  environmentName?: string;
  className?: string;
  viewType?: 'list' | 'grid';
  interactionVariant?: AssetLibraryItemInteractionVariant;
}

type SubscriptionType = 'free' | 'premium' | 'enterprise';

export type ModeValue = 'fast' | 'turbo' | 'large';
export type TextureSize = '2048' | '3072' | '4096';
export type DecimationTarget = '100000' | '50000' | '20000' | '10000';

export interface TabData {
  id: number | string;
  title?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  color?: string;
  count?: number;
  subscriptionType?: SubscriptionType;
  disabled?: boolean;
  value?: string;
}

export interface IModelProps {
  settings: VisualizerProps;
  url: string;
  description?: string;
  onLoaded?: () => void;
  onError?: (error: string) => void;
  viewer?: boolean;
  scenePreset?: CanvasScenePreset;
  isImmersivePdpPresentation?: boolean;
}

export type TabVariant = 'static' | 'gradient' | 'toggle' | 'pill';

export interface TabProps {
  data: TabData[];
  variant?: TabVariant;
  defaultActiveId?: TabData['id'];
  className?: string;
  selectedClassName?: string;
  onClick?: (item: TabData) => void;
}

export interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
}

export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type'
> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export interface DualSliderProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  clampToBounds?: boolean;
}

export interface ICameraControlsProps {
  settings: VisualizerProps;
  modelCenter: THREE.Vector3;
  viewer?: boolean;
  modelBoundingRadius?: number;
  scenePreset?: CanvasScenePreset;
  isImmersivePdpPresentation?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  containerClassName?: string;
  // type: 'text' | 'password' | 'email' | 'number';
}

export type ImageInputProps = {
  onChange: (file: FileList | null) => void;
  onClose: () => void;
  label: string;
  description: string;
  errorText?: string;
  validTypes?: string[];
  className?: string;
  previewImage?: string;
} & (
  | { variant?: 'general-social' | 'brand-kit' | 'default' }
  | { variant: 'general-favicon'; baseImage: string }
);

export interface IconInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  label?: string;
  error?: string;
  placeholder?: string;
  containerClassName?: string;
  onChange?: (value: string) => void;
  // type: "text" | "password" | "email" | "number" | "color";
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export interface TagInputProps {
  label: string;
  placeholder?: string;
  setValue: (value: string[]) => void;
  errorText?: string;
  selectedTagsData?: { value: string }[];
  className?: string;
  multiSelect?: boolean;
  disabled?: boolean;
}

export type RotationalAxis = { x: boolean; y: boolean; z: boolean };
export type PresetName = 'Minimal' | 'Outdoor' | 'Sky' | 'Snow';
export type envType = 'preset' | 'custom';
export type Vector2 = { x: number; y: number };
export type Vector3 = { x: number; y: number; z: number };
export type CanvasScenePreset = 'default' | 'immersive-pdp';

export interface VisualizerProps {
  modelFile: File | null;
  modelUrl?: string | null;
  assetData?: Array<{
    assetId: string | null;
    modelUrl: string;
  }>;
  modelTransform: {
    scale: number;
    rotation: Vector3;
    rotationAxis: RotationalAxis;
    scalable: boolean;
    rotatable: boolean;
  };
  camera: {
    position: Vector3;
  };
  assetId: string[] | null;
  experienceId: string | null;
  shadowIntensity: number;
  shadowSoftness: number;
  arAnchor: 'floor' | 'wall';
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
    customEnvUrl: string | null;
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
    logo: File | null;
    position: string;
    offset: Vector2;
    opacity: number;
    scale: number;
  };
  menuPlacement: 'dock' | 'floating';
  textOnly: boolean;
  isImported?: boolean;
  importedProduct?: any | null;
  openModelLibrary?: boolean;
  variants: VariantField[];
  editingEdition?: { vIdx: number; eIdx: number } | null;
}
export type ButtonSize = 'sm' | 'md';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'outline'
  | 'link'
  | 'gradient';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  content?: string;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

export type AuthStep =
  | 'EMAIL'
  | 'LOGIN_PASSWORD'
  | 'SIGNUP_OTP'
  | 'FORGOT_PASSWORD_OTP'
  | 'RESET_PASSWORD'
  | 'SET_PASSWORD';

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
export type UpdateBrandProfileFormData = z.infer<
  typeof updateBrandProfileSchema
>;
export type LinkFormData = z.infer<typeof linkSchema>;
export type ColorsFormData = z.infer<typeof colorsSchema>;
export type TypographyFormData = z.infer<typeof typographySchema>;
export type AssetsFormData = z.infer<typeof assetsSchema>;
export type VibeFormData = z.infer<typeof vibeSchema>;
export type UpdateVibeFormData = z.infer<typeof updateVibeSchema>;
export type UpdateGeneralFormData = z.infer<typeof updateGeneralSchema>;
export type DomainFormData = NonNullable<
  UpdateGeneralFormData['domains']
>[number];

export type SidebarItem = {
  id: string;
  title: string;
  path: string;
  icon: string | React.ReactNode;
  fillIcon?: React.ReactNode;
};

export type ChipPosition = 'top' | 'right' | 'bottom' | 'left';
export type ChipVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'outline'
  | 'outline-light'
  | 'gradient'
  | 'overlay';

export interface SidebarButtonProps {
  item: SidebarItem;
  isActive: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  showActiveStyle?: boolean;
  chipPosition?: ChipPosition;
}

export type THeaderVariant =
  | '3d-visualizer'
  | 'ar-experience'
  | 'virtual-try-on'
  | 'versa-ai'
  | 'configurator'
  | 'storefront'
  | 'video-ad'
  | 'social';

// Module types for experience type Enum
export type TModules =
  | '3d_visualizer'
  | 'ar_experience'
  | '3d_configurator'
  | 'fashion_tryon'
  | 'beauty_tryon'
  | 'immersive_store';

export type LoaderVariant = 'home' | THeaderVariant;

export interface LoaderProps {
  section?: LoaderVariant;
  className?: string;
}

export interface UseOutsideClickParams<T extends HTMLElement> {
  ref: RefObject<T | null> | Array<RefObject<T | null>>;
  handler: (event: MouseEvent | TouchEvent) => void;
  enabled?: boolean;
}

export interface ProductHeaderProps {
  module: TModules;
  settings: VisualizerProps;
  experienceId?: string;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
}
export type TModelTransform = {
  scale: number;
  rotation: Vector3;
};

export interface IConfigModel {
  id: string;
  url: string;
  name: string;
  modelTransform: TModelTransform;
}

export interface IValidatedModelProps {
  url: string;
  settings: VisualizerProps;
  onLoaded?: () => void;
  viewer?: boolean;
  scenePreset?: CanvasScenePreset;
  isImmersivePdpPresentation?: boolean;
}
export interface ModuleData {
  id: string;
  title: string;
  desc: string;
  icon: string;
  bgImage?: string;
  className: string;
  selectedClassName: string;
  path?: string;
}

export interface ModuleCardProps {
  module: ModuleData;
  selectable?: boolean;
  selected?: boolean;
  direction?: 'row' | 'column';
  onSelect?: (module: ModuleData) => void;
  moduleClassName?: string;
}

export type ExperienceType =
  | '3d-visualizer'
  | 'ar-experience'
  | 'configurator'
  | 'virtual-storefront'
  | 'virtual-try-on'
  | 'video-ads';

export type ExperienceStatus = 'PUBLISHED' | 'DRAFT';

export interface Experience {
  id: string;
  title: string;
  productId: string;
  type: ExperienceType;
  status: ExperienceStatus;
  views: number;
  ctr: number;
  lastUpdated: string;
  icon: ReactNode;
}
export type AssetType = 'generatedImages' | 'uploadedImages' | '3dModel';
export interface Asset {
  id: string;
  productId: string;
  title: string;
  lastUpdated: string;
  filesize: string;
  category: string;
  productName: string;
  image: string;
  imageKey?: string;
  format: string;
  icons: string[];
  assetType: AssetType;
  section?: string;
  iconColor?: string[];
}
export type TQueryParams = Partial<Record<string, string>>;
export type TTryOnMode = 'live' | 'upload';
export type TRunningMode = 'VIDEO' | 'IMAGE';
export type TLip = 'matte' | 'shimmer' | 'glossy' | 'crayon';
export type TEyeliner = 'pattern1' | 'pattern2' | 'pattern3';
export type TKajal = 'pattern1' | 'pattern2';
export type TTryOn =
  | 'Lipstick'
  | 'Foundation'
  | 'Blush'
  | 'Eyeliner'
  | 'Eyeshadow'
  | 'Eyebrow'
  | 'Kajal'
  | 'Haircare'
  | 'Others';

export type ColorTuple = [number, number, number, number];
export type TEyeIndicesPoints = {
  points: number[];
  width: number[];
  webCamWidth: number[];
};

export type TBaseMakeupState = {
  cameraReady?: boolean;
  imageReady?: boolean;
  tryOnStarted?: boolean;
  error?: string;
};

export interface ILipstickState extends TBaseMakeupState {
  type?: TLip | null;
  color: string | null;
  range: number;
}

export interface IFoundationState extends TBaseMakeupState {
  type: null;
  color: string | null;
  range: number;
}

export interface IEyelinerState extends TBaseMakeupState {
  type?: TEyeliner | null;
  color: string | null;
  range: number;
}
export interface IKajalState extends IEyelinerState {
  type?: TKajal | null;
}

export type IBlushState = IFoundationState;
export type IEyeshadowState = IBlushState;
export type IEyebrowState = IEyeshadowState;

export interface ITryOnBaseRef {
  setMakeupState: (state: Partial<TTryOnState>) => void;
  getState: () => TTryOnState | undefined;
  takeSnapShot: () => void;
  resetState: () => void;
  onSourceChange: () => void;
  setComparePosition: (value: number | null) => void;
  getCanvas?: () => HTMLCanvasElement | null;
}

export interface ITryOnLiveRef extends ITryOnBaseRef {
  stopCamera: () => void;
  startCamera: () => Promise<void>;
  restartCamera: () => Promise<void>;
  getStream: () => MediaStream | null;
}

export interface ITryOnUploadRef extends ITryOnBaseRef {
  loadImage: (url: string) => void;
}

export type TTryOnState =
  | ILipstickState
  | IFoundationState
  | IBlushState
  | IEyelinerState
  | IEyebrowState
  | IKajalState
  | IEyeshadowState;

export interface ITryOnCommonRef {
  /* ========== CORE MAKEUP STATE ========== */

  /** Apply / update makeup state (color, range, type, etc.) */
  setMakeupState: (state: Partial<TTryOnState>) => void;

  setComparePosition: (value: number | null) => void;

  /** Hard reset to initial try-on state */
  resetState: () => void;

  /* ========== SOURCE / MODE LIFECYCLE ========== */

  /**
   * Called when source changes:
   * live ↔ upload
   * camera ↔ photo
   * model select
   */
  onSourceChange: () => void;

  /* ========== CAMERA CONTROLS (LIVE MODE ONLY) ========== */

  /** Start webcam stream */
  startCamera?: () => Promise<void> | void;

  /** Stop webcam + release tracks */
  stopCamera?: () => void;

  /** Restart camera (permission retry / error recovery) */
  restartCamera?: () => Promise<void> | void;

  /** Get active MediaStream for thumbnails / preview */
  getStream?: () => MediaStream | null;

  /* ========== OPTIONAL OUTPUT ACTIONS ========== */

  /** Capture snapshot (photo / compare / download) */
  takeSnapshot?: () => void;
  getCanvas?: () => HTMLCanvasElement | null;
}

export type TTryOnForm = z.infer<typeof tryOnSchema>;
export type TFashionTryOnForm = z.infer<typeof fashionTryOnSchema>;
export interface CreateExperimentModalProps {
  open: boolean;
  onClose: () => void;
  image?: string;
  spriteImage?: string;
  previewAlt?: string;
  assetId?: string | null;
  rightSection: {
    title: string;
    ctaLabel: string;
    modules: ModuleData[];
  };
  onCreate: (data: {
    selectedModule: ModuleData;
    assetId?: string | null;
  }) => void;
  leftClassName?: string;
  rightClassName?: string;
}

export interface DeleteAssetModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  image?: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  confirmTitle?: string;
  confirmButtonLabel?: string;
  confirmButtonLoadingLabel?: string;
  successTitle?: string;
  closeButtonLabel?: string;
  showSuccessStep?: boolean;
  className?: string;
}
export interface MenuItemProps {
  icon?: string | ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
  menuItemClassName?: string;
  showDividerAbove?: boolean;
  showDividerBelow?: boolean;
  dividerClassName?: string;
}

export interface MoreOptionsMenuProps {
  menuItems: MenuItemProps[];
  triggerClassName?: string;
  menuClassName?: string;
  onClick?: () => void;
  triggerIcon?: string;
  triggerContent?: ReactNode | ((args: { isMenuOpen: boolean }) => ReactNode);
  rotateTriggerOnOpen?: boolean;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  showDividerAbove?: boolean;
}

export interface ModuleCount {
  variant: string;
  count?: number;
}

export interface ExperienceSectionProps {
  modules: ModuleCount[];
  isSelected?: boolean;
  showHover?: boolean;
}

export interface EditionListProps {
  variantIndex: number;
  activeTabId: string;
  fields: { id: string }[];
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  getValues: UseFormGetValues<ProductFormData>;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  uploadedAssets: AssetItem[];
  setValue: UseFormSetValue<ProductFormData>;
  variantTypeLabel: string;
}

export interface FashionEditionListProps {
  productIndex: number;
  id: string;
  onRemove: (index: number) => void;
  variantTypeLabel: string;
  isSelected?: boolean;
  onPreviewSelect?: (index: number) => void;
  onViewSelect: (id: string) => void;
  draggingIdx?: number | null;
  overIdx?: number | null;
  rowProps?: {
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
  };
  gripProps?: {
    draggable: true;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
}

export interface Edition {
  name: string;
  imageUrl: string;
  color: string;
  visible: boolean;
  modelUrl?: string | null;
  modelId?: string | null;
  modelFile?: File | null;
  modelTransform?: TModelTransform;
}

export interface VariantField {
  selectedType: string;
  activeTabId: string;
  editions: Edition[];
  customType?: string;
}

export interface FilterOption {
  id: string;
  value: string;
  label: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  default?: boolean;
}

export interface SaveWarnMetricCard {
  title: string;
  subtitle: string;
  description: string;
}

export interface SaveWarnModalProps {
  open?: boolean;
  showLeftsection?: boolean;
  showLeftSection?: boolean;
  className?: string;
  contentClassName?: string;
  leftSectionClassName?: string;
  rightSectionClassName?: string;
  onClose?: () => void;
  onContinueEditing?: () => void;
  onSaveExit?: () => void;
  onDiscardChanges?: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  highlightTitle?: ReactNode;
  checklist?: string[][];
  metrics?: SaveWarnMetricCard[];
  continueLabel?: string;
  showContinueButton?: boolean;
  saveExitLabel?: string;
  discardLabel?: string;
  discardButtonClassName?: string;
  footerText?: ReactNode;
  disableActions?: boolean;
  disableClose?: boolean;
  isSaveExitLoading?: boolean;
}

export interface Get3DAssetsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortOrder?: 'asc' | 'desc';
  experienceType?: string;
  assetType?: string;
  fileType?: string;
  productId?: string;
}

export interface GetManageExperiencesParams {
  search?: string;
  categoryId?: string;
  sort?: 'asc' | 'desc';
  type?: 'tagged' | 'untagged';
  page?: number;
  limit?: number;
}
// settings

export type FlatFont = {
  name: string;
  weight: number;
  style: 'normal' | 'italic';
};

export type ModuleType = {
  title: string;
  link: string;
  count: number;
  type: string;
};

export type ExperienceCardType = {
  image: string;
  title: string;
  category: string;
  price: string;
  discount?: { originalPrice: string; percentage: string };
  modules: ModuleType[];
};

export type ToastCardProps = IToastCard | undefined;

export type PlanId = 'free' | 'pro' | 'business' | 'enterprise';

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'EUR';

type PlanModule = {
  label: string;
  icon: string;
  colorClass: string;
};

type PlanAllowance = {
  values: string[];
  allowSelection: boolean;
};

export type Plan = {
  id: PlanId;
  name: string;
  subtitle: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  priceMeta?: string;
  cardHeight: string;
  ctaLabel: string;
  ctaStyle: 'neutral' | 'brand';
  featured?: boolean;
  badgeLabel?: string;
  showAllowanceField?: boolean;
  allowance?: PlanAllowance;
  featureHeading: string;
  modules: PlanModule[];
  checklist: string[];
};

export interface SelectedOption {
  id: string;
  value: string;
  label: string;
}

export interface FilterDropdownProps {
  innerLabel?: string;
  outerLabel?: string;
  placeholder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  options?: FilterOption[];
  multiple?: boolean;
  value?: string | string[] | null;
  onChange?: (value: SelectedOption | SelectedOption[] | null) => void;
  className?: string;
  error?: string;
  menuPosition?: 'top' | 'bottom' | 'left' | 'right';
  menuAlign?: 'start' | 'end' | 'center';
  menuClassName?: string;
  menuWidth?: string;
  menuOffset?: number;
  fitMenuToContent?: boolean;
  footerActionLabel?: string;
  footerActionIcon?: ReactNode;
  onFooterAction?: () => void;
  footerAction?: ReactNode;
}

// ===== Variant Types =====
export type VariantEnumType = 'colour' | 'texture' | 'size' | 'other';
export type VariantEditionType = 'pipette' | 'image';
type TImage = {
  key: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
  url: string;
};

type TVideo = TImage;
type TModel3D = {
  assetId: string; // MongoDB ObjectId ref to AssetLibrary
  title: string; // Asset title for display
  thumbnailKey?: string;
  thumbnailUrl?: string;
  spriteUrl?: string;
};

type TPrice = { amount: number; currency: string };
type TMedia = {
  images: Array<TImage>;
  videos: Array<TVideo>;
  models3d: Array<TModel3D>;
};

export interface PipetteEdition {
  type: 'pipette';
  name: string;
  hexColor: string;
}

export interface ImageEdition {
  type: 'image';
  name: string;
  mediaIndex: number; // Reference to media.images index
}

export type VariantEdition = PipetteEdition | ImageEdition;

export interface Variant {
  type: VariantEnumType; // 'colour' | 'texture' | 'size' | 'other'
  name?: string | null;
  editions: VariantEdition[]; // pipette | image
}

export interface IProductResponse {
  _id: string;
  productName: string;
  productId: string;
  slug: string;
  description: string;
  productLink: string;
  subcategory: string;
  media: TMedia;
  variants: Array<Variant>;
  price: TPrice;
  isActive: true;
  createdBy: unknown; // TODO: define user type
  isDeleted: boolean;
  deletedAt: string | null;
  experiences: Array<{ type?: string; count?: number }>;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
}

export type TCategory = {
  _id: string;
  name: string;
  subcategories: Array<{ name: string; _id: string }>;
};

export type PublishStatus = 'Not Published' | 'Publishing' | 'Published';
export type OverlayState = 'none' | 'options' | 'modal' | 'save-warn';

export interface PhoneData {
  countryCode: string;
  number: string;
}

export interface SendPhoneOtpPayload {
  phone: PhoneData;
}

export interface VerifyPhoneOtpPayload {
  phone: PhoneData;
  otp: string;
}
export interface QueueVersaImagePayload {
  prompt: string;
}

export interface QueueVersaImageResponse {
  success: boolean;
  data: {
    jobId: string;
    status: 'queued' | string;
    queuePosition?: number;
    estimatedWaitSec?: number;
  };
}

export interface VersaGeneratedImage {
  data_url: string;
  mime_type: string;
  image_base64: string;
}

export interface VersaImageResultReady {
  images: VersaGeneratedImage[];
  sample_count?: number;
  data_url?: string;
  mime_type?: string;
  image_base64?: string;
}

export interface VersaImageResultPending {
  ready: false;
}

export interface VersaImageResultError {
  message: string;
  retryAfterSec?: number;
}

export interface VersaImageResultResponse {
  success: boolean;
  data?: VersaImageResultReady | VersaImageResultPending;
  error?: VersaImageResultError;
}

export interface Attach3DAssetMediaPayload {
  assetId: string;
  data: FormData;
}

export interface PromptTo3DPayload {
  prompt: string;
  mode: string;
  remesh: boolean;
  texture_size: string;
  decimation_target: string;
  assetId?: string;
}

export interface ImageItem {
  file?: File | null;
  url: string;
  name: string;
  remoteUrl?: string;
  fallbackUrl?: string;
}

export interface VersaAiLocationState {
  prefillImageUrl?: string;
  prefillImageFallbackUrl?: string;
  prefillImageName?: string;
}

export interface FormValues {
  images: ImageItem[];
  promptText: string;
  modelType: TabData['id'];
  meshOptimization: boolean;
  textureSize: TabData['id'];
  triTargets: TabData['id'];
}

export interface IResult {
  thumbnail: string;
  assetId: string;
  versionId?: string;
  productTitle: string;
  data: { name: string; url: string }[];
  spriteUrl?: string;
}
export type ProductPreviewCardProps = {
  image: string;
  productName: string;
  description: string;
  price: string;
  compact?: boolean;
};

export type InputTo3DMode = 'single' | 'multiview';
export type VersaJobType = 'generate' | 'regenerate' | null;
