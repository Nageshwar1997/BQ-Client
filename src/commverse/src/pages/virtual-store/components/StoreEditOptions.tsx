import { Icon } from '@iconify/react';
import { Fragment } from 'react/jsx-runtime';

interface StoreEditOptionsProps {
  variant?: 'default' | 'compact';
  onMove?: () => void;
  onRotate?: () => void;
  onDuplicate?: () => void;
  onSplit?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onUpload?: () => void;
  onDelete?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

interface ToolButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ToolButton = ({ icon, label, onClick, disabled }: ToolButtonProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
  >
    <Icon icon={icon} className="h-5 w-5 text-zinc-900" />
  </button>
);

const StoreEditOptions = ({
  variant = 'default',
  onMove,
  onRotate,
  onDuplicate,
  onSplit,
  onUndo,
  onRedo,
  onUpload,
  onDelete,
  canUndo = false,
  canRedo = false,
}: StoreEditOptionsProps) => {
  const SplitToolButton = () => (
    <ToolButton
      icon="lucide:square-split-horizontal"
      label="Split view"
      onClick={onSplit}
    />
  );

  const DeleteToolButton = () => (
    <ToolButton
      icon="solar:trash-bin-minimalistic-linear"
      label="Delete"
      onClick={onDelete}
    />
  );

  return (
    <div className="inline-flex items-center justify-start gap-1 rounded-lg bg-white p-1 outline-1 -outline-offset-1 outline-gray-100">
      {variant === 'compact' ? (
        <Fragment>
          <ToolButton
            icon="solar:upload-minimalistic-linear"
            label="Upload"
            onClick={onUpload}
          />
          <SplitToolButton />
          <DeleteToolButton />
        </Fragment>
      ) : (
        <Fragment>
          <ToolButton icon="lucide:move" label="Move" onClick={onMove} />
          <ToolButton
            icon="solar:refresh-linear"
            label="Rotate"
            onClick={onRotate}
          />
          <ToolButton
            icon="solar:scale-linear"
            label="Duplicate"
            onClick={onDuplicate}
          />
          <SplitToolButton />
          <ToolButton
            icon="solar:undo-left-linear"
            label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
          />
          <ToolButton
            icon="solar:undo-right-linear"
            label="Redo"
            onClick={onRedo}
            disabled={!canRedo}
          />
          <DeleteToolButton />
        </Fragment>
      )}
    </div>
  );
};

export default StoreEditOptions;
