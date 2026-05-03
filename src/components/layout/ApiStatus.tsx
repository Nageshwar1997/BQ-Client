import type { TApiStatus } from '@/types/component.type';
import { Icon } from '@iconify/react';
import Divider from '../ui/Divider';
import GradientText from '../ui/GradientText';
import LoadingRings from './loaders/LoadingRings';

const ApiDescription = ({ status, ...props }: TApiStatus) => {
  const title = 'title' in props && props.title;
  const description = 'description' in props && props.description;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Icon
        icon={status === 'error' ? 'solar:danger-triangle-linear' : 'solar:box-minimalistic-linear'}
        className="text-silver-jet size-12 shrink-0 md:size-16"
      />
      <GradientText
        type="silver"
        className="text-base text-shadow-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
        text={typeof title === 'string' ? title : ''}
        children={title && typeof title !== 'string' ? title : undefined}
      />
      {description && (
        <div className="text-silver-jet text-center text-sm leading-6 font-normal sm:text-base md:text-lg">
          {description}
        </div>
      )}
      {'divider' in props && <Divider className="mt-1" />}
    </div>
  );
};

const ApiStatus = ({ className = '', ...props }: TApiStatus) => {
  return (
    <div
      className={`m-auto flex h-full w-full flex-col items-center justify-center gap-2 p-4 ${className}`}
    >
      {props.status === 'loading' ? (
        <LoadingRings text={'text' in props && props.text ? props.text : 'Loading....'} />
      ) : (
        <ApiDescription {...props} />
      )}
    </div>
  );
};
export default ApiStatus;
