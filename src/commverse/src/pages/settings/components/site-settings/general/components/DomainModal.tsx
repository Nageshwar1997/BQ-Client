import type { UseFormReturn } from 'react-hook-form';
import Button from '../../../../../../components/Button';
import IconInput from '../../../../../../components/IconInput';
import Modal from '../../../../../../components/Modal';
import type { DomainFormData } from '../../../../../../types';

type DomainModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  domainForm: UseFormReturn<DomainFormData>;
  domainSuffix: string;
  onSave: (data: DomainFormData) => void;
  isLoading?: boolean;
};

const DomainModal = ({
  open,
  onClose,
  isEdit,
  domainSuffix,
  domainForm,
  onSave,
  isLoading,
}: DomainModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="[&>div]:h-min [&>div]:w-[509px]"
    >
      <div className="text-neutral-gray-900 flex h-full w-full flex-col items-center gap-6 p-10">
        <div className="self-start text-2xl leading-7 font-bold">
          {isEdit ? 'Edit' : 'Add'} Base Domain
        </div>
        <div className="flex w-full flex-col gap-1">
          <IconInput
            label="Brand Link"
            type="text"
            placeholder="Enter domain"
            containerClassName="w-full"
            className="text-brand! h-10 pr-32!"
            rightAddon={domainSuffix}
            error={domainForm.formState.errors.value?.message}
            {...domainForm.register('value', {
              setValueAs: (data) => `${data}${domainSuffix}`,
            })}
            onChange={() => {}}
          />
          <div className="text-neutral-gray-600 text-xs leading-4">
            Use lowercase letters, numbers, and hyphens only
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <Button
            variant="secondary"
            content="Cancel"
            size="sm"
            className="h-10!"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            content="Save"
            size="sm"
            className="h-10!"
            onClick={domainForm.handleSubmit((data) => {
              onSave(data);
            })}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DomainModal;
