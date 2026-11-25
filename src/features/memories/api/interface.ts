import type { Memory } from '../types';

export interface MemoriesApi {
    getMemories(options?: RequestInit): Promise<Memory[]>;
    createMemory(title: string): Promise<Memory>;
    updateMemory(id: string, data?: { title?: string, description?: string }): Promise<Memory>;
    deleteMemory(id: string): Promise<void>;
}
