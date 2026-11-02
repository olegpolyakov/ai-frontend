import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { Model } from '@/features/models';

export default class ModelsApi {
    constructor(
        private readonly http: HttpClient
    ) {}

    async getModels(options?: RequestInit): Promise<Model[]> {
        const res = await this.http.get<{ data: Model[] }>('/models', options);

        return res.data;
    }
}