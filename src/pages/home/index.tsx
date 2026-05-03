import Theme from '@/components/ui/Theme';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="grid gap-6">
      <Theme />
      <Link to="/auth/change-password">Change Password</Link>
      <Link to="/auth/set-password">Set Password</Link>
      <Link to="/auth">Login</Link>
      <Link to="/auth/register">Register</Link>
    </div>
  );
};

export default Home;
