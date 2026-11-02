import { createContext } from 'react';

import type { Model } from './types';

export type ModelsContextValue = {
    models: Model[];
    error: Error | null;
    isLoading: boolean;
};

export default createContext<ModelsContextValue>(null!);