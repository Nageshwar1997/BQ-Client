import type { ReactNode } from 'react';

interface EmptyStateProps {
  iconSrc?: string;
  iconAlt?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const EmptyState = ({
  iconSrc,
  iconAlt,
  title,
  description,
  actions,
  className = '',
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-8 py-12 ${className}`}
    >
      {iconSrc && iconAlt && <img src={iconSrc} alt={iconAlt} />}

      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="font-metropolis text-neutral-gray-600 text-sm font-medium">
          {title}
        </h2>
        {description && (
          <span className="font-metropolis text-neutral-gray-500 text-xs font-normal">
            {description}
          </span>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default EmptyState;
