import { createContext } from 'react';

import type { Chat } from './types';

export type ChatContextValue = {
    chat: Chat;
    userId: string;
};

export default createContext<ChatContextValue>(null!);