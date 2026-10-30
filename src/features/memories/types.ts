export type Memory = {
    id: string;
    userId: string;
    type: 'preference' | 'goal' | 'project' | 'skill' | 'fact' | 'relationship';
    content: string;
    embedding: number[];
    importance: number;
    confidence: number;
    sourceMessageIds: string[];
    lastReferencedAt?: string;
};