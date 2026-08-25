import { Icon } from '@iconify/react';
import Button from '../../../../components/Button';
import Checkbox from '../../../../components/Checkbox';
import ColorInput from '../../../../components/Input/ColorInput';
import Slider from '../../../../components/Slider';
import DualSlider from '../../../../components/DualSilder';
import FileUploadButton from '../../../../components/FileUploadButton';
import type {
  InputProps,
  PresetName,
  SliderProps,
  VisualizerProps,
} from '../../../../types';
import {
  defaultSettings,
  ENV_PRESETS,
  HDRI_MAX_SIZE,
} from '../../../../constants';
import { useState, useEffect, memo, useCallback, useRef } from 'react';
import {
  loadHDRToDataURL,
  disposeHDRIRenderer,
  clearHDRICache,
} from '../../../../lib/utils';
import { ToggleSwitch } from '../../../../components/ToggleSwitch';
import IconInput from '../../../../components/IconInput';
import { useModelStore } from '../../../../lib/store';
import { useNavigate } from 'react-router';
import ToastCard from '../../../../components/AlertCards/ToastCard';

interface VisualizerOptionsProps {
  settings: VisualizerProps;
  onSettingChange: React.Dispatch<React.SetStateAction<VisualizerProps>>;
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

const positions = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

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

const PositionComponent = memo(
  ({
    position,
    setPosition,
    offsets,
    onOffsetChange,
  }: {
    position: string;
    setPosition: (pos: string) => void;
    offsets: { x: number; y: number };
    onOffsetChange: (axis: 'x' | 'y') => (value: string) => void;
  }) => (
    <div className="flex w-full gap-2">
      <div className="w-1/2">
        <div className="bg-neutral-gray-300 border-neutral-gray-400 grid grid-cols-3 gap-1 rounded-lg border p-2">
          {positions.map((pos) => (
            <div
              className={`bg-neutral-gray-400 h-[19.35px] w-full cursor-pointer rounded ${position === pos ? 'bg-neutral-gray-600' : ''}`}
              key={pos}
              onClick={() => {
                setPosition(pos);
              }}
            />
          ))}
        </div>
      </div>
      <div className="w-1/2">
        <div className="flex flex-col gap-2">
          <IconInput
            type="number"
            leftAddon="X"
            rightAddon="px"
            placeholder="0"
            value={offsets.x}
            className="placeholder:text-neutral-gray-900 py-2! font-normal!"
            onChange={(e: any) => onOffsetChange('x')(e)}
          />
          <IconInput
            type="number"
            leftAddon="Y"
            rightAddon="px"
            placeholder="0"
            value={offsets.y}
            className="placeholder:text-neutral-gray-900 py-2! font-normal!"
            onChange={(e: any) => onOffsetChange('y')(e)}
          />
        </div>
      </div>
    </div>
  )
);

export const UserLogoPrevComponent = memo(
  ({
    logo,
    onLogoUpload,
    onLogoRemove,
    onLogoUploadError,
    hdriPreview,
    bgColor,
    groundedEnabled,
    opacity,
  }: {
    logo: File | string | null;
    onLogoUpload: (file: File) => void;
    onLogoRemove: () => void;
    onLogoUploadError?: (error: string) => void;
    hdriPreview: string | null;
    bgColor: string;
    groundedEnabled: boolean;
    opacity: number;
  }) => {
    const logoSrc =
      logo instanceof File ? URL.createObjectURL(logo) : (logo ?? '');
    const logoName =
      logo instanceof File
        ? logo.name
        : logo
          ? (logo.split('/').pop() ?? 'Logo')
          : 'Upload Logo';

    const LOGO_MAX_SIZE = 1024 * 1024; // 1 MB in bytes

    return (
      <>
        <label
          htmlFor="logo-upload"
          className="bg-neutral-gray-300 border-neutral-gray-400 flex cursor-pointer flex-col gap-4 rounded-xl border px-4 py-3"
        >
          <div className="inline-flex w-full justify-between">
            <span className="max-w-50 truncate text-[14px] underline">
              {logoName}
            </span>
            <Icon
              icon={
                logo
                  ? 'solar:close-circle-linear'
                  : 'solar:upload-minimalistic-linear'
              }
              onClick={(e) => {
                if (logo) {
                  e.preventDefault();
                  onLogoRemove();
                }
              }}
              width={20}
              height={20}
            />
          </div>
          {logo && (
            <div className="flex w-full justify-center">
              <div className="relative flex w-50 items-center">
                {groundedEnabled ? (
                  <img
                    src={hdriPreview || ''}
                    className="aspect-square rounded-lg object-cover"
                    alt=""
                  />
                ) : (
                  <div
                    className="aspect-square w-full rounded-lg"
                    style={{ backgroundColor: bgColor }}
                  />
                )}
                <img
                  src={logoSrc}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain p-8"
                  alt=""
                  style={{ opacity }}
                />
              </div>
            </div>
          )}
        </label>
        <input
          id="logo-upload"
          type="file"
          accept=".png, .webp, .jpg, .jpeg"
          hidden
          onChange={(event) => {
            if (event.target.files && event.target.files[0]) {
              const file = event.target.files[0];
              if (file.size > LOGO_MAX_SIZE) {
                onLogoUploadError?.('Logo must be under 1 MB');
                event.target.value = ''; // Reset input
              } else {
                onLogoUpload(file);
              }
            }
          }}
        />
      </>
    );
  }
);

const VisualizerOptions = ({
  settings,
  onSettingChange,
  // onLogoClick,
  cameraControl,
}: VisualizerOptionsProps) => {
  const [hdriPreview, setHdriPreview] = useState<string | null>(null);
  const [hdriLoading, setHdriLoading] = useState(false);
  const [currControlsTab, setCurrControlsTab] = useState<'3d' | 'mrkt'>('3d');
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    description?: string;
  }>({
    open: false,
    type: 'success',
    title: '',
  });
  const { status } = useModelStore();
  const navigate = useNavigate();

