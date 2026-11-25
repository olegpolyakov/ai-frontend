import type { Integration } from '../types';

export interface IntegrationsApi {
    getIntegraions(options?: RequestInit): Promise<Integration[]>;
    createIntegration(data: Partial<Integration>, options?: RequestInit): Promise<Integration>;
    updateIntegration(id: string, data: Partial<Integration>, options?: RequestInit): Promise<Integration>;
    deleteIntegration(id: string, options?: RequestInit): Promise<Integration>;
}
