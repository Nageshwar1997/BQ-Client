import { Link } from 'react-router-dom';
import type { IGradientText } from '@/Types/Common.type';

const Text = ({ text, type, className, children }: IGradientText) => (
  <span
    className={`text-fill-transparent w-fit ${type === 'accent' ? 'bg-accent-duo' : 'bg-silver-duo'} ${className}`}
  >
    {children ? children : text}
  </span>
);
export const GradientText = (props: IGradientText) => {
  const { path, className, ...rest } = props;
  return path ? (
    <Link to={path} className={`${className ?? ''}`}>
      <Text {...rest} />
    </Link>
  ) : (
    <Text {...rest} className={className} />
  );
};
