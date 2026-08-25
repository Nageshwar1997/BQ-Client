import type { PipelineStep } from './pipeline.types';

export const formatDuration = (
    startedAt: number | null,
    endedAt: number | null,
    now = Date.now()
): string | undefined => {
    if (!startedAt) return undefined;

    const end = endedAt ?? now;
    const ms = Math.max(0, end - startedAt);
    const seconds = ms / 1000;

    if (seconds < 1) return `${Math.round(ms)}ms`;
    return `${seconds.toFixed(1)}s`;
};

export const getFirstRunningOrPendingIndex = (steps: PipelineStep[]): number => {
    const runningIndex = steps.findIndex((step) => step.status === 'running');
    if (runningIndex !== -1) return runningIndex;
    return steps.findIndex((step) => step.status === 'pending');
};
