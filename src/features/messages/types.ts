import type { Ref } from '@olegpolyakov/core/objects/ref';

export type MessagesData = {
    messagesById: Record<string, MessageData>;
    messagesInOrder: string[];
};

export type MessageData = {
    id: string;
    conversationId: string;
    content: string;
    role: string;
    refs: Ref[];
    createdAt: string;
    updatedAt: string;
    editedAt?: string;

    dateString?: string;
    timeString?: string;
    isMine?: boolean;
    isFirstIsNew?: boolean;
};

export type MessageAttachment = {
    id: string;
    file: File;
    previewUrl?: string;
};

export type MessageFile = {
    name: string;
    path: string;
    size?: number;
    url?: string
};

export interface MessageLike {
    id: string;
    content: string;
    role: string;
    createdAt: string
};

export interface EnrichedMessage extends MessageLike {
    dateString: string;
    timeString: string;
    isMine: boolean;
    isFirstIsNew: boolean;
}