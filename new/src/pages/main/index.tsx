import LastNonAuthPathTracker from '@/components/LastNonAuthPathTracker';
import Theme from '@/components/ui/Theme';
import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <div>
      <LastNonAuthPathTracker />
      <Theme />
      <Link to='/auth'>Auth</Link>
    </div>
  );
};

export default Main;
