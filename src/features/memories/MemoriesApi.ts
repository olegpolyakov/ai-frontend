import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { Memory } from './types';

export default class MemoriesApi {
    constructor(
        private readonly http: HttpClient
    ) {}

    async getMemories(options?: RequestInit): Promise<Memory[]> {
        const res = await this.http.get<{ data: Memory[] }>('/memories', options);

        return res.data;
    }

    async createMemory(title: string): Promise<Memory> {
        const res = await this.http.post<{ data: Memory }>('/memories', { title });
        
        return res.data;
    }

    async updateMemory(id: string, data: { title?: string, description?: string } = {}): Promise<Memory> {
        const res = await this.http.patch<{ data: Memory }>(
            `/memories/${id}`,
            data
        );

        return res.data;
    }

    async deleteMemory(id: string): Promise<void> {
        return await this.http.delete(`/memories/${id}`);
    }
}