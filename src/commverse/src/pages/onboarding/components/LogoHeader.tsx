type LogoHeaderProps = {
  className?: string;
  logoClassName?: string;
  logoSrc?: string;
  logoAlt?: string;
};

const LogoHeader = ({
  className = '',
  logoClassName = 'h-[16px]',
  logoSrc = '/assets/icons/Commverse Logo - Final.svg',
  logoAlt = 'Commverse Studio',
}: LogoHeaderProps) => {
  return (
    <div
      className={`flex h-22 w-full shrink-0 flex-col items-center justify-center px-12 py-5 ${className}`}
    >
      <img
        src={logoSrc}
        alt={logoAlt}
        className={logoClassName}
      />
    </div>
  );
};

export default LogoHeader;
