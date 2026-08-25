interface StoreBrandLogoCardProps {
  logoSrc?: string;
  logoAlt?: string;
}

const StoreBrandLogoCard = ({
  logoSrc = '/assets/icons/Commverse Logo - Final.svg',
  logoAlt = 'Brand Logo',
}: StoreBrandLogoCardProps) => {
  return (
    <div className="inline-flex flex-col items-center justify-start gap-3 overflow-hidden rounded-2xl bg-white p-8">
      <img src={logoSrc} alt={logoAlt} className="h-16 w-16 object-contain" />
    </div>
  );
};

export default StoreBrandLogoCard;
