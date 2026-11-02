import { useMemo } from 'react';

import { useModels } from '@/features/models';

import useModelsApi from './hooks/useModelsApi';
import ModelsContext, { type ModelsContextValue } from './ModelsContext';

export default function ChatProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const api = useModelsApi();
    const { models, error, isLoading } = useModels(api);

    const value = useMemo<ModelsContextValue>(() => ({
        models,
        error,
        isLoading
    }), [
        models,
        error,
        isLoading
    ]);
    
    return (
        <ModelsContext.Provider value={value}>
            {children}
        </ModelsContext.Provider>
    );
}