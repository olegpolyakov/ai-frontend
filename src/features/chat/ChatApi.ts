import type { Ref } from '@olegpolyakov/core/objects/ref';
import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { MessageData, MessagesData } from '@/features/messages';
import type { Model } from '@/features/models';

import type { Conversation } from './types';

export default class ChatApi {
    constructor(
        private readonly http: HttpClient
    ) {}

    async getModels(options?: RequestInit): Promise<Model[]> {
        const res = await this.http.get<{ data: Model[] }>('/models', options);

        return res.data;
    }

    async getConversations(options?: RequestInit): Promise<Conversation[]> {
        const res = await this.http.get<{ data: Conversation[] }>('/conversations', options);

        return res.data;
    }

    async getConversation(conversationId: string, options?: RequestInit): Promise<Conversation> {
        const res = await this.http.get<{ data: Conversation }>(`/conversations/${conversationId}`, options);

        return res.data;
    }

    async createConversation(title?: string): Promise<Conversation> {
        const res = await this.http.post<{ data: Conversation }>('/conversations', { title });
        
        return res.data;
    }

    async updateConversation(conversationId: string, data: { title?: string, description?: string } = {}): Promise<Conversation> {
        const res = await this.http.patch<{ data: Conversation }>(
            `/conversations/${conversationId}`,
            data
        );

        return res.data;
    }

    async updateConversationLastView(conversationId: string, options?: RequestInit) {
        return this.http.patch(`/conversations/${conversationId}/view`, {}, options);
    }

    async deleteConversation(conversationId: string): Promise<void> {
        return await this.http.delete(`/conversations/${conversationId}`);
    }

    async sendMessage(
        conversationId: string,
        { content, refs }: { content?: string, refs?: Ref[] }
    ): Promise<MessageData> {
        const res = await this.http.post<{ data: MessageData }>(
            `/conversations/${conversationId}/messages`,
            { content, refs }
        );
    
        return res.data;
    }

    async getMessages(conversationId: string, options?: RequestInit): Promise<MessageData[]> {
        const res = await this.http.get<{ data: MessagesData }>(`/conversations/${conversationId}/messages`, options);
    
        if (!res?.data) return [];
    
        const { messagesById, messagesInOrder } = res.data;
    
        return messagesInOrder.map(id => messagesById[id]);
    }

    async updateMessage(conversationId: string, messageId: string, content: string): Promise<MessageData> {
        const res = await this.http.patch<{ data: MessageData }>(
            `/conversations/${conversationId}/messages/${messageId}`,
            { content }
        );
    
        return res.data;
    }

    async deleteMessage(conversationId: string, messageId: string): Promise<void> {
        await this.http.delete(`/conversations/${conversationId}/messages/${messageId}`);
    }
}