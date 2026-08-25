export type PipelineStepStatus = 'pending' | 'running' | 'done' | 'failed';

export type PipelineStepId =
    | 'marketing-image'
    | 'asset-3d'
    | 'visualizer'
    | 'ar-experience'
    | 'ar-tryon';

export type PipelineStep = {
    id: PipelineStepId;
    label: string;
    status: PipelineStepStatus;
    startedAt: number | null;
    endedAt: number | null;
    errorMessage?: string | null;
};

export type PipelineState = {
    steps: PipelineStep[];
};
