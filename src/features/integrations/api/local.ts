import { v4 as uuid } from '@olegpolyakov/core/utils/uuid';

import type { Integration } from '../types';

import type { IntegrationsApi } from './interface';

const integrations = new Map<string, Integration>();

export default (): IntegrationsApi => ({
    async getIntegraions() {
        return Array.from(integrations.values());
    },

    async createIntegration(data) {
        const id = uuid();
        const integration = {
            type: 'mcp',
            name: '',
            url: '',
            enabled: true,
            credentials: {},
            ...data,
            id,
            userId: ''
        } as Integration;

        integrations.set(id, integration);

        return integration;
    },

    async updateIntegration(id, data) {
        const integration = integrations.get(id);

        if (!integration) throw new Error('Integration not found');

        const updatedIntegration = { ...integration, ...data, id };
        integrations.set(id, updatedIntegration);

        return updatedIntegration;
    },

    async deleteIntegration(id) {
        const integration = integrations.get(id);

        if (!integration) throw new Error('Integration not found');

        integrations.delete(id);

        return integration;
    }
});
