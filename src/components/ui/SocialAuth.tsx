import envs from '@/envs';
import { Link } from 'react-router-dom';
import LastRouteTracker from '../LastRouteTracker';

const SocialAuth = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <LastRouteTracker />
      {['Google', 'Github', 'Linkedin'].map((name, index) => (
        <Link
          to={`${envs.urls.gateway}/api/v1/user-service/auth/login/oauth/${name.toLowerCase()}/redirect`}
          key={index}
          className="border-primary/40 shadow-primary/50 mb-2.5 h-12 w-12 rounded-xl border bg-white p-2.5 shadow-sm backdrop-blur-sm transition-transform duration-500 hover:scale-110"
        >
          <img
            src={`/images/auth/social/${name}.webp`}
            alt={name}
            className="h-full w-full object-cover p-0.5"
            title={name}
          />
        </Link>
      ))}
    </div>
  );
};

export default SocialAuth;
