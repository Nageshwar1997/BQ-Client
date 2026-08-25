import { Link } from 'react-router';
import Button from '../Button';

const SiteFound = () => {
  return (
    <main className="bg-neutral-gray-100 font-metropolis text-neutral-gray-900 fixed inset-0 flex min-h-screen w-full flex-col">
      <header className="from-neutral-gray-100 to-neutral-gray-100/0 flex h-22 w-full shrink-0 items-center justify-center bg-linear-to-b px-12 py-5">
        <Link to="/dashboard" aria-label="Go to dashboard">
          <img
            src="/assets/icons/Commverse Logo - Final.svg"
            alt="Commverse Studio"
            className="h-4 w-auto"
          />
        </Link>
      </header>

      <section className="flex min-h-0 flex-1 items-center justify-center px-8 pb-22">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-neutral-gray-900 text-2xl/[1.2] font-bold">
              Site Not Found
            </h1>
            <p className="text-neutral-gray-700 text-base/[1.2] font-normal">
              Claim this domain before it&apos;s late!
            </p>
          </div>

          <Link to="/settings/site-settings/general">
            <Button content="Claim Now" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default SiteFound;
