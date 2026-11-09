import { createContext } from 'react';

import type { Integration } from './types';

export type IntegrationsContextValue = {
    integrations: Integration[];
    error: Error | null;
    isLoading: boolean;
    createIntegration: (data: Partial<Integration>, options?: RequestInit) => Promise<Integration>;
    updateIntegration: (id: string, data: Partial<Integration>, options?: RequestInit)=> Promise<Integration>;
    deleteIntegration: (id: string, options?: RequestInit) => Promise<Integration>
};

export default createContext<IntegrationsContextValue>(null!);