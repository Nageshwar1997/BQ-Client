import Theme from '@/components/ui/Theme';
import { Link } from 'react-router-dom';
import HomeHero from './HomeHero';
import HomeVideoCarousel from './HomeVideoCarousel';

const Home = () => {
  return (
    <div className="h-full w-full lg:-mt-16">
      <HomeVideoCarousel />
      <HomeHero />
      <Theme />
      <Link to="/auth/change-password">Change Password</Link>
      <Link to="/auth/set-password">Set Password</Link>
      <Link to="/auth">Login</Link>
      <Link to="/auth/register">Register</Link>
    </div>
  );
};

export default Home;
