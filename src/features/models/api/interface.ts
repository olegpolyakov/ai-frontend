import type { Model } from '../types';

export interface ModelsApi {
    getModels(options?: RequestInit): Promise<Model[]>;
}
