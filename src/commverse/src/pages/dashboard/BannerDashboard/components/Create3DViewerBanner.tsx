import CreateModuleBanner from './CreateModuleBanner';
import {
  type CreateBannerVariant,
  createBannerVariantMap,
} from './createBannerVariants';

type Create3DViewerBannerProps = {
  variant?: CreateBannerVariant;
  onButtonClick?: () => void;
};

const Create3DViewerBanner = ({
  variant = '3d-visualizer',
  onButtonClick,
}: Create3DViewerBannerProps) => {
  const config = createBannerVariantMap[variant];

  return (
    <CreateModuleBanner
      title={config.title}
      subtitle={config.subtitle}
      buttonText={config.buttonText}
      buttonIcon={config.buttonIcon}
      heroIcon={config.heroIcon}
      // heroAssetUrl={config.heroAssetUrl}
      accentColor={config.accentColor}
      fillBackground={config.fillBackground}
      strokeBackground={config.strokeBackground}
      buttonBgColor={config.buttonBgColor}
      onButtonClick={onButtonClick}
      nodeId={config.nodeId}
      buttonNodeId={config.buttonNodeId}
      heroNodeId={config.heroNodeId}
    />
  );
};

export default Create3DViewerBanner;
