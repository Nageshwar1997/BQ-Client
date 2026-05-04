import Button from '@/components/ui/Button';
import useThemeStore from '@/stores/theme.store';
import useUserStore from '@/stores/user.store';
import { Link } from 'react-router-dom';

const HomeHero = () => {
  const theme = useThemeStore((s) => s.theme);
  const authenticated = useUserStore((s) => s.authenticated);
  return (
    <div className="to-blue-crayola-c/50 via-blue-crayola-c from-blue-crayola-c/70 relative h-fit w-full overflow-hidden bg-linear-90">
      <div className="from-primary-invert/50 flex flex-col items-center justify-center gap-5 bg-linear-to-t to-transparent px-[5%] py-5 lg:flex-row">
        <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
          <div className="border-primary-50 mb-6 rounded-full border px-4 py-2 backdrop-blur-md">
            <img
              alt="award"
              src={`/images/home/announcement-${theme}.png`}
              className="base:w-64 relative h-full w-56 object-contain"
            />
          </div>
          <h1 className="max-w-4xl text-2xl leading-10 font-semibold md:text-4xl md:leading-12 lg:text-left">
            <span className="bg-silver-duo bg-clip-text text-transparent">
              India's First Beauty Brand that Delivers Products Directly to the Customer
            </span>
          </h1>
          <h1 className="bg-silver-duo bg-clip-text py-5 text-3xl font-semibold tracking-wide text-transparent sm:text-4xl md:text-5xl">
            BEAUTINIQUE
          </h1>
          <h1 className="text-xl font-medium tracking-[8px] opacity-80 md:text-3xl lg:text-3xl lg:tracking-[12px]">
            ON THE WEB
          </h1>
          {!authenticated && (
            <Link to="/auth/register" className="mt-4">
              <Button pattern="secondary" content="Register Now" className="gap-3! px-6! py-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
