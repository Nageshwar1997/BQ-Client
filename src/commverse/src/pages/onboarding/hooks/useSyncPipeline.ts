import { useEffect } from 'react';

import type { OnboardingSubSteps } from '../../../types/onboarding';
import type { usePipeline } from '../components/pipeline/usePipeline';

type PipelineController = ReturnType<typeof usePipeline>;

export function useSyncPipeline(
  pipeline: PipelineController,
  subSteps: OnboardingSubSteps,
  enabled: boolean
) {
  const { syncStepStatus, startStep, state } = pipeline;

  useEffect(() => {
    if (!enabled) return;

    syncStepStatus('asset-3d', !!subSteps?.asset3dCreated);
    syncStepStatus('visualizer', !!subSteps?.visualizerCreated);
    syncStepStatus('ar-experience', !!subSteps?.arExperienceCreated);
    syncStepStatus('ar-tryon', !!subSteps?.vtonCreated);
  }, [
    enabled,
    syncStepStatus,
    subSteps?.asset3dCreated,
    subSteps?.visualizerCreated,
    subSteps?.arExperienceCreated,
    subSteps?.vtonCreated,
  ]);

  useEffect(() => {
    if (!enabled) return;

    const steps = state.steps;
    if (!steps.some((step) => step.status === 'running')) {
      const nextPending = steps.find((step) => step.status === 'pending');
      if (nextPending) {
        startStep(nextPending.id);
      }
    }
  }, [enabled, startStep, state.steps]);
}
