import { memo, useMemo } from 'react';
import type { VisualizerProps } from '../../../types';
import { Environment } from '@react-three/drei';
import { ENV_PRESETS } from '../../../constants';

interface ISceneEnvironment {
  envSettings: VisualizerProps['environment'];
}

const SceneEnvironement = memo(function SceneEnvironemt({
  envSettings,
}: ISceneEnvironment) {
  const {
    envType,
    customEnvUrl,
    customEnvName,
    presetName,
    lightIntensity,
    grounded,
    envHeight,
    envRadius,
    envScale,
  } = envSettings;

  const envUrl = useMemo(() => {
    if (envType === 'custom' && customEnvUrl) {
      if (customEnvUrl.includes('#')) {
        return customEnvUrl;
      }
      // Use the actual file extension from customEnvName if available
      const extension = customEnvName?.split('.').pop()?.toLowerCase() || 'hdr';
      return `${customEnvUrl}#file.${extension}`;
    }
    return ENV_PRESETS.find((preset) => preset.name === presetName)?.url;
  }, [envType, customEnvUrl, customEnvName, presetName]);

  const groundConfig = useMemo(
    () =>
      grounded
        ? {
            height: envHeight,
            radius: envRadius,
            scale: envScale,
          }
        : undefined,
    [grounded, envHeight, envRadius, envScale]
  );

  return (
    <Environment
      background={false}
      files={envUrl}
      environmentIntensity={lightIntensity}
      ground={groundConfig}
    />
  );
});

export default SceneEnvironement;
