import { Icon } from '@iconify/react';
import Button from '../../../../../components/Button';
import FileUploadButton from '../../../../../components/FileUploadButton';
import ColorInput from '../../../../../components/Input/ColorInput';
import Slider from '../../../../../components/Slider';
import type {
  IconInputProps,
  PresetName,
  SliderProps,
  VisualizerProps,
} from '../../../../../types';
import {
  defaultSettings,
  ENV_PRESETS,
  HDRI_MAX_SIZE,
} from '../../../../../constants';
import { useState, useEffect, memo, useCallback, useRef } from 'react';
import {
  loadHDRToDataURL,
  disposeHDRIRenderer,
  clearHDRICache,
} from '../../../../../lib/utils';
import IconInput from '../../../../../components/IconInput';
import { useModelStore } from '../../../../../lib/store';
import { useNavigate } from 'react-router';
// import type { PresetsType } from '@react-three/drei/helpers/environment-assets';

interface MarkerlessOptionsProps {
  settings: VisualizerProps;
  onSettingChange: React.Dispatch<React.SetStateAction<VisualizerProps>>;
  cameraControl?: {
    setCameraPosition: () => void;
    preview: () => void;
  } | null;
}

interface InputComponentProps extends Omit<
  IconInputProps,
  'placeholder' | 'type'
> {
  type: 'text' | 'number' | 'color';
  variant?: 'left' | 'top';
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
          onChange={() => onChange}
          className={`${className} px-3! py-2!`}
          containerClassName={containerClassName}
        />
      ) : (
        <IconInput
          type={type}
          step={step}
          label={variant == 'top' ? label : ''}
          placeholder={value?.toString() ?? ''}
          value={value}
          onChange={(val) => onChange?.(String(val))}
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
        onChange={(e) => onChange('x')(e)}
      />
      <InputComponent
        variant="left"
        label="Y"
        type="number"
        step={1}
        value={values.y.toString()}
        onChange={(e) => onChange('y')(e)}
      />
      <InputComponent
        variant="left"
        label="Z"
        type="number"
        step={1}
        value={values.z.toString()}
        onChange={(e) => onChange('z')(e)}
      />
    </div>
  )
);

