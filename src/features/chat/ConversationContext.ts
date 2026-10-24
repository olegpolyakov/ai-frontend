import { createContext } from 'react';

import type { Conversation, Message } from './types';

export type ConversationContextValue = {
    conversation: Conversation;
    updateConversation: (data?: {
        title?: string | undefined;
        description?: string | undefined;
    }) => Promise<Conversation>;
    deleteConversation: () => Promise<void>;

    messages: Message[];
    isLoadingMessages: boolean;
    initialMessageId?: string;
    createMessage: (content: string, files?: File[]) => Promise<Message>;
    updateMessage: (messageId: string, content: string) => Promise<Message>;
    deleteMessage: (messageId: string) => Promise<void>;
};

export default createContext<ConversationContextValue>(null!);