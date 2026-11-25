import type { HttpClient } from '@olegpolyakov/frontend/clients/http';
import type { WsClient } from '@olegpolyakov/frontend/clients/ws';

import type { MessageData, MessagesData } from '@/features/messages';

import type { Conversation } from '../types';

import type { ChatApi } from './interface';

export default (http: HttpClient, ws: WsClient): ChatApi => ({
    events: ws,

    async getConversations(options) {
        const res = await http.get<{ data: Conversation[] }>('/conversations', options);

        return res.data;
    },

    async getConversation(conversationId, options) {
        const res = await http.get<{ data: Conversation }>(`/conversations/${conversationId}`, options);

        return res.data;
    },

    async createConversation(title) {
        const res = await http.post<{ data: Conversation }>('/conversations', { title });

        return res.data;
    },

    async updateConversation(conversationId, data = {}) {
        const res = await http.patch<{ data: Conversation }>(`/conversations/${conversationId}`, data);

        return res.data;
    },

    async updateConversationLastView(conversationId, options) {
        return http.patch(`/conversations/${conversationId}/view`, {}, options);
    },

    async deleteConversation(conversationId) {
        return http.delete(`/conversations/${conversationId}`);
    },

    async sendMessage(conversationId, { content, refs }) {
        const res = await http.post<{ data: MessageData }>(
            `/conversations/${conversationId}/messages`,
            { content, refs }
        );

        return res.data;
    },

    async getMessages(conversationId, options) {
        const res = await http.get<{ data: MessagesData }>(`/conversations/${conversationId}/messages`, options);

        if (!res?.data) return [];

        const { messagesById, messagesInOrder } = res.data;

        return messagesInOrder.map(id => messagesById[id]);
    },

    async updateMessage(conversationId, messageId, content) {
        const res = await http.patch<{ data: MessageData }>(
            `/conversations/${conversationId}/messages/${messageId}`,
            { content }
        );

        return res.data;
    },

    async deleteMessage(conversationId, messageId) {
        await http.delete(`/conversations/${conversationId}/messages/${messageId}`);
    }
});
