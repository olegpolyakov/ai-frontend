import type { Ref } from '@olegpolyakov/core/objects/ref';

export type Conversation = {
    id: string;
    title: string;
    description: string;
    model?: string;
    unreadMessagesCount: number;
    lastMessage: Pick<Message, 'content' | 'createdAt'>;
    viewedAt: string;
    userId: string;
};

export type Messages = {
    messagesById: Record<string, Message>;
    messagesInOrder: string[];
};

export type Message = {
    id: string;
    conversationId: string;
    userId: string;
    content: string;
    role: string;
    layout: 'simple' | 'system';
    refs: Ref[];
    createdAt: string;
    updatedAt: string;
    editedAt?: string;

    dateString?: string;
    timeString?: string;
    isMine?: boolean;
    isFirstIsNew?: boolean;
};

export type MessageFile = {
    name: string;
    path: string;
    size?: number;
    url?: string
};

export type Model = {
    id: string;
    name: string;
    provider: string;
};