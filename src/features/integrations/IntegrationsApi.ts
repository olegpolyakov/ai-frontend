import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { Integration } from './types';

export default class IntegrationsApi {
    constructor(
        private readonly http: HttpClient
    ) {}

    async getIntegraions(options?: RequestInit): Promise<Integration[]> {
        const res = await this.http.get<{ data: Integration[] }>('/integrations', options);

        return res.data;
    }

    async createIntegration(data: Partial<Integration>, options?: RequestInit): Promise<Integration> {
        const res = await this.http.post<{ data: Integration }>('/integrations', data, options);

        return res.data;
    }

    async updateIntegration(id: string, data: Partial<Integration>, options?: RequestInit): Promise<Integration> {
        const res = await this.http.put<{ data: Integration }>(`/integrations/${id}`, data, options);

        return res.data;
    }

    async deleteIntegration(id: string, options?: RequestInit): Promise<Integration> {
        const res = await this.http.delete<{ data: Integration }>(`/integrations/${id}`, options);

        return res.data;
    }
}