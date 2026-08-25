import { Icon } from '@iconify/react';
import Button from '../../../../components/Button';
import ColorInput from '../../../../components/Input/ColorInput';
import Slider from '../../../../components/Slider';
import DualSlider from '../../../../components/DualSilder';
import FileUploadButton from '../../../../components/FileUploadButton';
import type {
  InputProps,
  PresetName,
  SelectedOption,
  SliderProps,
  VisualizerProps,
  TModelTransform,
} from '../../../../types';
import {
  defaultSettings,
  ENV_PRESETS,
  HDRI_MAX_SIZE,
  VARIANT_DROPDOWN_OPTIONS,
  defaultVariant,
  defaultEdition,
} from '../../../../constants';
import { useState, useEffect, memo, useCallback, useRef } from 'react';
import {
  loadHDRToDataURL,
  disposeHDRIRenderer,
  clearHDRICache,
} from '../../../../lib/utils';
import { ToggleSwitch } from '../../../../components/ToggleSwitch';
import IconInput from '../../../../components/IconInput';
import { Tab } from '../../../../components/Tab';
import Input from '../../../../components/Input';
import FilterDropdown from '../../../../components/FilterDropdown';
import { CancelIcon } from '../../../../icons';
import {
  useUploadExperienceImages,
  useDeleteExperienceImage,
} from '../../../../services/experience-services';
import { ASSET_BASE_URL } from '../../../../env';

const variantTabs = [
  { id: 'image', leftIcon: <Icon icon="solar:gallery-minimalistic-linear" /> },
  { id: 'pipette', leftIcon: <Icon icon="solar:pipette-linear" /> },
];

interface ConfiguratorOptionsProps {
  commonSettings: VisualizerProps;
  onCommonSettingsChange: React.Dispatch<React.SetStateAction<VisualizerProps>>;
  modelTransform: TModelTransform | null;
  onModelTransformChange: (updatedTransform: TModelTransform) => void;
  onLogoClick?: () => void;
  cameraControl?: {
    setCameraPosition: () => void;
    preview: () => void;
  } | null;
}

interface InputComponentProps extends Omit<
  InputProps,
  'placeholder' | 'onChange'
> {
  variant?: 'left' | 'top';
  onChange?: (value: any) => void;
}

interface SliderComponentProps extends SliderProps {
  variant?: 'horizontal' | 'vertical';
  onReset?: () => void;
  labelClassName?: string;
}

const InputComponent = memo(
  ({
    variant = 'top',
    type,
    label,
    value,
    step,
    className,
    containerClassName,
    onChange,
  }: InputComponentProps) => (
    <div className="flex items-center gap-2">
      {variant == 'left' && label && (
        <span className="font-metropolis text-[12px]">{label}</span>
      )}
      {type === 'color' ? (
        <ColorInput
          label={variant == 'top' ? label : ''}
          value={value}
          onChange={onChange as any}
          className={`${className} px-3! py-2!`}
          containerClassName={containerClassName}
        />
      ) : (
        <IconInput
          type={type as any}
          step={step}
          label={variant == 'top' ? label : ''}
          placeholder={value?.toString() ?? ''}
          value={value}
          onChange={onChange as any}
          className={`bg-neutral-gray-100 ${className} px-3! py-2!`}
          containerClassName={containerClassName}
        />
      )}
    </div>
  )
);

const SliderComponent = memo(
  ({
    value,
    label,
    min,
    max,
    step,
    labelClassName,
    onChange,
    onReset,
  }: SliderComponentProps) => (
    <div className="font-metropolis flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <span className={`font-regular text-[12px] ${labelClassName}`}>
          {label}
        </span>
        <Icon
          icon="solar:restart-linear"
          width={16}
          height={16}
          className="text-neutral-gray-800 cursor-pointer"
          onClick={onReset}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-3">
          <Slider
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
          />
        </div>
        <div className="flex-1">
          <IconInput
            type="number"
            placeholder={value.toString()}
            value={value.toString()}
            step={step}
            onChange={(val) => onChange(Number(val))}
            className="px-3! py-2! font-normal!"
          />
        </div>
      </div>
    </div>
  )
);

const LineComponent = memo(() => (
  <div className="border-neutral-gray-400 my-5 border-t"></div>
));

