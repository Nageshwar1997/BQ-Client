import { Check, Circle, Loader2, X } from 'lucide-react';

import type { PipelineStep } from './pipeline/pipeline.types';
import { getFirstRunningOrPendingIndex } from './pipeline/pipeline.utils';

type CreationPipelineCardProps = {
  steps: Array<PipelineStep & { duration?: string }>;
  compact?: boolean;
};

const StepIcon = ({ status }: { status: PipelineStep['status'] }) => {
  if (status === 'done') {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
        <Check className="text-neutral-gray-900 h-4 w-4" />
      </div>
    );
  }

  if (status === 'running') {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
        <Loader2 className="text-neutral-gray-900 h-3.5 w-3.5 animate-spin" />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
        <X className="text-ui-error h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
      <Circle className="text-neutral-gray-400 h-3.5 w-3.5" />
    </div>
  );
};

const CreationPipelineCard = ({
  steps,
  compact = false,
}: CreationPipelineCardProps) => {
  const activeIndex = getFirstRunningOrPendingIndex(steps);

  return (
    <div
      className={
        compact
          ? 'w-full max-w-82.5'
          : 'border-neutral-gray-300 w-full rounded-3xl border bg-white p-6'
      }
    >
      {!compact && (
        <p className="text-neutral-gray-900 mb-6 text-2xl leading-[1.2] font-bold">
          Creating your Immersive Product Page
        </p>
      )}
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <StepIcon status={step.status} />

              <div
                className={`font-metropolis flex items-center gap-1 text-sm leading-6 font-medium italic ${
                  step.status === 'done'
                    ? 'text-neutral-gray-900'
                    : step.status === 'failed'
                      ? 'text-ui-error'
                      : isActive
                        ? 'text-neutral-gray-900'
                        : 'text-neutral-gray-500'
                }`}
              >
                <span>{step.label}</span>
                {step.duration ? (
                  <span className="text-neutral-gray-400">
                    · {step.duration}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreationPipelineCard;