const MarkerlessOptions = ({
  settings,
  onSettingChange,
}: MarkerlessOptionsProps) => {
  const [hdriPreview, setHdriPreview] = useState<string | null>(null);
  const [hdriLoading, setHdriLoading] = useState(false);
  const { status } = useModelStore();

  const navigate = useNavigate();

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
        settings.environment.envType === 'custom' &&
        settings.environment.customEnvUrl
      ) {
        envPath = settings.environment.customEnvUrl;
      } else if (settings.environment && settings.environment.presetName) {
        envPath =
          ENV_PRESETS.find(
            (preset) => preset.name === settings.environment.presetName
          )?.url || null;
      }

      if (!envPath) {
        setHdriPreview(null);
        return;
      }

      setHdriLoading(true);
      try {
        const dataUrl = await loadHDRToDataURL(
          envPath as string,
          256,
          128,
          settings.environment.customEnvName || undefined
        );
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
    settings.environment.envType,
    settings.environment.presetName,
    settings.environment.customEnvUrl,
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

      onSettingChange((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          customEnvUrl: url,
          customEnvName: name,
          envType: 'custom',
        },
      }));
    },
    [onSettingChange]
  );

  const handleModelRotationChange = useCallback(
    (axis: 'x' | 'y' | 'z') => (value: string) => {
      const rotationValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(rotationValue)) return;

      onSettingChange((prev) => ({
        ...prev,
        modelTransform: {
          ...prev.modelTransform,
          rotation: {
            ...prev.modelTransform.rotation,
            [axis]: rotationValue,
          },
        },
      }));
    },
    [onSettingChange]
  );

  return (
    <div className="font-metropolis text-neutral-gray-900 bg-neutral-gray-200 bordw-auto flex h-full w-[300px] flex-col gap-8 overflow-scroll overflow-x-hidden px-4 pt-9 pb-6">
      <img
        src="/assets/icons/Commverse Logo - Final.svg"
        alt="comm-logo"
        className="h-auto max-w-47.5 cursor-pointer"
        onClick={() => {
          navigate('/');
        }}
      />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-semibold">Experience Setup</span>
          <span
            className="cursor-pointer text-[12px] underline"
            onClick={() => {
              onSettingChange((prev) => ({
                ...defaultSettings,
                ...(prev.modelFile ? { modelFile: prev.modelFile } : {}),
              }));
            }}
          >
            Reset
          </span>
        </div>

        <div className="relative flex flex-col p-2">
          {status != 'ready' && (
            <div className="bg-neutral-gray-200/60 absolute inset-0 z-10 cursor-not-allowed" />
          )}
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold">Rotation</span>
            {/* Model Rotation */}
            <Section
              title="Rotate Model"
              titleClassName="text-[12px]! font-normal!"
              onReset={() => {
                onSettingChange((prev) => ({
                  ...prev,
                  modelTransform: {
                    ...prev.modelTransform,
                    rotation: {
                      x: defaultSettings.modelTransform.rotation.x,
                      y: defaultSettings.modelTransform.rotation.y,
                      z: defaultSettings.modelTransform.rotation.z,
                    },
                  },
                }));
              }}
            >
              <TripleInput
                values={settings.modelTransform.rotation}
                onChange={handleModelRotationChange}
              />
            </Section>
          </div>

          <LineComponent />

          {/* Model Scale */}
          <SliderComponent
            label="Scale"
            value={settings.modelTransform.scale}
            onChange={(value) => {
              onSettingChange((prev) => ({
                ...prev,
                modelTransform: {
                  ...prev.modelTransform,
                  scale: value,
                },
              }));
            }}
            min={defaultSettings.modelTransform.scale / 10}
            max={defaultSettings.modelTransform.scale * 10}
            step={0.1}
            onReset={() =>
              onSettingChange((prev) => ({
                ...prev,
                modelTransform: {
                  ...prev.modelTransform,
                  scale: defaultSettings.modelTransform.scale,
                },
              }))
            }
            labelClassName="text-[13px] font-semibold"
          />

          <LineComponent />

          <Section
            title="AR Anchor point"
            onReset={() => {
              onSettingChange((prev) => ({
                ...prev,
                arAnchor: defaultSettings.arAnchor,
              }));
            }}
          >
            <div className="inline-flex w-full text-[12px] font-semibold">
              <button
                className={`border-neutral-gray-400 flex-1 cursor-pointer rounded-l-lg border py-2 ${settings.arAnchor === 'floor' ? 'bg-neutral-gray-800 font-semibold text-white' : 'bg-neutral-gray-300 text-neutral-gray-800 font-medium'}`}
                onClick={() => {
                  onSettingChange((prev) => ({
                    ...prev,
                    arAnchor: 'floor',
                  }));
                }}
              >
                Floor
              </button>
              <button
                className={`border-neutral-gray-400 ${settings.arAnchor === 'wall' ? 'bg-neutral-gray-800 font-semibold text-white' : 'bg-neutral-gray-300 text-neutral-gray-800 font-medium'} flex-1 cursor-pointer rounded-r-lg border border-l-0 py-2`}
                onClick={() => {
                  onSettingChange((prev) => ({
                    ...prev,
                    arAnchor: 'wall',
                  }));
                }}
              >
                Wall
              </button>
            </div>
          </Section>

          <LineComponent />

          {/* Shadow */}
          <Section title="Shadow">
            <SliderComponent
              label="Intensity"
              value={settings.shadowIntensity}
              onChange={(value) => {
                onSettingChange((prev) => ({
                  ...prev,
                  shadowIntensity: value,
                }));
              }}
              onReset={() => {
                onSettingChange((prev) => ({
                  ...prev,
                  shadowIntensity: defaultSettings.shadowIntensity,
                }));
              }}
              min={0.1}
              max={1}
              step={0.1}
            />
            {/* TODO: Add functionality */}
            <SliderComponent
              label="Softness"
              value={settings.shadowSoftness}
              onChange={(value) => {
                onSettingChange((prev) => ({
                  ...prev,
                  shadowSoftness: value,
                }));
              }}
              onReset={() => {
                onSettingChange((prev) => ({
                  ...prev,
                  shadowSoftness: defaultSettings.shadowSoftness,
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
            {/* HDRI Preview */}
            {((settings.environment.envType === 'preset' &&
              settings.environment) ||
              (settings.environment.envType === 'custom' &&
                settings.environment.customEnvUrl)) && (
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
            )}

            {/* Preset Buttons */}
            <FileUploadButton
              className="col-span-2"
              isUploaded={Boolean(
                settings.environment.customEnvUrl &&
                settings.environment.customEnvName
              )}
              uploadedLabel={settings.environment.customEnvName}
              allowedFileTypes={['.hdr']}
              maxFileSize={HDRI_MAX_SIZE}
              onClick={() => {
                onSettingChange((prev) => ({
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
                onSettingChange((prev) => ({
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
              isActive={settings.environment.envType === 'custom'}
            />
            <div className="grid grid-cols-2 gap-2">
              {ENV_PRESETS.map((env) => {
                const isSelected =
                  settings.environment.envType === 'preset' &&
                  settings.environment.presetName === env.name;

                return (
                  <Button
                    key={env.url}
                    variant={'outline'}
                    content={env.name}
                    onClick={() => {
                      onSettingChange((prev) => ({
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
              value={settings.environment.lightIntensity}
              onChange={(value) =>
                onSettingChange((prev) => ({
                  ...prev,
                  environment: {
                    ...prev.environment,
                    lightIntensity: value,
                  },
                }))
              }
              onReset={() => {
                onSettingChange((prev) => ({
                  ...prev,
                  environment: {
                    ...prev.environment,
                    lightIntensity: defaultSettings.environment.lightIntensity,
                  },
                }));
              }}
              min={0}
              max={2}
              step={0.1}
            />
          </Section>

          <LineComponent />
        </div>
      </div>
    </div>
  );
};

export default MarkerlessOptions;
