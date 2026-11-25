import type { Ref } from '@olegpolyakov/core/objects/ref';
import type { WsClientStatus } from '@olegpolyakov/frontend/clients/ws';

import type { MessageData } from '@/features/messages';

import type { Conversation } from '../types';

export interface ChatSocket extends EventTarget {
    readonly status: WsClientStatus;

    connect(): void;
    disconnect(): void;
    send<T>(data: T): void;
}

export interface ChatApi {
    events: ChatSocket;

    getConversations(options?: RequestInit): Promise<Conversation[]>;
    getConversation(conversationId: string, options?: RequestInit): Promise<Conversation>;
    createConversation(title?: string): Promise<Conversation>;
    updateConversation(conversationId: string, data?: { title?: string, description?: string }): Promise<Conversation>;
    updateConversationLastView(conversationId: string, options?: RequestInit): Promise<unknown>;
    deleteConversation(conversationId: string): Promise<void>;

    sendMessage(conversationId: string, data: { content?: string, refs?: Ref[] }): Promise<MessageData>;
    getMessages(conversationId: string, options?: RequestInit): Promise<MessageData[]>;
    updateMessage(conversationId: string, messageId: string, content: string): Promise<MessageData>;
    deleteMessage(conversationId: string, messageId: string): Promise<void>;
}
