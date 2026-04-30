import Theme from '@/components/ui/Theme';
import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <div>
      <Theme />
      <Link to={"/auth"}>Auth</Link>
    </div>
  );
};

export default Main;
