import { OAUTH_DATA } from '@/constants/common.constants';
import { Link } from 'react-router-dom';

const SocialAuth = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      {OAUTH_DATA.map(({ name, imgSrc, redirectUrl }, index) => (
        <Link
          key={index}
          to={redirectUrl}
          className="border-primary/40 shadow-primary/50 mb-2.5 h-12 w-12 rounded-xl border bg-white p-2.5 shadow-sm backdrop-blur-sm transition-transform duration-500 hover:scale-110"
        >
          <img src={imgSrc} alt={name} className="h-full w-full object-cover p-0.5" title={name} />
        </Link>
      ))}
    </div>
  );
};

export default SocialAuth;
