import { useMemo } from 'react';

import useIntegrations from './hooks/useIntegrations';
import useIntegrationsApi from './hooks/useIntegrationsApi';
import IntegrationsContext, { type IntegrationsContextValue } from './IntegrationsContext';

export default function IntegrationsProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const api = useIntegrationsApi();
    const {
        integrations,
        error,
        isLoading,
        createIntegration,
        updateIntegration,
        deleteIntegration
    } = useIntegrations(api);

    const value = useMemo<IntegrationsContextValue>(() => ({
        integrations: integrations ?? [],
        error,
        isLoading,
        createIntegration,
        updateIntegration,
        deleteIntegration
    }), [
        integrations,
        error,
        isLoading,
        createIntegration,
        updateIntegration,
        deleteIntegration
    ]);
    
    return (
        <IntegrationsContext.Provider value={value}>
            {children}
        </IntegrationsContext.Provider>
    );
}