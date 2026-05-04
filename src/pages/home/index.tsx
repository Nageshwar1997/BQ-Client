import Theme from '@/components/ui/Theme';
import { Link } from 'react-router-dom';
import HomeVideoCarousel from './HomeVideoCarousel';

const Home = () => {
  return (
    <div className="h-full w-full space-y-5 lg:-mt-16 lg:space-y-10">
      <HomeVideoCarousel />
      <Theme />
      <Link to="/auth/change-password">Change Password</Link>
      <Link to="/auth/set-password">Set Password</Link>
      <Link to="/auth">Login</Link>
      <Link to="/auth/register">Register</Link>
    </div>
  );
};

export default Home;
