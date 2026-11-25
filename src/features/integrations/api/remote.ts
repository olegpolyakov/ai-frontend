import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { Integration } from '../types';

import type { IntegrationsApi } from './interface';

export default (http: HttpClient): IntegrationsApi => ({
    async getIntegraions(options) {
        const res = await http.get<{ data: Integration[] }>('/integrations', options);

        return res.data;
    },

    async createIntegration(data, options) {
        const res = await http.post<{ data: Integration }>('/integrations', data, options);

        return res.data;
    },

    async updateIntegration(id, data, options) {
        const res = await http.put<{ data: Integration }>(`/integrations/${id}`, data, options);

        return res.data;
    },

    async deleteIntegration(id, options) {
        const res = await http.delete<{ data: Integration }>(`/integrations/${id}`, options);

        return res.data;
    }
});
