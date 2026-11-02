import { createContext } from 'react';

import type ChatApi from './ChatApi';
import type ChatClient from './ChatClient';

export type ChatContextValue = {
    api: ChatApi;
    client: ChatClient;
    userId: string;
};

export default createContext<ChatContextValue>(null!);