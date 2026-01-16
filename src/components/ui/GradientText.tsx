import { Link } from 'react-router-dom';
import type { IGradientText } from '../../types';

const Text = ({ text, type, className }: IGradientText) => (
  <span
    className={`w-fit bg-clip-text text-transparent ${type === 'accent' ? 'bg-accent-duo' : 'bg-silver-duo'} ${className}`}
  >
    {text}
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
