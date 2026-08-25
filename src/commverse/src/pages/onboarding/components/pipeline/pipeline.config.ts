import type { PipelineState } from './pipeline.types';
import type { ImmersivePipelineRequirements } from '../../onboarding.utils';

export const createMarketingPipeline = (label: string = 'Generating your marketing image...'): PipelineState => ({
    steps: [
        {
            id: 'marketing-image',
            label,
            status: 'pending',
            startedAt: null,
            endedAt: null,
            errorMessage: null,
        },
    ],
});

const defaultImmersiveRequirements: ImmersivePipelineRequirements = {
    asset3dCreated: true,
    visualizerCreated: true,
    arExperienceCreated: true,
    vtonCreated: true,
};

export const createImmersivePipeline = (
    requirements: ImmersivePipelineRequirements = defaultImmersiveRequirements
): PipelineState => {
    const steps: PipelineState['steps'] = [];

    if (requirements.asset3dCreated) {
        steps.push({
            id: 'asset-3d',
            label: 'Generating 3D asset from image...',
            status: 'pending',
            startedAt: null,
            endedAt: null,
            errorMessage: null,
        });
    }

    if (requirements.visualizerCreated) {
        steps.push({
            id: 'visualizer',
            label: 'Prepared 3D visualizer',
            status: 'pending',
            startedAt: null,
            endedAt: null,
            errorMessage: null,
        });
    }

    if (requirements.arExperienceCreated) {
        steps.push({
            id: 'ar-experience',
            label: 'Enabled AR experience',
            status: 'pending',
            startedAt: null,
            endedAt: null,
            errorMessage: null,
        });
    }

    if (requirements.vtonCreated) {
        steps.push({
            id: 'ar-tryon',
            label: 'Creating AR try-on',
            status: 'pending',
            startedAt: null,
            endedAt: null,
            errorMessage: null,
        });
    }

    return { steps };
};
