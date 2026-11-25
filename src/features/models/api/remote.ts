import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { Model } from '../types';

import type { ModelsApi } from './interface';

export default (http: HttpClient): ModelsApi => ({
    async getModels(options) {
        const res = await http.get<{ data: Model[] }>('/models', options);

        return res.data;
    }
});
