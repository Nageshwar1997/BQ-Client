import { Link } from 'react-router';
import Userprofile from '../Userprofile';

const TopHeader = () => {
  return (
    <header className="flex items-center justify-between gap-6 px-8 py-5">
      <Link to="/" className="inline-block transition-opacity hover:opacity-80">
        <img
          src="/assets/icons/Commverse Logo - Final.svg"
          alt="logo"
          className="h-auto w-full max-w-51 cursor-pointer object-cover"
        />
      </Link>
      <Userprofile />
    </header>
  );
};

export default TopHeader;