const Section = memo(
  ({
    title,
    children,
    onReset,
    extraIcons,
    titleClassName,
  }: {
    title: string;
    children: React.ReactNode;
    titleClassName?: string;
    onReset?: () => void;
    extraIcons?: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <span
          className={`text-neutral-gray-900 text-[13px] font-semibold ${titleClassName}`}
        >
          {title}
        </span>
        <div className="flex items-center gap-2">
          {extraIcons}
          {onReset && (
            <Icon
              icon="solar:restart-linear"
              width={16}
              height={16}
              className="text-neutral-gray-800 cursor-pointer"
              onClick={onReset}
            />
          )}
        </div>
      </div>
      {children}
    </div>
  )
);

const TripleInput = memo(
  ({
    values,
    onChange,
  }: {
    values: { x: number; y: number; z: number };
    onChange: (axis: 'x' | 'y' | 'z') => (value: string) => void;
  }) => (
    <div className="grid grid-cols-3 gap-2">
      <InputComponent
        variant="left"
        label="X"
        type="number"
        step={1}
        value={values.x.toString()}
        onChange={(e: any) => onChange('x')(e)}
      />
      <InputComponent
        variant="left"
        label="Y"
        type="number"
        step={1}
        value={values.y.toString()}
        onChange={(e: any) => onChange('y')(e)}
      />
      <InputComponent
        variant="left"
        label="Z"
        type="number"
        step={1}
        value={values.z.toString()}
        onChange={(e: any) => onChange('z')(e)}
      />
    </div>
  )
);

const SegmentedControl = memo(
  ({
    value,
    options,
    onChange,
  }: {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  }) => (
    <div className="inline-flex w-full text-[12px]">
      {options.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            className={`border-neutral-gray-400 flex-1 cursor-pointer border py-2 ${
              index === 0 ? 'rounded-l-lg' : 'rounded-r-lg border-l-0'
            } ${
              isSelected
                ? 'bg-neutral-gray-800 font-semibold text-white'
                : 'bg-neutral-gray-300 text-neutral-gray-800 font-medium'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  )
);

const VariantTabToggle = memo(
  ({
    disabled,
    activeTabId,
    onChange,
  }: {
    disabled: boolean;
    activeTabId: string;
    onChange: (id: string) => void;
  }) => (
    <div
      className={`w-20 shrink-0 ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <Tab
        variant="toggle"
        defaultActiveId={activeTabId}
        data={variantTabs}
        className="h-10! flex-1 px-2!"
        onClick={(item) => onChange(String(item.id))}
      />
    </div>
  )
);

const EditionNameInput = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <Input
      placeholder="Name"
      containerClassName="flex-1"
      className="border-neutral-gray-300! h-10! rounded-lg! border! bg-white! py-2! text-[13px]!"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
);

const ConfiguratorOptions = ({
  commonSettings,
  onCommonSettingsChange,
  modelTransform,
  onModelTransformChange,
  onLogoClick,
  cameraControl,
}: ConfiguratorOptionsProps) => {
  const [hdriPreview, setHdriPreview] = useState<string | null>(null);
  const [hdriLoading, setHdriLoading] = useState(false);
  const [currControlsTab, setCurrControlsTab] = useState<'3d' | 'mrkt'>('mrkt');
  const [draggedEdition, setDraggedEdition] = useState<{
    vIdx: number;
    eIdx: number;
  } | null>(null);
  const [dragOverEdition, setDragOverEdition] = useState<{
    vIdx: number;
    eIdx: number;
  } | null>(null);
  const [uploadingEditions, setUploadingEditions] = useState<Set<string>>(
    new Set()
  );
  const uploadGenerations = useRef<Record<string, number>>({});

  const uploadImages = useUploadExperienceImages();
  const deleteImage = useDeleteExperienceImage();

  const toAssetUrl = (value: string): string => {
    if (!value) return value;
    if (value.startsWith('http')) return value;
    const normalizedPath = value.startsWith('/') ? value : `/${value}`;
    return new URL(normalizedPath, ASSET_BASE_URL).toString();
  };

  const toStorageKey = (value: string): string | null => {
    if (!value) return null;
    try {
      const normalized = value.startsWith('http')
        ? new URL(value).pathname
        : value;
      const withoutLeadingSlash = normalized.startsWith('/')
        ? normalized.slice(1)
        : normalized;
      if (withoutLeadingSlash.startsWith('experiences/uploads/')) {
        return withoutLeadingSlash;
      }
      return null;
    } catch {
      const withoutLeadingSlash = value.startsWith('/')
        ? value.slice(1)
        : value;
      if (withoutLeadingSlash.startsWith('experiences/uploads/'))
        return withoutLeadingSlash;
      return null;
    }
  };

  const deleteEditionImage = async (imageUrl: string | undefined) => {
    if (!imageUrl) return;
    const key = toStorageKey(imageUrl);
    if (key) {
      try {
        await deleteImage.mutateAsync([key]);
      } catch (err) {
        // console.warn('Error deleting edition image:', err);
      }
    }
  };

  // Track custom environment URL for cleanup
  const customEnvUrlRef = useRef<string | null>(null);

  // Cleanup custom environment blob URL and shared renderer on unmount
  useEffect(() => {
    return () => {
      if (
        customEnvUrlRef.current &&
        customEnvUrlRef.current.startsWith('blob:')
      ) {
        URL.revokeObjectURL(customEnvUrlRef.current);
      }
      // Cleanup HDRI renderer and cache when component unmounts
      clearHDRICache();
      disposeHDRIRenderer();
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadPreview = async () => {
      let envPath: File | string | null = null;

      if (
        commonSettings.environment.envType === 'custom' &&
        commonSettings.environment.customEnvUrl
      ) {
        envPath = commonSettings.environment.customEnvUrl;
      } else if (
        commonSettings.environment &&
        commonSettings.environment.presetName
      ) {
        envPath =
          ENV_PRESETS.find(
            (preset) => preset.name === commonSettings.environment.presetName
          )?.url || null;
      }

      if (!envPath) {
        setHdriPreview(null);
        return;
      }

      setHdriLoading(true);
      try {
        const dataUrl = await loadHDRToDataURL(envPath as string, 256, 128);
        if (!isCancelled) {
          setHdriPreview(dataUrl);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to load HDRI preview:', error);
          setHdriPreview(null);
        }
      } finally {
        if (!isCancelled) {
          setHdriLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      isCancelled = true;
    };
  }, [
    commonSettings.environment.envType,
    commonSettings.environment.presetName,
    commonSettings.environment.customEnvUrl,
  ]);

  const handleHdriUpload = useCallback(
    (url: string, name: string) => {
      // Cleanup previous blob URL if it exists
      if (
        customEnvUrlRef.current &&
        customEnvUrlRef.current.startsWith('blob:')
      ) {
        URL.revokeObjectURL(customEnvUrlRef.current);
      }
      customEnvUrlRef.current = url;

      onCommonSettingsChange((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          envType: 'custom',
          customEnvUrl: url,
          customEnvName: name,
        },
      }));
    },
    [onCommonSettingsChange]
  );

  const handleModelRotationChange = useCallback(
    (axis: 'x' | 'y' | 'z') => (value: string) => {
      if (!modelTransform) return;
      const rotationValue = value === '' ? 0 : parseFloat(value);

      onModelTransformChange({
        ...modelTransform,
        rotation: { ...modelTransform.rotation, [axis]: rotationValue },
      });
    },
    [onModelTransformChange, modelTransform]
  );

  const handleCameraPositionChange = useCallback(
    (axis: 'x' | 'y' | 'z') => (value: string) => {
      const positionValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(positionValue)) return;

      onCommonSettingsChange((prev) => ({
        ...prev,
        camera: {
          ...prev.camera,
          position: {
            ...prev.camera.position,
            [axis]: positionValue,
          },
        },
      }));
    },
    [onCommonSettingsChange]
  );

  const handleZoomChange = useCallback(
    (type: 'min' | 'max') => (value: string | number) => {
      const zoomValue =
        value === '' || value === undefined
          ? 0
          : typeof value === 'string'
            ? parseFloat(value)
            : Number(value);

      if (isNaN(zoomValue)) return;

      onCommonSettingsChange((prev) => ({
        ...prev,
        zoom: {
          ...prev.zoom,
          [type]: zoomValue,
        },
      }));
    },
    [onCommonSettingsChange]
  );

  return (
    <div className="font-metropolis text-neutral-gray-900 bg-neutral-gray-200 flex h-full w-85 max-w-85 min-w-85 flex-col gap-8 overflow-auto px-4 pt-9 pb-6">
      <img
        src="/assets/icons/Commverse Logo - Final.svg"
        alt="comm-logo"
        className="h-auto max-w-47.5 cursor-pointer"
        onClick={onLogoClick}
      />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-semibold">Experience Setup</span>
          <span
            className="cursor-pointer text-[12px] underline"
            onClick={() => {
              onCommonSettingsChange((prev) => ({
                ...defaultSettings,
                modelFile: prev.modelFile,
              }));
            }}
          >
            Reset All
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="border-neutral-gray-400 bg-neutral-gray-300 flex cursor-pointer justify-between rounded-xl border p-1 text-[12px] font-semibold">
            <div
              className={`w-full py-2 text-center ${currControlsTab === 'mrkt' ? 'rounded-lg bg-white' : ''}`}
              onClick={() => setCurrControlsTab('mrkt')}
            >
              Variants
            </div>
            <div
              className={`w-full py-2 text-center ${currControlsTab === '3d' ? 'rounded-lg bg-white' : ''}`}
              onClick={() => setCurrControlsTab('3d')}
            >
              Adjustments
            </div>
          </div>
          <div className="text-[12px]">
            <span>
              {currControlsTab === 'mrkt'
                ? 'Controls to tweak your experience'
                : 'Controls and options that will be displayed in the deployed experience'}{' '}
            </span>
          </div>
        </div>

        {currControlsTab === '3d' ? (
          <div className="relative flex flex-col p-2">
            {!modelTransform && (
              <div className="bg-neutral-gray-200/60 absolute inset-0 z-10 flex cursor-not-allowed items-center justify-center px-4 text-center">
                <span className="text-neutral-gray-600 text-[12px] font-medium">
                  Upload a model to adjust transformations
                </span>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold">Rotation</span>
              {/* Model Rotation */}
              <Section
                title="Rotate Model"
                titleClassName="text-[12px]! font-normal!"
                onReset={() => {
                  if (modelTransform) {
                    onModelTransformChange?.({
                      ...modelTransform,
                      rotation: defaultSettings.modelTransform.rotation,
                    });
                  }
                }}
              >
                <TripleInput
                  values={modelTransform?.rotation || { x: 0, y: 0, z: 0 }}
                  onChange={handleModelRotationChange}
                />
              </Section>
            </div>

            <LineComponent />

            {/* Model Scale */}
            <SliderComponent
              label="Scale"
              value={
                modelTransform?.scale ?? defaultSettings.modelTransform.scale
              }
              onChange={(value) => {
                if (modelTransform) {
                  onModelTransformChange?.({ ...modelTransform, scale: value });
                }
              }}
              min={defaultSettings.modelTransform.scale / 10}
              max={defaultSettings.modelTransform.scale * 10}
              step={0.1}
              onReset={() => {
                if (modelTransform) {
                  onModelTransformChange?.({
                    ...modelTransform,
                    scale: 1,
                  });
                }
              }}
              labelClassName="text-[13px] font-semibold"
            />

            <LineComponent />

            {/* Zoom values */}
            <div className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <span className="text-[13px] font-semibold">Zoom Limits</span>
                <Icon
                  icon="solar:restart-linear"
                  width={16}
                  height={16}
                  className="text-neutral-gray-800 cursor-pointer"
                  onClick={() => {
                    onCommonSettingsChange((prev) => ({
                      ...prev,
                      zoom: defaultSettings.zoom,
                    }));
                  }}
                />
              </div>
              <DualSlider
                min={1}
                max={20}
                minValue={commonSettings.zoom.min}
                maxValue={commonSettings.zoom.max}
                onMinChange={handleZoomChange('min')}
                onMaxChange={handleZoomChange('max')}
              />
              <div className="flex w-full gap-2">
                <InputComponent
                  id="zoom-min"
                  label="Minimum"
                  type="number"
                  step="0.1"
                  value={commonSettings.zoom.min.toString()}
                  onChange={(e: any) => handleZoomChange('min')(e)}
                />
                <InputComponent
                  id="zoom-max"
                  label="Maximum"
                  type="number"
                  step="0.1"
                  value={commonSettings.zoom.max.toString()}
                  onChange={(e: any) => handleZoomChange('max')(e)}
                />
              </div>
            </div>

            <LineComponent />

            {/* Shadow */}
            <Section title="Shadow">
              <SliderComponent
                label="Intensity"
                value={commonSettings.shadowIntensity}
                onChange={(value) => {
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    shadowIntensity: value,
                  }));
                }}
                onReset={() => {
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    shadowIntensity: defaultSettings.shadowIntensity,
                  }));
                }}
                min={0.1}
                max={1}
                step={0.1}
              />
            </Section>

            <LineComponent />

            {/* Lighting  */}
            <Section title="Lighting">
              <div className="bg-neutral-gray-300 w-full rounded-lg">
                {hdriLoading ? (
                  <div className="flex h-20 w-full items-center justify-center">
                    <Icon
                      icon="svg-spinners:ring-resize"
                      width={24}
                      height={24}
                      className="text-neutral-gray-600"
                    />
                  </div>
                ) : hdriPreview ? (
                  <img
                    src={hdriPreview}
                    alt="HDRI Preview"
                    className="block h-24 w-full rounded-lg"
                  />
                ) : (
                  <div className="text-neutral-gray-600 flex h-20 w-full items-center justify-center text-[12px]">
                    Preview unavailable
                  </div>
                )}
              </div>
              {/* )} */}

              {/* Preset Buttons */}
              <FileUploadButton
                className="col-span-2"
                isUploaded={Boolean(
                  commonSettings.environment.customEnvUrl &&
                  commonSettings.environment.customEnvName
                )}
                uploadedLabel={commonSettings.environment.customEnvName}
                allowedFileTypes={['.hdr', '.exr']}
                maxFileSize={HDRI_MAX_SIZE}
                onClick={() => {
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    environment: {
                      ...prev.environment,
                      envType: 'custom',
                    },
                  }));
                }}
                onFileUpload={handleHdriUpload}
                onClose={() => {
                  handleHdriUpload('', '');
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    environment: {
                      ...prev.environment,
                      envType: 'preset',
                      customEnvUrl: null,
                      customEnvName: null,
                    },
                  }));
                }}
                buttonLabel="Upload Custom HDRI"
                isActive={commonSettings.environment.envType === 'custom'}
              />
              <div className="grid grid-cols-2 gap-2">
                {ENV_PRESETS.map((env) => {
                  const isSelected =
                    commonSettings.environment.envType === 'preset' &&
                    commonSettings.environment.presetName === env.name;

                  return (
                    <Button
                      key={env.url}
                      variant={'outline'}
                      content={env.name}
                      onClick={() => {
                        onCommonSettingsChange((prev) => ({
                          ...prev,
                          environment: {
                            ...prev.environment,
                            presetName: env.name as PresetName,
                            envType: 'preset',
                          },
                        }));
                      }}
                      className={`bg-neutral-gray-200 border-neutral-gray-400! border! px-3! py-2! text-[12px]! font-normal! ${isSelected ? 'bg-neutral-gray-300 border-neutral-gray-900!' : ''} `}
                    />
                  );
                })}
              </div>

              {/* Lighting Intensity */}
              <SliderComponent
                label="Intensity"
                value={commonSettings.environment.lightIntensity}
                onChange={(value) =>
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    environment: {
                      ...prev.environment,
                      lightIntensity: value,
                    },
                  }))
                }
                onReset={() => {
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    environment: {
                      ...prev.environment,
                      lightIntensity:
                        defaultSettings.environment.lightIntensity,
                    },
                  }));
                }}
                min={0}
                max={2}
                step={0.1}
              />
            </Section>

            <LineComponent />
            {/* Environment */}
            <Section title="Environment">
              {/* Selection Buttons */}
              <SegmentedControl
                value={commonSettings.environment.grounded ? 'env' : 'solid'}
                options={[
                  { value: 'env', label: 'Environment' },
                  { value: 'solid', label: 'Solid Colour' },
                ]}
                onChange={(value) => {
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    environment: {
                      ...prev.environment,
                      grounded: value === 'env',
                    },
                  }));
                }}
              />

              {/* Environment Settings */}
              {commonSettings.environment.grounded && (
                <>
                  <SliderComponent
                    value={commonSettings.environment.envHeight || 12}
                    label="Floor Height"
                    onChange={(value) =>
                      onCommonSettingsChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envHeight: value,
                        },
                      }))
                    }
                    onReset={() => {
                      onCommonSettingsChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envHeight: defaultSettings.environment.envHeight,
                        },
                      }));
                    }}
                    min={1}
                    max={20}
                    step={1}
                  />
                  <SliderComponent
                    value={commonSettings.environment.envRadius || 60}
                    label="Adjust Surroundings"
                    onChange={(value) =>
                      onCommonSettingsChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envRadius: value,
                        },
                      }))
                    }
                    onReset={() => {
                      onCommonSettingsChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envRadius: defaultSettings.environment.envRadius,
                        },
                      }));
                    }}
                    min={10}
                    max={100}
                    step={1}
                  />
                  <SliderComponent
                    value={commonSettings.environment.envScale || 20}
                    label="Scale"
                    onChange={(value) =>
                      onCommonSettingsChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envScale: value,
                        },
                      }))
                    }
                    onReset={() => {
                      onCommonSettingsChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envScale: defaultSettings.environment.envScale,
                        },
                      }));
                    }}
                    min={10}
                    max={100}
                    step={1}
                  />
                </>
              )}

              {/* Background Color */}
              {!commonSettings.environment.grounded && (
                <InputComponent
                  id="env-color"
                  label="Background Color"
                  type="color"
                  containerClassName="gap-2! w-full!"
                  value={commonSettings.environment.envBgColor}
                  onChange={(e: any) =>
                    onCommonSettingsChange((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        envBgColor: e,
                      },
                    }))
                  }
                />
              )}
            </Section>

            <LineComponent />

            {/* Camera Settings */}
            <Section title="Camera">
              <Section
                title="Position"
                titleClassName="text-[12px]! font-normal!"
                onReset={() => {
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    camera: {
                      ...prev.camera,
                      position: defaultSettings.camera.position,
                    },
                  }));
                }}
                extraIcons={
                  <>
                    <Icon
                      icon="solar:gps-linear"
                      width={16}
                      height={16}
                      className="text-neutral-gray-800 cursor-pointer"
                      onClick={() => cameraControl?.setCameraPosition()}
                    />
                    <Icon
                      icon="solar:eye-linear"
                      width={16}
                      height={16}
                      className="text-neutral-gray-800 cursor-pointer"
                      onClick={() => cameraControl?.preview()}
                    />
                  </>
                }
              >
                <TripleInput
                  values={commonSettings.camera.position}
                  onChange={handleCameraPositionChange}
                />
              </Section>
            </Section>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-2">
            <Section title="Menu Placement">
              <SegmentedControl
                value={commonSettings.menuPlacement}
                options={[
                  { value: 'dock', label: 'Dock' },
                  { value: 'floating', label: 'Floating' },
                ]}
                onChange={(value) =>
                  onCommonSettingsChange((prev) => ({
                    ...prev,
                    menuPlacement: value as VisualizerProps['menuPlacement'],
                  }))
                }
              />
            </Section>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-neutral-gray-900 text-[13px] font-semibold">
                  Text Only
                </span>
                <ToggleSwitch
                  isOn={commonSettings.textOnly}
                  onToggle={(val) =>
                    onCommonSettingsChange((prev) => ({
                      ...prev,
                      textOnly: val,
                    }))
                  }
                />
              </div>
              <span className="text-neutral-gray-700 px-2 text-[12px]">
                No variant thumbnails or hex codes
              </span>
            </div>

            <LineComponent />

            {commonSettings.variants.map((variant, vIdx) => (
              <div key={vIdx} className="mb-4 flex flex-col gap-3">
                <div className="flex items-center justify-between px-2">
                  <span className="text-neutral-gray-900 text-[14px] font-semibold">
                    Product Variant Type {vIdx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Icon
                      icon="solar:alt-arrow-up-linear"
                      className={`text-neutral-gray-600 size-4 ${vIdx === 0 ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
                      onClick={() => {
                        if (vIdx === 0) return;
                        onCommonSettingsChange((prev) => {
                          const newVariants = [...prev.variants];
                          [newVariants[vIdx - 1], newVariants[vIdx]] = [
                            newVariants[vIdx],
                            newVariants[vIdx - 1],
                          ];
                          return { ...prev, variants: newVariants };
                        });
                      }}
                    />
                    <Icon
                      icon="solar:alt-arrow-down-linear"
                      className={`text-neutral-gray-600 size-4 ${vIdx === commonSettings.variants.length - 1 ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
                      onClick={() => {
                        if (vIdx === commonSettings.variants.length - 1) return;
                        onCommonSettingsChange((prev) => {
                          const newVariants = [...prev.variants];
                          [newVariants[vIdx + 1], newVariants[vIdx]] = [
                            newVariants[vIdx],
                            newVariants[vIdx + 1],
                          ];
                          return { ...prev, variants: newVariants };
                        });
                      }}
                    />
                    {commonSettings.variants.length > 1 && (
                      <Icon
                        icon="lucide:x"
                        className="text-neutral-gray-600 ml-1 size-4 cursor-pointer"
                        onClick={async () => {
                          // Delete images for all editions in this variant if it's image type
                          if (variant.activeTabId === 'image') {
                            for (const edition of variant.editions) {
                              if (edition.imageUrl) {
                                await deleteEditionImage(edition.imageUrl);
                              }
                            }
                          }
                          onCommonSettingsChange((prev) => ({
                            ...prev,
                            variants: prev.variants.filter(
                              (_, idx) => idx !== vIdx
                            ),
                          }));
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 px-2">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-gray-700 text-[12px] font-medium">
                        Variant Type
                      </span>
                      <Icon
                        icon="solar:restart-linear"
                        className="text-neutral-gray-600 size-4 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <FilterDropdown
                          placeholder="Select Type"
                          options={VARIANT_DROPDOWN_OPTIONS}
                          className="min-w-0 flex-1 [&>button]:h-10! [&>button]:w-full [&>button]:min-w-0!"
                          value={variant.selectedType}
                          onChange={(selected) => {
                            const selectedOption =
                              (selected as SelectedOption) ?? null;
                            const type = selectedOption?.id ?? '';
                            const typeLabel = selectedOption?.label ?? '';
                            onCommonSettingsChange((prev) => {
                              const newVariants = [...prev.variants];
                              newVariants[vIdx] = {
                                ...newVariants[vIdx],
                                selectedType: type,
                                customType:
                                  type === 'other'
                                    ? newVariants[vIdx].customType ||
                                      typeLabel ||
                                      'Other'
                                    : typeLabel || type,
                                activeTabId:
                                  type === 'colour' ? 'pipette' : 'image',
                              };
                              return { ...prev, variants: newVariants };
                            });
                          }}
                        />

                        {variant.selectedType === 'colour' && (
                          <VariantTabToggle
                            disabled={commonSettings.textOnly}
                            activeTabId={variant.activeTabId}
                            onChange={async (tabId) => {
                              // Delete images when switching from 'image' to 'pipette'
                              if (
                                variant.activeTabId === 'image' &&
                                tabId === 'pipette'
                              ) {
                                for (const edition of variant.editions) {
                                  if (edition.imageUrl) {
                                    await deleteEditionImage(edition.imageUrl);
                                  }
                                }
                              }
                              onCommonSettingsChange((prev) => {
                                const newVariants = [...prev.variants];
                                newVariants[vIdx] = {
                                  ...newVariants[vIdx],
                                  activeTabId: tabId,
                                };
                                return { ...prev, variants: newVariants };
                              });
                            }}
                          />
                        )}
                      </div>

                      {variant.selectedType === 'other' && (
                        <div className="flex w-full items-center gap-2">
                          <Input
                            placeholder="Custom Type Name"
                            containerClassName="flex-1"
                            className="h-10! bg-white! py-2! text-[13px]!"
                            value={variant.customType || ''}
                            onChange={(e: any) => {
                              const val = e.target.value;
                              onCommonSettingsChange((prev) => {
                                const newVariants = [...prev.variants];
                                newVariants[vIdx] = {
                                  ...newVariants[vIdx],
                                  customType: val,
                                };
                                return { ...prev, variants: newVariants };
                              });
                            }}
                          />
                          <VariantTabToggle
                            disabled={commonSettings.textOnly}
                            activeTabId={variant.activeTabId}
                            onChange={async (tabId) => {
                              // Delete images when switching from 'image' to 'pipette'
                              if (
                                variant.activeTabId === 'image' &&
                                tabId === 'pipette'
                              ) {
                                for (const edition of variant.editions) {
                                  if (edition.imageUrl) {
                                    await deleteEditionImage(edition.imageUrl);
                                  }
                                }
                              }
                              onCommonSettingsChange((prev) => {
                                const newVariants = [...prev.variants];
                                newVariants[vIdx] = {
                                  ...newVariants[vIdx],
                                  activeTabId: tabId,
                                };
                                return { ...prev, variants: newVariants };
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {variant.editions.map((edition, eIdx) => (
                      <div
                        key={eIdx} // Stable key prevents unmounting and focus loss during text input
                        draggable
                        onDragStart={() => {
                          setDraggedEdition({ vIdx, eIdx });
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggedEdition?.vIdx === vIdx) {
                            setDragOverEdition({ vIdx, eIdx });
                          }
                        }}
                        onDragLeave={() => {
                          setDragOverEdition(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverEdition(null);
                          if (
                            !draggedEdition ||
                            draggedEdition.vIdx !== vIdx ||
                            draggedEdition.eIdx === eIdx
                          ) {
                            return;
                          }
                          onCommonSettingsChange((prev) => {
                            const newVariants = [...prev.variants];
                            const editions = [...newVariants[vIdx].editions];
                            const draggedItem = editions.splice(
                              draggedEdition.eIdx,
                              1
                            )[0];
                            editions.splice(eIdx, 0, draggedItem);
                            newVariants[vIdx] = {
                              ...newVariants[vIdx],
                              editions,
                            };

                            let newEditingEdition = prev.editingEdition;
                            if (prev.editingEdition?.vIdx === vIdx) {
                              if (
                                prev.editingEdition.eIdx === draggedEdition.eIdx
                              ) {
                                newEditingEdition = { vIdx, eIdx: eIdx };
                              } else if (
                                draggedEdition.eIdx <
                                  prev.editingEdition.eIdx &&
                                eIdx >= prev.editingEdition.eIdx
                              ) {
                                newEditingEdition = {
                                  vIdx,
                                  eIdx: prev.editingEdition.eIdx - 1,
                                };
                              } else if (
                                draggedEdition.eIdx >
                                  prev.editingEdition.eIdx &&
                                eIdx <= prev.editingEdition.eIdx
                              ) {
                                newEditingEdition = {
                                  vIdx,
                                  eIdx: prev.editingEdition.eIdx + 1,
                                };
                              }
                            }
                            return {
                              ...prev,
                              variants: newVariants,
                              editingEdition: newEditingEdition,
                            };
                          });
                          setDraggedEdition(null);
                        }}
                        onDragEnd={() => {
                          setDraggedEdition(null);
                          setDragOverEdition(null);
                        }}
                        onClick={() => {
                          onCommonSettingsChange((prev) => {
                            if (
                              prev.editingEdition?.vIdx === vIdx &&
                              prev.editingEdition?.eIdx === eIdx
                            ) {
                              return prev;
                            }
                            return {
                              ...prev,
                              editingEdition: { vIdx, eIdx },
                            };
                          });
                        }}
                        className={`flex cursor-pointer flex-col gap-3 rounded-xl border bg-[#EAEBF1] p-3 transition-all duration-200 ${
                          draggedEdition?.vIdx === vIdx &&
                          draggedEdition?.eIdx === eIdx
                            ? 'opacity-40'
                            : ''
                        } ${
                          dragOverEdition?.vIdx === vIdx &&
                          dragOverEdition?.eIdx === eIdx
                            ? 'border-primary-500 scale-[1.01] shadow-md'
                            : ''
                        } ${
                          commonSettings.editingEdition?.vIdx === vIdx &&
                          commonSettings.editingEdition?.eIdx === eIdx
                            ? 'border-primary-500 ring-primary-500 ring-1'
                            : 'border-neutral-gray-400 hover:border-neutral-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon
                              icon="lucide:grip-vertical"
                              className="size-4 cursor-grab active:cursor-grabbing"
                            />
                            <span className="text-neutral-gray-900 text-[12px] font-semibold capitalize">
                              {variant.customType ||
                                (VARIANT_DROPDOWN_OPTIONS.find(
                                  (option) => option.id === variant.selectedType
                                )?.label ??
                                  variant.selectedType)}{' '}
                              {eIdx + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon
                              icon={
                                edition.visible === false
                                  ? 'solar:eye-closed-linear'
                                  : 'solar:eye-linear'
                              }
                              className={`size-4 cursor-pointer transition-colors ${
                                edition.visible === false
                                  ? 'text-neutral'
                                  : 'text-neutral'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onCommonSettingsChange((prev) => {
                                  const newVariants = [...prev.variants];
                                  const newEditions = [
                                    ...newVariants[vIdx].editions,
                                  ];
                                  newEditions[eIdx] = {
                                    ...newEditions[eIdx],
                                    visible:
                                      newEditions[eIdx].visible === false,
                                  };
                                  newVariants[vIdx] = {
                                    ...newVariants[vIdx],
                                    editions: newEditions,
                                  };
                                  return { ...prev, variants: newVariants };
                                });
                              }}
                            />
                            <CancelIcon
                              className="text-neutral-gray-800 size-4 cursor-pointer"
                              onClick={async (e) => {
                                e.stopPropagation();
                                // Delete the edition's image if it exists
                                if (
                                  variant.activeTabId === 'image' &&
                                  edition.imageUrl
                                ) {
                                  await deleteEditionImage(edition.imageUrl);
                                }
                                onCommonSettingsChange((prev) => {
                                  const newVariants = [...prev.variants];
                                  const newEditions = [
                                    ...newVariants[vIdx].editions,
                                  ];
                                  newEditions.splice(eIdx, 1);
                                  newVariants[vIdx] = {
                                    ...newVariants[vIdx],
                                    editions: newEditions,
                                  };
                                  return { ...prev, variants: newVariants };
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {variant.activeTabId === 'image' ? (
                            <>
                              {!commonSettings.textOnly && (
                                <div
                                  className="bg-neutral-gray-300 border-neutral-gray-400 flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border"
                                  onClick={() => {
                                    document
                                      .getElementById(
                                        `edition-img-${vIdx}-${eIdx}`
                                      )
                                      ?.click();
                                  }}
                                >
                                  {uploadingEditions.has(`${vIdx}-${eIdx}`) ? (
                                    <div className="bg-neutral-gray-400 h-full w-full animate-pulse" />
                                  ) : edition.imageUrl ? (
                                    <img
                                      src={edition.imageUrl}
                                      alt="edition"
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Icon
                                      icon="lucide:plus"
                                      className="text-neutral-gray-600 size-5"
                                    />
                                  )}
                                  <input
                                    type="file"
                                    id={`edition-img-${vIdx}-${eIdx}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      e.target.value = '';
                                      if (file) {
                                        const editionKey = `${vIdx}-${eIdx}`;
                                        const generation =
                                          (uploadGenerations.current[
                                            editionKey
                                          ] || 0) + 1;
                                        uploadGenerations.current[editionKey] =
                                          generation;

                                        setUploadingEditions((prev) => {
                                          const next = new Set(prev);
                                          next.add(editionKey);
                                          return next;
                                        });

                                        try {
                                          // Delete old image if replacing
                                          if (edition.imageUrl) {
                                            await deleteEditionImage(
                                              edition.imageUrl
                                            );
                                          }
                                          const formData = new FormData();
                                          formData.append('images', file);
                                          const data =
                                            await uploadImages.mutateAsync(
                                              formData
                                            );
                                          const uploadedKey =
                                            data?.data?.[0] ??
                                            data?.data?.images?.[0];
                                          if (uploadedKey) {
                                            const imageUrl =
                                              toAssetUrl(uploadedKey);
                                            onCommonSettingsChange((prev) => {
                                              const newVariants = [
                                                ...prev.variants,
                                              ];
                                              const newEditions = [
                                                ...newVariants[vIdx].editions,
                                              ];
                                              newEditions[eIdx] = {
                                                ...newEditions[eIdx],
                                                imageUrl,
                                              };
                                              newVariants[vIdx] = {
                                                ...newVariants[vIdx],
                                                editions: newEditions,
                                              };
                                              return {
                                                ...prev,
                                                variants: newVariants,
                                              };
                                            });
                                          }
                                        } catch (err) {
                                          console.error(
                                            'Error uploading edition image:',
                                            err
                                          );
                                        } finally {
                                          if (
                                            uploadGenerations.current[
                                              editionKey
                                            ] === generation
                                          ) {
                                            setUploadingEditions((prev) => {
                                              const next = new Set(prev);
                                              next.delete(editionKey);
                                              return next;
                                            });
                                          }
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              )}
                              <EditionNameInput
                                value={edition.name}
                                onChange={(name) => {
                                  if (name.length > 25) return;
                                  onCommonSettingsChange((prev) => {
                                    const newVariants = [...prev.variants];
                                    const newEditions = [
                                      ...newVariants[vIdx].editions,
                                    ];
                                    newEditions[eIdx] = {
                                      ...newEditions[eIdx],
                                      name,
                                    };
                                    newVariants[vIdx] = {
                                      ...newVariants[vIdx],
                                      editions: newEditions,
                                    };
                                    return { ...prev, variants: newVariants };
                                  });
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <EditionNameInput
                                value={edition.name}
                                onChange={(name) => {
                                  if (name.length > 25) return;
                                  onCommonSettingsChange((prev) => {
                                    const newVariants = [...prev.variants];
                                    const newEditions = [
                                      ...newVariants[vIdx].editions,
                                    ];
                                    newEditions[eIdx] = {
                                      ...newEditions[eIdx],
                                      name,
                                    };
                                    newVariants[vIdx] = {
                                      ...newVariants[vIdx],
                                      editions: newEditions,
                                    };
                                    return { ...prev, variants: newVariants };
                                  });
                                }}
                              />
                              {!commonSettings.textOnly && (
                                <div className="flex-1">
                                  <ColorInput
                                    value={edition.color}
                                    onChange={(e: any) => {
                                      const val =
                                        typeof e === 'string'
                                          ? e
                                          : e.target?.value;
                                      onCommonSettingsChange((prev) => {
                                        const newVariants = [...prev.variants];
                                        const newEditions = [
                                          ...newVariants[vIdx].editions,
                                        ];
                                        newEditions[eIdx] = {
                                          ...newEditions[eIdx],
                                          color: val,
                                        };
                                        newVariants[vIdx] = {
                                          ...newVariants[vIdx],
                                          editions: newEditions,
                                        };
                                        return {
                                          ...prev,
                                          variants: newVariants,
                                        };
                                      });
                                    }}
                                    placeholder="#000000"
                                    className="border-neutral-gray-300! h-10! rounded-lg! border! bg-white! px-2!"
                                    containerClassName="w-full"
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {edition.modelFile ? (
                          <div className="border-neutral-gray-900 flex w-full items-center justify-between rounded-xl border bg-[#D4D5D8] px-4 py-3">
                            <span className="text-neutral-gray-900 truncate text-[13px] font-medium">
                              {edition.modelFile.name}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCommonSettingsChange((prev) => {
                                  const newVariants = [...prev.variants];
                                  const newEditions = [
                                    ...newVariants[vIdx].editions,
                                  ];
                                  newEditions[eIdx] = {
                                    ...newEditions[eIdx],
                                    modelFile: null,
                                    modelUrl: null,
                                    modelId: null,
                                  };
                                  newVariants[vIdx] = {
                                    ...newVariants[vIdx],
                                    editions: newEditions,
                                  };
                                  return {
                                    ...prev,
                                    variants: newVariants,
                                    editingEdition: { vIdx, eIdx },
                                  };
                                });
                              }}
                              className="text-neutral-gray-800 ml-2 transition-colors hover:text-black"
                            >
                              <Icon icon="lucide:x" width={18} height={18} />
                            </button>
                          </div>
                        ) : (
                          commonSettings.isImported && (
                            <div className="relative w-full">
                              <Button
                                content="Select 3D Model"
                                variant="outline"
                                className="bg-neutral-gray-300 border-neutral-gray-400! w-full max-w-full overflow-hidden rounded-xl! py-1.5! text-[12px]! font-medium!"
                                onClick={() => {
                                  onCommonSettingsChange((prev) => ({
                                    ...prev,
                                    editingEdition: { vIdx, eIdx },
                                    openModelLibrary: true,
                                  }));
                                }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    ))}

                    <Button
                      content="Add Variant"
                      variant="outline"
                      className="bg-neutral-gray-300 border-neutral-gray-400! rounded-xl! py-2! text-[13px]! font-medium!"
                      leftIcon={
                        <Icon icon="lucide:plus" width={16} height={16} />
                      }
                      onClick={() => {
                        onCommonSettingsChange((prev) => {
                          const newVariants = [...prev.variants];
                          const newEIdx = newVariants[vIdx].editions.length;
                          newVariants[vIdx] = {
                            ...newVariants[vIdx],
                            editions: [
                              ...newVariants[vIdx].editions,
                              defaultEdition(variant.selectedType === 'colour'),
                            ],
                          };
                          return {
                            ...prev,
                            variants: newVariants,
                            editingEdition: { vIdx, eIdx: newEIdx },
                          };
                        });
                      }}
                    />
                  </div>
                </div>
                <LineComponent />
              </div>
            ))}

            <div className="px-2">
              <Button
                content="Add New Variant Type"
                variant="outline"
                className="bg-neutral-gray-300 border-neutral-gray-400! rounded-xl! py-2.5! text-[13px]! font-medium!"
                leftIcon={<Icon icon="lucide:plus" width={18} height={18} />}
                onClick={() => {
                  onCommonSettingsChange((prev) => {
                    const newVIdx = prev.variants.length;
                    return {
                      ...prev,
                      variants: [...prev.variants, defaultVariant()],
                      editingEdition: { vIdx: newVIdx, eIdx: 0 },
                    };
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguratorOptions;
