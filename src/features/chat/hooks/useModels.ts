import { useCallback, useMemo } from 'react';

import { useRequest } from '@olegpolyakov/frontend/hooks/request';

import type ChatApi from '../ChatApi';
import type { Model } from '../types';

export default function useModels(api: ChatApi) {
    const fetchModels = useCallback(async (signal: AbortSignal) => {
        return api.getModels({ signal });
    }, [api]);

    const { data, isLoading, error } = useRequest(fetchModels);

    const models = useMemo<Model[]>(() => (data ?? [])
        .map(item => {
            const [provider, name] = item.id.split('/');

            return {
                id: item.id,
                name,
                provider
            };
        })
        .sort((a, b) => a.id.localeCompare(b.id)), [data]);

    return {
        models,
        isLoading,
        error
    };
}