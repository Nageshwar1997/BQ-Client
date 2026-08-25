import { Icon } from '@iconify/react';
import Modal from '../../Modal';
import Button from '../../Button';
import type { ReactNode } from 'react';
import type { SaveWarnMetricCard, SaveWarnModalProps } from '../../../types';

const defaultChecklist = [
  [
    'Use one asset across product pages, ads, and AR experiences, unlocking multiple revenue touchpoints from a single model.',
  ],
  ['Works across devices', 'Mobile, desktops, AR - zero extra effort'],
];

const defaultMetrics: SaveWarnMetricCard[] = [
  {
    title: '40%',
    subtitle: 'higher engagement',
    description: 'Shoppers interacts longer with 3D products',
  },
  {
    title: '25%',
    subtitle: 'fewer returns',
    description: 'Better product understanding before purchase',
  },
  {
    title: '2X',
    subtitle: 'purchase confidence',
    description: 'Interactive PDPs drive 2-3X time spent vs static pages',
  },
];

const ChecklistItem = ({ text }: { text: string[] }) => {
  return (
    <div className="text-neutral-gray-900 flex items-center gap-2 text-[14px] font-medium">
      <Icon icon="solar:check-circle-linear" width={24} height={24} />
      <div>
        {text.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({ cardData }: { cardData: SaveWarnMetricCard }) => {
  return (
    <div className="flex flex-col gap-4 text-[12px]">
      <div className="bg-neutral-gray-100 border-neutral-gray-200 flex w-full flex-col rounded-2xl border p-3">
        <span className="text-[32px] font-medium">{cardData.title}</span>
        <span className="text-neutral-gray-600">{cardData.subtitle}</span>
      </div>
      <div className="font-medium">{cardData.description}</div>
    </div>
  );
};

const SaveWarnLeftSection = ({
  highlightTitle,
  checklist,
  metrics,
  className,
}: {
  highlightTitle: ReactNode;
  checklist: string[][];
  metrics: SaveWarnMetricCard[];
  className?: string;
}) => {
  return (
    <div
      className={`flex h-auto flex-col justify-between bg-amber-100 p-10 ${className ?? ''}`}
    >
      <span className="text-[24px] font-bold">{highlightTitle}</span>
      <div className="flex flex-col gap-3">
        {checklist.map((text, index) => (
          <ChecklistItem key={`checklist-${index}`} text={text} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {metrics.map((metric, index) => (
          <MetricCard key={`metric-${index}`} cardData={metric} />
        ))}
      </div>
    </div>
  );
};

const SaveWarnRightSection = ({
  hasLeftSection,
  className,
  onClose,
  title,
  subtitle,
  continueLabel,
  showContinueButton,
  saveExitLabel,
  discardLabel,
  discardButtonClassName,
  footerText,
  onContinueEditing,
  onSaveExit,
  onDiscardChanges,
  disableActions,
  disableClose,
  isSaveExitLoading,
}: {
  hasLeftSection: boolean;
  className?: string;
  onClose?: () => void;
  title: ReactNode;
  subtitle: ReactNode;
  continueLabel: string;
  showContinueButton: boolean;
  saveExitLabel: string;
  discardLabel: string;
  discardButtonClassName?: string;
  footerText: ReactNode;
  onContinueEditing: () => void;
  onSaveExit?: () => void;
  onDiscardChanges?: () => void;
  disableActions?: boolean;
  disableClose?: boolean;
  isSaveExitLoading?: boolean;
}) => {
  return (
    <div
      className={`relative h-full p-10 ${hasLeftSection ? 'w-2/5' : 'w-full'} ${className ?? ''}`}
    >
      <div className="mb-8 flex h-[65%] w-full flex-col items-center justify-center">
        {!disableClose && (
          <div
            className="absolute top-0 right-0 cursor-pointer p-10"
            onClick={onClose}
          >
            <Icon icon="lucide:x" className="text-neutral-gray-900 size-6" />
          </div>
        )}
        <Icon
          icon="solar:danger-circle-bold"
          width={96}
          height={96}
          className="text-ui-warning mb-4"
        />
        <span className="mb-2 text-center text-[24px] font-bold">{title}</span>
        <span className="text-neutral-gray-600 text-center text-[14px] font-normal">
          {subtitle}
        </span>
      </div>
      <div className="flex flex-col items-center gap-4">
        {showContinueButton && (
          <Button
            content={continueLabel}
            onClick={onContinueEditing}
            disabled={disableActions}
          />
        )}
        <div className="inline-flex w-full items-center gap-4">
          <Button
            variant="secondary"
            className="flex-1"
            content={saveExitLabel}
            onClick={onSaveExit}
            disabled={disableActions}
            isLoading={isSaveExitLoading}
          />
          <Button
            variant="outline"
            className={`flex-1 border! ${discardButtonClassName ?? ''}`}
            content={discardLabel}
            onClick={onDiscardChanges}
            disabled={disableActions}
          />
        </div>
        <span className="text-neutral-gray-600 text-[10px]">{footerText}</span>
      </div>
    </div>
  );
};

const SaveWarnModal = ({
  open = true,
  showLeftSection,
  className,
  contentClassName,
  leftSectionClassName,
  rightSectionClassName,
  onClose,
  onContinueEditing,
  onSaveExit,
  onDiscardChanges,
  title = "You're Almost There",
  subtitle = 'Would you like to save your progress or discard these changes?',
  highlightTitle = '"Finish This Once. Use It Everywhere."',
  checklist = defaultChecklist,
  metrics = defaultMetrics,
  continueLabel = 'Continue Editing',
  showContinueButton = true,
  saveExitLabel = 'Save & Exit',
  discardLabel = 'Discard Changes',
  discardButtonClassName,
  footerText = 'Nothing goes live until you publish.',
  disableActions = false,
  disableClose = false,
  isSaveExitLoading = false,
}: SaveWarnModalProps) => {
  const shouldShowLeftSection = showLeftSection ?? true;

  const handleContinueEditing = () => {
    if (disableClose) return;
    onContinueEditing?.();
    onClose?.();
  };

  const handleModalClose = disableClose ? () => {} : (onClose ?? (() => {}));

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      className={`overflow-y-hidden [&>div]:max-w-250! ${className ?? ''}`}
    >
      <div className={`flex h-full ${contentClassName ?? ''}`}>
        {shouldShowLeftSection && (
          <SaveWarnLeftSection
            highlightTitle={highlightTitle}
            checklist={checklist}
            metrics={metrics}
            className={leftSectionClassName}
          />
        )}
        <SaveWarnRightSection
          hasLeftSection={shouldShowLeftSection}
          className={rightSectionClassName}
          onClose={handleModalClose}
          title={title}
          subtitle={subtitle}
          continueLabel={continueLabel}
          showContinueButton={showContinueButton}
          saveExitLabel={saveExitLabel}
          discardLabel={discardLabel}
          discardButtonClassName={discardButtonClassName}
          footerText={footerText}
          onContinueEditing={handleContinueEditing}
          onSaveExit={onSaveExit}
          onDiscardChanges={onDiscardChanges}
          disableActions={disableActions}
          disableClose={disableClose}
          isSaveExitLoading={isSaveExitLoading}
        />
      </div>
    </Modal>
  );
};

export default SaveWarnModal;
