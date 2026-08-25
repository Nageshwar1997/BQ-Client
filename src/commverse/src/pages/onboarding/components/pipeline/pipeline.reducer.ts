import type {
    PipelineState,
    PipelineStep,
    PipelineStepId,
    PipelineStepStatus,
} from './pipeline.types';

type PipelineAction =
    | { type: 'RESET'; payload: PipelineState }
    | { type: 'START_STEP'; stepId: PipelineStepId; now?: number }
    | { type: 'COMPLETE_STEP'; stepId: PipelineStepId; now?: number }
    | { type: 'FAIL_STEP'; stepId: PipelineStepId; errorMessage?: string; now?: number }
    | { type: 'SYNC_STEP_STATUS'; stepId: PipelineStepId; isDone: boolean; now?: number }
    | { type: 'SET_STEP_LABEL'; stepId: PipelineStepId; label: string };

const nowOr = (value?: number) => value ?? Date.now();

export function pipelineReducer(
    state: PipelineState,
    action: PipelineAction
): PipelineState {
    switch (action.type) {
        case 'RESET':
            return action.payload;

        case 'START_STEP': {
            let changed = false;
            const nextSteps: PipelineStep[] = state.steps.map(
                (step): PipelineStep => {
                if (step.id !== action.stepId) return step;
                if (
                    step.status === 'running' &&
                    step.endedAt === null &&
                    !step.errorMessage
                ) {
                    return step;
                }

                changed = true;
                return {
                    ...step,
                    status: 'running',
                    startedAt: step.startedAt ?? nowOr(action.now),
                    endedAt: null,
                    errorMessage: null,
                };
                }
            );

            if (!changed) return state;

            return {
                ...state,
                steps: nextSteps,
            };
        }

        case 'COMPLETE_STEP': {
            let changed = false;
            const nextSteps: PipelineStep[] = state.steps.map(
                (step): PipelineStep => {
                if (step.id !== action.stepId) return step;
                if (
                    step.status === 'done' &&
                    step.startedAt !== null &&
                    step.endedAt !== null &&
                    !step.errorMessage
                ) {
                    return step;
                }

                changed = true;
                return {
                    ...step,
                    status: 'done',
                    startedAt: step.startedAt ?? nowOr(action.now),
                    endedAt: step.endedAt ?? nowOr(action.now),
                    errorMessage: null,
                };
                }
            );

            if (!changed) return state;

            return {
                ...state,
                steps: nextSteps,
            };
        }

        case 'FAIL_STEP': {
            const resolvedErrorMessage =
                action.errorMessage ?? 'Something went wrong';
            let changed = false;
            const nextSteps: PipelineStep[] = state.steps.map(
                (step): PipelineStep => {
                if (step.id !== action.stepId) return step;
                if (
                    step.status === 'failed' &&
                    step.startedAt !== null &&
                    step.endedAt !== null &&
                    step.errorMessage === resolvedErrorMessage
                ) {
                    return step;
                }

                changed = true;
                return {
                    ...step,
                    status: 'failed',
                    startedAt: step.startedAt ?? nowOr(action.now),
                    endedAt: step.endedAt ?? nowOr(action.now),
                    errorMessage: resolvedErrorMessage,
                };
                }
            );

            if (!changed) return state;

            return {
                ...state,
                steps: nextSteps,
            };
        }

        case 'SYNC_STEP_STATUS':
            if (!action.isDone) return state;

            const nextSteps: PipelineStep[] = state.steps.map((step): PipelineStep => {
                if (step.id !== action.stepId) return step;
                if (step.status === 'done' && step.endedAt !== null && !step.errorMessage) {
                    return step;
                }

                return {
                    ...step,
                    status: 'done' as PipelineStepStatus,
                    startedAt: step.startedAt ?? nowOr(action.now),
                    endedAt: step.endedAt ?? nowOr(action.now),
                    errorMessage: null,
                };
            });

            if (nextSteps.every((step, index) => step === state.steps[index])) {
                return state;
            }

            return {
                ...state,
                steps: nextSteps,
            };
        case 'SET_STEP_LABEL':
            {
                let changed = false;
                const nextSteps = state.steps.map((step) => {
                    if (step.id !== action.stepId) return step;
                    if (step.label === action.label) return step;
                    changed = true;
                    return { ...step, label: action.label };
                });

                if (!changed) return state;

                return {
                    ...state,
                    steps: nextSteps,
                };
            }

        default:
            return state;
    }
}
