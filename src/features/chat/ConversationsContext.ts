import { createContext } from 'react';

import type { Conversation } from './types';

export type ConversationsContextValue = {
    conversations: Conversation[];
    createConversation: (title: string) => Promise<Conversation>;
    updateConversation: (conversationId: string, data?: {
        title?: string | undefined;
        description?: string | undefined;
    }) => Promise<Conversation>;
    deleteConversation: (conversationId: string) => Promise<void>;
    
    activeConversationId?: string;
    setActiveConversationId: (conversationId?: string) => void;
};

export default createContext<ConversationsContextValue>(null!);