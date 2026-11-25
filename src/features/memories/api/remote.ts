import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { Memory } from '../types';

import type { MemoriesApi } from './interface';

export default (http: HttpClient): MemoriesApi => ({
    async getMemories(options) {
        const res = await http.get<{ data: Memory[] }>('/memories', options);

        return res.data;
    },

    async createMemory(title) {
        const res = await http.post<{ data: Memory }>('/memories', { title });

        return res.data;
    },

    async updateMemory(id, data = {}) {
        const res = await http.patch<{ data: Memory }>(`/memories/${id}`, data);

        return res.data;
    },

    async deleteMemory(id) {
        return http.delete(`/memories/${id}`);
    }
});
