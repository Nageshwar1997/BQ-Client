import type { VisualizerProps } from '../../../../types';
import { useEffect, useState, useCallback, memo } from 'react';
import { tailwindPosMap } from '../../../../constants';
import Canvas3D from '../../../../3d/Components/Canvas3D';

interface ThreeDCanvasProps {
  assetId?: string;
  experienceId?: string;
  settings: VisualizerProps;
  modelUrl: string;
}

// -------------------- CTA Button Component --------------------
const CTAButton = memo(function CTAButton({
  cta,
}: {
  cta: VisualizerProps['ctaBtn'];
}) {
  const handleClick = useCallback(() => {
    if (cta.url) window.open(cta.url, '_blank');
  }, [cta.url]);

  if (!cta.enabled) return null;

  return (
    <button
      data-threed-canvas-cta="true"
      className={`${tailwindPosMap[cta.position]} font-metropolis pointer-events-auto absolute z-1 h-auto! w-auto! cursor-pointer rounded-lg px-3 py-2 font-semibold whitespace-nowrap`}
      style={{
        transform: `translate(${cta.offset.x}px, ${cta.offset.y}px)`,
        backgroundColor: cta.btnColor,
        color: cta.textColor,
      }}
      onClick={handleClick}
    >
      {cta.content}
    </button>
  );
});

// -------------------- Brand Logo Component --------------------
const BrandLogo = memo(function BrandLogo({
  brandLogo,
}: {
  brandLogo: VisualizerProps['brandLogo'];
}) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!brandLogo.enabled || !brandLogo.logo) {
      setLogoUrl(null);
      return;
    }

    const url =
      typeof brandLogo.logo === 'string'
        ? brandLogo.logo
        : URL.createObjectURL(brandLogo.logo);

    setLogoUrl(url);
    // Cleanup
    return () => {
      if (typeof brandLogo.logo !== 'string' && url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [brandLogo.enabled, brandLogo.logo]);

  if (!brandLogo.enabled || !logoUrl) return null;

  return (
    <img
      data-threed-canvas-brand-logo="true"
      src={logoUrl}
      className={`${tailwindPosMap[brandLogo.position]} pointer-events-none absolute z-10 h-auto max-h-20 w-auto max-w-20 transform`}
      style={{
        transform: `translate(${brandLogo.offset.x}px, ${brandLogo.offset.y}px) scale(${brandLogo.scale})`,
        opacity: brandLogo.opacity,
      }}
      alt="Brand Logo"
    />
  );
});

// -------------------- ThreeDCanvas Component --------------------
const ThreeDCanvas = memo(function ThreeDCanvas({
  assetId,
  experienceId,
  settings,
  modelUrl,
}: ThreeDCanvasProps) {
  if (assetId) {
    settings.assetId = [assetId];
    settings.experienceId = experienceId || null;
  }

  return (
    <div className="relative h-full w-full" data-threed-canvas-root="true">
      <Canvas3D settings={settings} modelUrl={modelUrl} />
      <CTAButton cta={settings.ctaBtn} />
      <BrandLogo brandLogo={settings.brandLogo} />
    </div>
  );
});

export default ThreeDCanvas;