  // Track custom environment URL for cleanup
  const customEnvUrlRef = useRef<string | null>(null);

  const showToast = (
    type: 'success' | 'error' | 'warning',
    title: string,
    description?: string
  ) => {
    setToast({ open: true, type, title, description });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 5000);
  };

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
          envType: 'custom',
          customEnvUrl: url,
          customEnvName: name,
        },
      }));
    },
    [onSettingChange]
  );

  const handleAxisChange = useCallback(
    (axis: 'x' | 'y' | 'z') => (checked: boolean) => {
      onSettingChange((prev) => ({
        ...prev,
        modelTransform: {
          ...prev.modelTransform,
          rotationAxis: {
            ...prev.modelTransform.rotationAxis,
            [axis]: checked,
          },
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

  const handleCameraPositionChange = useCallback(
    (axis: 'x' | 'y' | 'z') => (value: string) => {
      const positionValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(positionValue)) return;

      onSettingChange((prev) => ({
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
    [onSettingChange]
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

      onSettingChange((prev) => {
        const currentMin = prev.zoom.min;
        const currentMax = prev.zoom.max;

        let newMin = currentMin;
        let newMax = currentMax;

        if (type === 'min') {
          newMin = Math.min(zoomValue, currentMax - 0.1);
        } else {
          newMax = Math.max(zoomValue, currentMin + 0.1);
        }

        return {
          ...prev,
          zoom: {
            ...prev.zoom,
            min: newMin,
            max: newMax,
          },
        };
      });
    },
    [onSettingChange]
  );

  const roundToInteger = (value: number) => Math.round(value);

  const getOffsetBounds = useCallback((selector: string) => {
    const canvasEl = document.querySelector(
      '[data-threed-canvas-root="true"]'
    ) as HTMLElement | null;
    const targetEl = document.querySelector(selector) as HTMLElement | null;

    if (!canvasEl || !targetEl) return null;

    const canvasRect = canvasEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const left = targetRect.left - canvasRect.left;
    const top = targetRect.top - canvasRect.top;
    const right = left + targetRect.width;
    const bottom = top + targetRect.height;

    return {
      xDeltaMin: -left,
      xDeltaMax: canvasRect.width - right,
      yDeltaMin: -top,
      yDeltaMax: canvasRect.height - bottom,
    };
  }, []);

  const getCtaOffsetBounds = useCallback(
    () => getOffsetBounds('[data-threed-canvas-cta="true"]'),
    [getOffsetBounds]
  );

  const getBrandLogoOffsetBounds = useCallback(
    () => getOffsetBounds('[data-threed-canvas-brand-logo="true"]'),
    [getOffsetBounds]
  );

  const clampCtaOffsetToCanvas = useCallback(() => {
    onSettingChange((prev) => {
      const bounds = getCtaOffsetBounds();
      if (!bounds) return prev;

      const clampedX = roundToInteger(
        Math.min(
          Math.max(
            prev.ctaBtn.offset.x,
            prev.ctaBtn.offset.x + bounds.xDeltaMin
          ),
          prev.ctaBtn.offset.x + bounds.xDeltaMax
        )
      );
      const clampedY = roundToInteger(
        Math.min(
          Math.max(
            prev.ctaBtn.offset.y,
            prev.ctaBtn.offset.y + bounds.yDeltaMin
          ),
          prev.ctaBtn.offset.y + bounds.yDeltaMax
        )
      );

      if (
        clampedX === prev.ctaBtn.offset.x &&
        clampedY === prev.ctaBtn.offset.y
      ) {
        return prev;
      }

      return {
        ...prev,
        ctaBtn: {
          ...prev.ctaBtn,
          offset: {
            x: clampedX,
            y: clampedY,
          },
        },
      };
    });
  }, [getCtaOffsetBounds, onSettingChange]);

  const handleCtaPositionChange = useCallback(
    (pos: string) => {
      onSettingChange((prev) => ({
        ...prev,
        ctaBtn: {
          ...prev.ctaBtn,
          position: pos,
        },
      }));

      requestAnimationFrame(() => {
        clampCtaOffsetToCanvas();
      });
    },
    [clampCtaOffsetToCanvas, onSettingChange]
  );

  const handleCtaOffsetChange = useCallback(
    (axis: 'x' | 'y') => (value: string) => {
      const offsetValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(offsetValue)) return;

      onSettingChange((prev) => {
        const bounds = getCtaOffsetBounds();

        let nextOffset = offsetValue;

        if (bounds) {
          if (axis === 'x') {
            const minAllowed = prev.ctaBtn.offset.x + bounds.xDeltaMin;
            const maxAllowed = prev.ctaBtn.offset.x + bounds.xDeltaMax;
            nextOffset = roundToInteger(
              Math.min(Math.max(offsetValue, minAllowed), maxAllowed)
            );
          } else {
            const minAllowed = prev.ctaBtn.offset.y + bounds.yDeltaMin;
            const maxAllowed = prev.ctaBtn.offset.y + bounds.yDeltaMax;
            nextOffset = roundToInteger(
              Math.min(Math.max(offsetValue, minAllowed), maxAllowed)
            );
          }
        }

        return {
          ...prev,
          ctaBtn: {
            ...prev.ctaBtn,
            offset: {
              ...prev.ctaBtn.offset,
              [axis]: nextOffset,
            },
          },
        };
      });
    },
    [getCtaOffsetBounds, onSettingChange]
  );

  const clampBrandLogoOffsetToCanvas = useCallback(() => {
    onSettingChange((prev) => {
      const bounds = getBrandLogoOffsetBounds();
      if (!bounds) return prev;

      const clampedX = roundToInteger(
        Math.min(
          Math.max(
            prev.brandLogo.offset.x,
            prev.brandLogo.offset.x + bounds.xDeltaMin
          ),
          prev.brandLogo.offset.x + bounds.xDeltaMax
        )
      );
      const clampedY = roundToInteger(
        Math.min(
          Math.max(
            prev.brandLogo.offset.y,
            prev.brandLogo.offset.y + bounds.yDeltaMin
          ),
          prev.brandLogo.offset.y + bounds.yDeltaMax
        )
      );

      if (
        clampedX === prev.brandLogo.offset.x &&
        clampedY === prev.brandLogo.offset.y
      ) {
        return prev;
      }

      return {
        ...prev,
        brandLogo: {
          ...prev.brandLogo,
          offset: {
            x: clampedX,
            y: clampedY,
          },
        },
      };
    });
  }, [getBrandLogoOffsetBounds, onSettingChange]);

  const handleBrandLogoPositionChange = useCallback(
    (pos: string) => {
      onSettingChange((prev) => ({
        ...prev,
        brandLogo: {
          ...prev.brandLogo,
          position: pos,
        },
      }));

      requestAnimationFrame(() => {
        clampBrandLogoOffsetToCanvas();
      });
    },
    [clampBrandLogoOffsetToCanvas, onSettingChange]
  );

  const handleBrandLogoScaleChange = useCallback(
    (value: number) => {
      const roundedScale = Math.round(value) / 100;

      onSettingChange((prev) => ({
        ...prev,
        brandLogo: {
          ...prev.brandLogo,
          scale: roundedScale,
        },
      }));

      requestAnimationFrame(() => {
        clampBrandLogoOffsetToCanvas();
      });
    },
    [clampBrandLogoOffsetToCanvas, onSettingChange]
  );

  const handleBrandLogoOffsetChange = useCallback(
    (axis: 'x' | 'y') => (value: string) => {
      const offsetValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(offsetValue)) return;

      onSettingChange((prev) => {
        const bounds = getBrandLogoOffsetBounds();

        let nextOffset = offsetValue;

        if (bounds) {
          if (axis === 'x') {
            const minAllowed = prev.brandLogo.offset.x + bounds.xDeltaMin;
            const maxAllowed = prev.brandLogo.offset.x + bounds.xDeltaMax;
            nextOffset = roundToInteger(
              Math.min(Math.max(offsetValue, minAllowed), maxAllowed)
            );
          } else {
            const minAllowed = prev.brandLogo.offset.y + bounds.yDeltaMin;
            const maxAllowed = prev.brandLogo.offset.y + bounds.yDeltaMax;
            nextOffset = roundToInteger(
              Math.min(Math.max(offsetValue, minAllowed), maxAllowed)
            );
          }
        }

        return {
          ...prev,
          brandLogo: {
            ...prev.brandLogo,
            offset: {
              ...prev.brandLogo.offset,
              [axis]: nextOffset,
            },
          },
        };
      });
    },
    [getBrandLogoOffsetBounds, onSettingChange]
  );

  return (
    <div className="font-metropolis text-neutral-gray-900 bg-neutral-gray-200 flex h-full w-75 flex-col gap-8 overflow-scroll overflow-x-hidden px-4 pt-9 pb-6">
      <img
        src="/assets/icons/Commverse Logo - Final.svg"
        alt="comm-logo"
        className="h-auto max-w-47.5 cursor-pointer"
        onClick={() => {
          navigate('/dashboard');
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
                modelFile: prev.modelFile,
              }));
            }}
          >
            Reset
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="border-neutral-gray-400 bg-neutral-gray-300 flex cursor-pointer justify-between rounded-xl border p-1 text-[12px] font-semibold">
            <div
              className={`w-full py-2 text-center ${currControlsTab === '3d' ? 'rounded-lg bg-white' : ''}`}
              onClick={() => setCurrControlsTab('3d')}
            >
              Adjustments
            </div>
            <div
              className={`w-full py-2 text-center ${currControlsTab === 'mrkt' ? 'rounded-lg bg-white' : ''}`}
              onClick={() => setCurrControlsTab('mrkt')}
            >
              User Controls
            </div>
          </div>
          <div className="text-[12px]">
            <span>
              {currControlsTab === '3d'
                ? 'Controls to tweak your experience'
                : 'Controls and options that will be displayed in the deployed experience'}{' '}
            </span>
          </div>
        </div>

        {currControlsTab === '3d' ? (
          <div className="relative flex flex-col p-2">
            {status != 'ready' && (
              <div className="bg-neutral-gray-200/60 absolute inset-0 z-10 cursor-not-allowed" />
            )}
            <div className="flex flex-col gap-3">
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

              {/* Model Rotation Limits */}
              <Section
                title="Model Rotation Limits"
                titleClassName="text-[12px]! font-normal!"
                onReset={() => {
                  onSettingChange((prev) => ({
                    ...prev,
                    modelTransform: {
                      ...prev.modelTransform,
                      rotationAxis: defaultSettings.modelTransform.rotationAxis,
                    },
                  }));
                }}
              >
                <div className="grid grid-cols-3 gap-2">
                  <Checkbox
                    id="x-axis"
                    label="X"
                    checked={settings.modelTransform.rotationAxis.x}
                    onChange={handleAxisChange('x')}
                  />
                  <Checkbox
                    id="y-axis"
                    label="Y"
                    checked={settings.modelTransform.rotationAxis.y}
                    onChange={handleAxisChange('y')}
                  />
                  {/* <Checkbox
                    id="z-axis"
                    label="Z"
                    checked={settings.modelTransform.rotationAxis.z}
                    onChange={handleAxisChange('z')}
                  /> */}
                </div>
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
                    onSettingChange((prev) => ({
                      ...prev,
                      zoom: defaultSettings.zoom,
                    }));
                  }}
                />
              </div>
              <DualSlider
                min={1}
                max={20}
                minValue={settings.zoom.min}
                maxValue={settings.zoom.max}
                onMinChange={handleZoomChange('min')}
                onMaxChange={handleZoomChange('max')}
                clampToBounds={true}
              />
              <div className="flex w-full gap-2">
                <InputComponent
                  id="zoom-min"
                  label="Minimum"
                  type="number"
                  step="0.1"
                  max={settings.zoom.max - 0.1}
                  value={settings.zoom.min.toString()}
                  onChange={(e: any) => {
                    handleZoomChange('min')(e);
                  }}
                />
                <InputComponent
                  id="zoom-max"
                  label="Maximum"
                  type="number"
                  step="0.1"
                  min={settings.zoom.min + 0.1}
                  value={settings.zoom.max.toString()}
                  onChange={(e: any) => {
                    handleZoomChange('max')(e);
                  }}
                />
              </div>
            </div>

            <LineComponent />

            {/* Shadow */}
            <Section
              title="Shadow"
              // extraIcons={
              //   <ToggleSwitch
              //     isOn={settings.shadow.enabled}
              //     onToggle={() => {
              //       onSettingChange((prev) => ({
              //         ...prev,
              //         shadow: {
              //           ...prev.shadow,
              //           enabled: !prev.shadow.enabled,
              //         },
              //       }));
              //     }}
              //   />
              // }
            >
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
                  settings.environment.customEnvUrl &&
                  settings.environment.customEnvName
                )}
                uploadedLabel={settings.environment.customEnvName}
                allowedFileTypes={['.hdr', '.jpg', '.jpeg']}
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
              <div className="inline-flex w-full text-[12px]">
                <button
                  className={`border-neutral-gray-400 flex-1 cursor-pointer rounded-l-lg border py-2 ${settings.environment.grounded ? 'bg-neutral-gray-800 font-semibold text-white' : 'bg-neutral-gray-300 text-neutral-gray-800 font-medium'}`}
                  onClick={() =>
                    onSettingChange((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        grounded: true,
                      },
                    }))
                  }
                >
                  Environment
                </button>
                <button
                  className={`border-neutral-gray-400 ${!settings.environment.grounded ? 'bg-neutral-gray-800 font-semibold text-white' : 'bg-neutral-gray-300 text-neutral-gray-800 font-medium'} flex-1 cursor-pointer rounded-r-lg border border-l-0 py-2`}
                  onClick={() =>
                    onSettingChange((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        grounded: false,
                      },
                    }))
                  }
                >
                  Solid Colour
                </button>
              </div>

              {/* Environment Settings */}
              {settings.environment.grounded && (
                <>
                  <SliderComponent
                    value={settings.environment.envHeight || 12}
                    label="Floor Height"
                    onChange={(value) =>
                      onSettingChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envHeight: value,
                        },
                      }))
                    }
                    onReset={() => {
                      onSettingChange((prev) => ({
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
                    value={settings.environment.envRadius || 60}
                    label="Adjust Surroundings"
                    onChange={(value) =>
                      onSettingChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envRadius: value,
                        },
                      }))
                    }
                    onReset={() => {
                      onSettingChange((prev) => ({
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
                    value={settings.environment.envScale || 20}
                    label="Scale"
                    onChange={(value) =>
                      onSettingChange((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          envScale: value,
                        },
                      }))
                    }
                    onReset={() => {
                      onSettingChange((prev) => ({
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
              {!settings.environment.grounded && (
                <InputComponent
                  id="env-color"
                  label="Background Color"
                  type="color"
                  containerClassName="gap-2! w-full!"
                  value={settings.environment.envBgColor}
                  onChange={(e: any) =>
                    onSettingChange((prev) => ({
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
                  onSettingChange((prev) => ({
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
                      onClick={cameraControl?.setCameraPosition}
                    />
                    <Icon
                      icon="solar:eye-linear"
                      width={16}
                      height={16}
                      className="text-neutral-gray-800 cursor-pointer"
                      onClick={cameraControl?.preview}
                    />
                  </>
                }
              >
                <TripleInput
                  values={settings.camera.position}
                  onChange={handleCameraPositionChange}
                />
              </Section>
            </Section>
          </div>
        ) : (
          // MARKETING CONTROLS TAB
          <div className="relative text-[12px] font-medium">
            {status != 'ready' && (
              <div className="bg-neutral-gray-200/60 absolute inset-0 z-10 cursor-not-allowed" />
            )}
            {/* CTA */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold">CTA</span>
                <ToggleSwitch
                  isOn={settings.ctaBtn.enabled}
                  onToggle={() => {
                    onSettingChange((prev) => ({
                      ...prev,
                      ctaBtn: {
                        ...prev.ctaBtn,
                        enabled: !prev.ctaBtn.enabled,
                      },
                    }));
                  }}
                />
              </div>

              {settings.ctaBtn.enabled && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span>Button Text</span>
                    <IconInput
                      type="text"
                      placeholder="Add to Cart, Buy Now..."
                      value={settings.ctaBtn.content}
                      maxLength={40}
                      className="placeholder:text-neutral-gray-900 px-3! py-2! font-normal"
                      onChange={(e: any) => {
                        onSettingChange((prev) => ({
                          ...prev,
                          ctaBtn: {
                            ...prev.ctaBtn,
                            content: e,
                          },
                        }));
                      }}
                      onBlur={() => {
                        if (!settings.ctaBtn.content?.trim()) {
                          onSettingChange((prev) => ({
                            ...prev,
                            ctaBtn: {
                              ...prev.ctaBtn,
                              content: 'Add to cart',
                            },
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span>Redirect Link</span>
                    <IconInput
                      type="text"
                      placeholder="https://example.com/product"
                      value={settings.ctaBtn.url}
                      className="placeholder:text-neutral-gray-900 px-3! py-2! font-normal"
                      onChange={(e: any) => {
                        onSettingChange((prev) => ({
                          ...prev,
                          ctaBtn: {
                            ...prev.ctaBtn,
                            url: e,
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span>Position & Offset</span>
                    <div className="flex gap-2">
                      <PositionComponent
                        position={settings.ctaBtn.position}
                        setPosition={handleCtaPositionChange}
                        offsets={{
                          x: settings.ctaBtn.offset.x,
                          y: settings.ctaBtn.offset.y,
                        }}
                        onOffsetChange={handleCtaOffsetChange}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex w-full flex-col gap-2">
                      <span>Button Color</span>
                      <ColorInput
                        value={settings.ctaBtn.btnColor}
                        onChange={(e: any) => {
                          onSettingChange((prev) => ({
                            ...prev,
                            ctaBtn: {
                              ...prev.ctaBtn,
                              btnColor: e,
                            },
                          }));
                        }}
                      />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      <span>Text Color</span>
                      <ColorInput
                        value={settings.ctaBtn.textColor}
                        onChange={(e: any) => {
                          onSettingChange((prev) => ({
                            ...prev,
                            ctaBtn: {
                              ...prev.ctaBtn,
                              textColor: e,
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <LineComponent />

            {/* user branding */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center justify-between">
                <span className="text-[13px] font-semibold">
                  Logo & Branding
                </span>
                <ToggleSwitch
                  isOn={settings.brandLogo.enabled}
                  onToggle={() => {
                    onSettingChange((prev) => ({
                      ...prev,
                      brandLogo: {
                        ...prev.brandLogo,
                        enabled: !prev.brandLogo.enabled,
                      },
                    }));
                  }}
                />
              </div>

              {settings.brandLogo.enabled && (
                <div className="flex flex-col gap-4">
                  <UserLogoPrevComponent
                    logo={settings.brandLogo.logo}
                    onLogoUpload={(file) => {
                      onSettingChange((prev) => ({
                        ...prev,
                        brandLogo: {
                          ...prev.brandLogo,
                          logo: file,
                        },
                      }));
                    }}
                    onLogoRemove={() => {
                      onSettingChange((prev) => ({
                        ...prev,
                        brandLogo: {
                          ...prev.brandLogo,
                          logo: null,
                        },
                      }));
                    }}
                    onLogoUploadError={(error) => {
                      showToast('error', 'Failed', error);
                    }}
                    hdriPreview={hdriPreview}
                    bgColor={settings.environment.envBgColor}
                    groundedEnabled={settings.environment.grounded}
                    opacity={settings.brandLogo.opacity}
                  />
                  {settings.brandLogo.logo && (
                    <div className="flex flex-col gap-4">
                      <SliderComponent
                        label="Scale"
                        min={0}
                        max={100}
                        step={1}
                        value={settings.brandLogo.scale * 100}
                        onChange={handleBrandLogoScaleChange}
                        onReset={() => {
                          onSettingChange((prev) => ({
                            ...prev,
                            brandLogo: {
                              ...prev.brandLogo,
                              scale: defaultSettings.brandLogo.scale,
                            },
                          }));
                        }}
                      />

                      <SliderComponent
                        label="Opacity"
                        min={0}
                        max={100}
                        step={1}
                        value={settings.brandLogo.opacity * 100}
                        onChange={(e) => {
                          onSettingChange((prev) => ({
                            ...prev,
                            brandLogo: {
                              ...prev.brandLogo,
                              opacity: e / 100,
                            },
                          }));
                        }}
                        onReset={() => {
                          onSettingChange((prev) => ({
                            ...prev,
                            brandLogo: {
                              ...prev.brandLogo,
                              opacity: defaultSettings.brandLogo.opacity,
                            },
                          }));
                        }}
                      />

                      {/* <div className="flex flex-col gap-2"></div> */}
                      <span>Position & Offset</span>
                      <div className="flex gap-2">
                        <PositionComponent
                          position={settings.brandLogo.position}
                          setPosition={handleBrandLogoPositionChange}
                          offsets={{
                            x: settings.brandLogo.offset.x,
                            y: settings.brandLogo.offset.y,
                          }}
                          onOffsetChange={handleBrandLogoOffsetChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {toast.open && (
        <div className="fixed right-4 bottom-4 z-50">
          <ToastCard
            type={toast.type}
            title={toast.title}
            description={toast.description}
            isClosable={true}
          />
        </div>
      )}
    </div>
  );
};

export default VisualizerOptions;
