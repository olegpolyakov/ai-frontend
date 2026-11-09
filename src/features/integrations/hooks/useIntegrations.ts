import { useCallback, useState } from 'react';

import { useRequest } from '@olegpolyakov/frontend/hooks/request';

import type IntegrationsApi from '../IntegrationsApi';
import type { Integration } from '../types';

export default function useIntegrations(api: IntegrationsApi) {
    const [integrations, setIntegrations] = useState<Integration[]>([]);

    const fetchIntegraions = useCallback(async (signal: AbortSignal) => {
        const integrations = await api.getIntegraions({ signal });
        setIntegrations(integrations);
        return integrations;
    }, [api]);

    const { isLoading, error } = useRequest(fetchIntegraions);
    
    const createIntegration = useCallback(async (data: Partial<Integration>): Promise<Integration> =>  {
        const integration = await api.createIntegration(data);

        setIntegrations(integrations => integrations.concat(integration));

        return integration;
    }, [api]);
    
    const updateIntegration = useCallback(async (id: string, data: Partial<Integration>): Promise<Integration> =>  {
        const integration = await api.updateIntegration(id, data);

        setIntegrations(integrations => integrations.map(i => i.id !== integration.id ? i : {
            ...i,
            ...integration
        }));

        return integration;
    }, [api]);
    
    const deleteIntegration = useCallback(async (id: string): Promise<Integration> =>  {
        const integration = await api.deleteIntegration(`/integrations/${id}`);

        setIntegrations(integrations => integrations.filter(i => i.id !== integration.id));

        return integration;
    }, [api]);

    return {
        integrations,
        isLoading,
        error,
        createIntegration,
        updateIntegration,
        deleteIntegration
    };
}