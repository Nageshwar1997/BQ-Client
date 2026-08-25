import type { ReactNode } from 'react';
import { Rotate3DIcon, VersaAiBlackStars } from '../../icons';
import Button from '../Button';
import type { ButtonProps, THeaderVariant } from '../../types';
import { Icon } from '@iconify/react';
import Userprofile from '../Userprofile';

const ThreeDVisualizerGradientText = () => {
  return (
    <div className="font-metropolis flex items-center gap-[5.86px]">
      <Rotate3DIcon className="size-7" />
      <span className="text-module-3d-viz text-2xl/7.5 font-medium">
        3D Visualizer
      </span>
    </div>
  );
};

const ArExperienceGradientText = () => {
  return (
    <div className="font-metropolis flex items-center gap-[5.86px]">
      <Icon icon="lucide:rotate-3d" className="text-module-ar size-7" />
      <span className="text-module-ar text-2xl/7.5 font-medium">
        AR Experience
      </span>
    </div>
  );
};

const ConfiguratorGradientText = () => {
  return (
    <div className="font-metropolis flex items-center gap-[5.86px]">
      <Icon
        icon="solar:tuning-square-2-linear"
        className="text-module-configurator size-7"
      />
      <span className="text-module-configurator text-2xl/7.5 font-medium">
        Configurator
      </span>
    </div>
  );
};

const SocialGradientText = () => {
  return (
    <div className="font-metropolis flex items-center gap-[5.86px]">
      <Icon
        icon="solar:wallpaper-linear"
        className="text-module-social size-7"
      />
      <span className="text-module-social text-2xl/7.5 font-medium">
        Social Creatives
      </span>
    </div>
  );
};

const StorefrontGradientText = () => {
  return (
    <div className="font-metropolis flex items-center gap-[5.86px]">
      <Icon
        icon="solar:shop-linear"
        className="text-module-storefront size-7"
      />
      <span className="text-module-storefront text-2xl/7.5 font-medium">
        Virtual Store
      </span>
    </div>
  );
};

const VersaAiGradientText = () => {
  return (
    <div className="flex items-center gap-[5.86px]">
      <span className="bg-gradient-versa font-degular bg-clip-text text-[31px]/[37px] font-semibold text-transparent">
        Versa
      </span>
      <span className="bg-gradient-degular font-degular bg-clip-text text-[31px]/[37px] text-transparent">
        AI
      </span>
      <VersaAiBlackStars />
    </div>
  );
};

const VideoGradientTexts = () => {
  return (
    <div className="font-metropolis flex items-center gap-[5.86px]">
      <Icon
        icon="solar:videocamera-add-linear"
        className="text-module-video size-7"
      />
      <span className="text-module-video text-2xl/7.5 font-medium">
        Video Ads
      </span>
    </div>
  );
};

const VirtualTryOnGradientText = () => {
  return (
    <div className="font-metropolis flex items-center gap-[5.86px]">
      <Icon
        icon="solar:face-scan-square-linear"
        className="text-module-tryon size-7"
      />
      <span className="text-module-tryon text-2xl/7.5 font-medium">
        Virtual Try-Ons
      </span>
    </div>
  );
};

const HeaderLeftSection = ({
  gradientContent,
  description,
  onClick,
}: {
  gradientContent: ReactNode;
  description?: string;
  onClick?: () => void;
}) => (
  <div className="flex cursor-pointer flex-col gap-1" onClick={onClick}>
    {gradientContent}
    {description && (
      <p className="text-neutral-gray-600 font-metropolis text-sm/[17px]">
        {description}
      </p>
    )}
  </div>
);

const leftPart = (variant: THeaderVariant, onClick?: () => void) => {
  switch (variant) {
    case '3d-visualizer':
      return (
        <HeaderLeftSection
          gradientContent={<ThreeDVisualizerGradientText />}
          description="Create interactive 3D views"
          onClick={onClick}
        />
      );
    case 'ar-experience':
      return (
        <HeaderLeftSection
          gradientContent={<ArExperienceGradientText />}
          description="Bring products into the real world"
          onClick={onClick}
        />
      );
    case 'configurator':
      return (
        <HeaderLeftSection
          gradientContent={<ConfiguratorGradientText />}
          description="Create configurators with product variations"
          onClick={onClick}
        />
      );
    case 'social':
      return (
        <HeaderLeftSection
          gradientContent={<SocialGradientText />}
          description="Versa AI reconstructs 3D models from just your images — no 3D files needed."
          onClick={onClick}
        />
      );
    case 'storefront':
      return (
        <HeaderLeftSection
          gradientContent={<StorefrontGradientText />}
          description="Build interactive virtual stores"
          onClick={onClick}
        />
      );
    case 'versa-ai':
      return (
        <HeaderLeftSection
          gradientContent={<VersaAiGradientText />}
          description="Turn simple images into production-ready 3D models in seconds"
          onClick={onClick}
        />
      );
    case 'video-ad':
      return (
        <HeaderLeftSection
          gradientContent={<VideoGradientTexts />}
          description="Versa AI reconstructs 3D models from just your images — no 3D files needed."
          onClick={onClick}
        />
      );
    case 'virtual-try-on':
      return (
        <HeaderLeftSection
          gradientContent={<VirtualTryOnGradientText />}
          description="Let customers try before they buy"
          onClick={onClick}
        />
      );
    default:
      return null;
  }
};

const Header = ({
  onIconClick,
  section,
  buttons,
}: {
  onIconClick?: () => void;
  section: THeaderVariant;
  buttons: {
    settings?: Omit<ButtonProps, 'content'> & { modalContent?: ReactNode };
    save?: ButtonProps & { modalContent?: ReactNode };
    publish?: ButtonProps & { modalContent?: ReactNode };
  };
}) => {
  const { settings, save, publish } = buttons;
  const { modalContent: settingsModalContent, ...restSettings } =
    settings ?? {};
  const { modalContent: saveModalContent, ...restSave } = save ?? {};
  const { modalContent: publishModalContent, ...restPublish } = publish ?? {};
  const userprofileVariant = section === 'versa-ai' ? 'full' : 'avatar-menu';

  return (
    <header className="flex items-center justify-between gap-5 py-5 pr-12 pl-8">
      {leftPart(section, onIconClick)}
      <div className="flex items-center gap-2">
        <Userprofile variant={userprofileVariant} />
        {buttons && (
          <>
            {settings && (
              <div className="relative [&>button]:h-10! [&>button]:px-4! [&>button]:py-2.5">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={
                    <Icon
                      icon="solar:settings-linear"
                      className="text-neutral-gray-900 **:stroke-1.5 size-5"
                    />
                  }
                  {...restSettings}
                />
                {settingsModalContent}
              </div>
            )}
            {save && (
              <div className="relative [&>button]:h-10! [&>button]:px-4! [&>button]:py-2.5">
                <Button
                  variant="tertiary"
                  size="sm"
                  content="Save"
                  {...restSave}
                />
                {saveModalContent}
              </div>
            )}
            {publish && (
              <div className="relative [&>button]:h-10! [&>button]:px-4! [&>button]:py-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  content="Publish"
                  leftIcon={<Icon icon="lucide:rocket" className="size-5" />}
                  {...restPublish}
                />
                {publishModalContent}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
