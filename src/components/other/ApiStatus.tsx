import { ContainerIcon, InfoIcon } from '../../icons';
import type { IApiStatus } from '../../types';
import Loading from '../layout/loaders/loading';
import GradientText from '../ui/GradientText';
import HR from '../ui/HR';

const ApiDescription = ({ status, empty, error, showHrLine }: IApiStatus) => {
  const title = status === 'empty' ? empty?.title : status === 'error' ? error?.title : '';

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {status === 'error' ? (
        <InfoIcon className="fill-silver-jet h-12 w-12 md:h-16 md:w-16" />
      ) : (
        <ContainerIcon className="stroke-silver-jet h-12 w-12" />
      )}
      {(empty?.title || error?.title) && (
        <>
          <GradientText
            type="silver"
            className="text-base text-shadow-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
            text={typeof title === 'string' ? title : ''}
            children={title && typeof title !== 'string' ? title : undefined}
          />
          {(error?.description || empty?.description) && (
            <p className="text-silver-jet font-metropolis text-center text-sm leading-6 font-normal sm:text-base md:text-lg">
              {status === 'empty'
                ? empty?.description
                : status === 'error'
                  ? error?.description
                  : ''}
            </p>
          )}
        </>
      )}
      {showHrLine && <HR className="mt-1" />}
    </div>
  );
};

const ApiStatus = ({ className = '', status, loading, ...rest }: IApiStatus) => {
  return (
    <div
      className={`m-auto flex h-full w-full flex-col items-center justify-center gap-2 p-4 ${className}`}
    >
      {status === 'loading' && loading?.title ? (
        <Loading text={loading.title} />
      ) : (
        <ApiDescription {...rest} status={status} />
      )}
    </div>
  );
};

export default ApiStatus;
