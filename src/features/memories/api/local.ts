import { v4 as uuid } from '@olegpolyakov/core/utils/uuid';

import type { Memory } from '../types';

import type { MemoriesApi } from './interface';

const memories = new Map<string, Memory>();

export default (): MemoriesApi => ({
    async getMemories() {
        return Array.from(memories.values());
    },

    async createMemory(title) {
        const id = uuid();
        const memory: Memory = {
            id,
            userId: '',
            type: 'fact',
            content: title,
            embedding: [],
            importance: 0,
            confidence: 1,
            sourceMessageIds: []
        };

        memories.set(id, memory);

        return memory;
    },

    async updateMemory(id, { title } = {}) {
        const memory = memories.get(id);

        if (!memory) throw new Error('Memory not found');

        const updatedMemory = title === undefined ? memory : { ...memory, content: title };
        memories.set(id, updatedMemory);

        return updatedMemory;
    },

    async deleteMemory(id) {
        memories.delete(id);
    }
});
