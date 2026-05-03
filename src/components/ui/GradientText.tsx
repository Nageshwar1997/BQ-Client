import type { IGradientText } from '@/types/component.type';
import { Link } from 'react-router-dom';

const Text = ({ text, type, className, children }: IGradientText) => (
  <span
    className={`text-fill-transparent w-fit ${type === 'accent' ? 'bg-accent-duo' : 'bg-silver-duo'} ${className}`}
  >
    {children ? children : text}
  </span>
);
const GradientText = (props: IGradientText) => {
  const { path, className, ...rest } = props;
  return path ? (
    <Link to={path} className={`${className ?? ''}`}>
      <Text {...rest} />
    </Link>
  ) : (
    <Text {...rest} className={className} />
  );
};

export default GradientText;
