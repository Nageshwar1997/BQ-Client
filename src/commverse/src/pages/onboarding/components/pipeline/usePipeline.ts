import { useCallback, useEffect, useReducer, useState } from 'react';

import { pipelineReducer } from './pipeline.reducer';
import { formatDuration } from './pipeline.utils';
import type { PipelineState, PipelineStepId } from './pipeline.types';

export function usePipeline(initialState: PipelineState) {
  const [state, dispatch] = useReducer(pipelineReducer, initialState);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const hasRunning = state.steps.some((step) => step.status === 'running');

  useEffect(() => {
    if (!hasRunning) return;
    setNowMs(Date.now());

    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 200);

    return () => window.clearInterval(interval);
  }, [hasRunning]);

  const displaySteps = state.steps.map((step) => ({
    ...step,
    duration: formatDuration(step.startedAt, step.endedAt, nowMs),
  }));

  const reset = useCallback(
    (next: PipelineState) => dispatch({ type: 'RESET', payload: next }),
    []
  );

  const startStep = useCallback(
    (stepId: PipelineStepId) => dispatch({ type: 'START_STEP', stepId }),
    []
  );

  const completeStep = useCallback(
    (stepId: PipelineStepId) => dispatch({ type: 'COMPLETE_STEP', stepId }),
    []
  );

  const failStep = useCallback(
    (stepId: PipelineStepId, errorMessage?: string) =>
      dispatch({ type: 'FAIL_STEP', stepId, errorMessage }),
    []
  );

  const syncStepStatus = useCallback(
    (stepId: PipelineStepId, isDone: boolean) =>
      dispatch({ type: 'SYNC_STEP_STATUS', stepId, isDone }),
    []
  );

  const setStepLabel = useCallback(
    (stepId: PipelineStepId, label: string) =>
      dispatch({ type: 'SET_STEP_LABEL', stepId, label }),
    []
  );

  return {
    state,
    displaySteps,
    tick: nowMs,
    reset,
    startStep,
    completeStep,
    failStep,
    syncStepStatus,
    setStepLabel,
  };
}
