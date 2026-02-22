import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../../../Constants';

export const SocialAuth = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      {['Google', 'Github', 'Linkedin'].map((name, index) => (
        <Link
          to={`${BACKEND_URL}/api/auth/${name.toLowerCase()}`}
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
