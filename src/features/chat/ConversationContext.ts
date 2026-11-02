import { createContext } from 'react';

import type { MessageAttachment, MessageData } from '@/features/messages';

import type { Conversation } from './types';

export type ConversationContextValue = {
    conversation: Conversation;
    updateConversation: (data: {
        title?: string;
        description?: string;
        model?: string;
    }) => Promise<Conversation>;
    deleteConversation: () => Promise<void>;

    messages: MessageData[];
    isLoadingMessages: boolean;
    initialMessageId?: string;
    createMessage: (content: string, attachments?: MessageAttachment[]) => Promise<MessageData>;
    updateMessage: (messageId: string, content: string) => Promise<MessageData>;
    deleteMessage: (messageId: string) => Promise<void>;
};

export default createContext<ConversationContextValue>(null!);