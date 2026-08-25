import { toRecord } from "../ai-creative-studio";

export type NormalizedVtonQueue = {
    generatedMediaId: string;
    queuePosition: number;
    estimatedWaitSec: number;
};

const asString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
};

export const checkVtonHealthNormalized = async (
    mutation: { mutateAsync: () => Promise<{ success?: boolean } | null | undefined> }
) => {
    const result = await mutation.mutateAsync();
    return { ok: Boolean(result?.success) };
};

export const enqueueFashionVton = async (
    mutation: { mutateAsync: (formData: FormData) => Promise<unknown> },
    formData: FormData
): Promise<NormalizedVtonQueue> => {
    const response = await mutation.mutateAsync(formData);
    const data = toRecord(toRecord(response).data ?? response);

    return {
        generatedMediaId: asString(data.generatedMediaId),
        queuePosition: asNumber(data.queuePosition),
        estimatedWaitSec: asNumber(data.estimatedWaitSec),
    };
};
