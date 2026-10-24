import { createContext } from 'react';

import type ChatApi from './ChatApi';
import type ChatClient from './ChatClient';
import type { Model } from './types';

export type ChatContextValue = {
    api: ChatApi;
    client: ChatClient;
    models: Model[];
    userId: string;
};

export default createContext<ChatContextValue>(null!);