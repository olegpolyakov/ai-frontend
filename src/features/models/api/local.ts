import type { Model } from '../types';

import type { ModelsApi } from './interface';

const models: Model[] = [
    { id: 'demo/demo-chat', name: 'demo-chat', provider: 'demo' },
    { id: 'demo/demo-embed', name: 'demo-embed', provider: 'demo' }
];

export default (): ModelsApi => ({
    async getModels() {
        return models;
    }
});
