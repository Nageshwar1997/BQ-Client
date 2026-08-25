import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import ToastCard from '../../../components/AlertCards/ToastCard';
import { ModuleCard } from '../../../components/ModuleCard';
import { CreateFillIcon } from '../../../icons';
import { useCreateExperience } from '../../../services/experience-services';
import { getDefaultPayload, handleApiError } from '../../../lib/utils';
import type { CreateExperimentModalProps, ModuleData } from '../../../types';

const CreateExperimentModal = ({
  open,
  onClose,
  image,
  spriteImage,
  assetId,
  rightSection,
  onCreate,
  leftClassName = '',
  rightClassName = '',
}: CreateExperimentModalProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    description?: string;
  }>({ open: false, type: 'success', title: '', description: '' });

  const navigate = useNavigate();
  const createExperience = useCreateExperience();

  const imageAsset = image || spriteImage;

  const hasLeftPreview = Boolean(imageAsset);

  const handleSelect = (module: ModuleData) => {
    setSelectedId((prev) => (prev === module.id ? null : module.id));
  };

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  const showToast = (
    type: 'success' | 'error',
    title: string,
    description?: string
  ) => {
    setToast({ open: true, type, title, description });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 5000);
  };

  const handleCreateConfigExp = () => {
    const payLoad = getDefaultPayload('', '', '', '3d_configurator');
    createExperience.mutate(payLoad, {
      onSuccess: (response) => {
        const experienceId = response?.data?._id || response?.data?.id;
        if (experienceId) {
          navigate(`/configurator/${experienceId}`);
        }
      },
      onError: (error) => {
        const description = handleApiError({
          error: error as Error,
          fallback: 'There was an error creating the configurator experience.',
        });
        showToast('error', 'Failed to Create Experience', description);
        console.error('Create experience error:', error);
      },
    });
  };

  const handleCreate = () => {
    if (!selectedId) return;

    const selectedModule = rightSection.modules.find(
      (module) => module.id === selectedId
    );

    if (selectedModule?.title === 'Configurator') {
      handleCreateConfigExp();
      return;
    }

    if (!selectedModule) return;
    onCreate({ selectedModule, assetId });
    handleClose();
  };

  const spriteSize = 512 / 2;
  const frames = 15;
  //   className={hasLeftPreview ? '[&>div]:max-w-270' : '[&>div]:max-w-140'}
  // <div className={`flex w-full gap-10 p-10 ${leftClassName}`}>
  return (
    <Modal
      open={open}
      onClose={handleClose}
      className={hasLeftPreview ? '[&>div]:max-w-270' : '[&>div]:max-w-140'}
    >
      <div className="flex w-full gap-10 p-10">
        {hasLeftPreview && (
          <div
            className={`group flex h-117.5 w-116 items-center justify-center rounded-2xl bg-[#EFF0F6] ${leftClassName}`}
          >
            <div
              className={`group-hover:animate-ghost h-full w-65 bg-left bg-no-repeat`}
              // style={{ backgroundImage: `url(${image})` }}
              style={
                {
                  backgroundSize: `${spriteSize * frames}px ${spriteSize}px`,
                  backgroundImage: `url(${image})`,
                  backgroundPositionY: '50%',
                  transform: 'scale(2)',
                  ['--to-x']: `${-(spriteSize * frames)}px`,
                  ['--from-x']: `0px`,
                  ['--to-y']: `50%`,
                  ['--from-y']: `50%`,
                  ['--frameRate']: `steps(${frames})`,
                } as React.CSSProperties
              }
            />
            {/* {image && (
            <img
              src={imageAsset || ''}
              alt={previewAlt ?? 'Asset preview'}
              className="h-full w-full object-cover"
            />
          )} */}
          </div>
        )}

        {/* RIGHT */}
        <div
          className={`flex flex-1 flex-col justify-between gap-14 ${rightClassName}`}
        >
          <h2 className="font-metropolis text-center text-2xl font-bold">
            {rightSection.title}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {rightSection.modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                selectable
                selected={selectedId === module.id}
                onSelect={handleSelect}
                direction="row"
                moduleClassName="max-w-full! px-5! py-4!"
              />
            ))}
          </div>
          <Button
            leftIcon={
              <CreateFillIcon className="fill-neutral-gray-100! size-5!" />
            }
            content={rightSection.ctaLabel}
            onClick={handleCreate}
            disabled={
              !selectedId ||
              rightSection.modules.find((module) => module.id === selectedId)
                ?.title === 'Virtual Store'
            }
          />
        </div>
      </div>
      {toast.open && (
        <ToastCard
          type={toast.type}
          title={toast.title}
          description={toast.description}
          autoClose={false}
        />
      )}
    </Modal>
  );
};

export default CreateExperimentModal;
