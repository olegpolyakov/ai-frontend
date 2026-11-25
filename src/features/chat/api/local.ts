import { v4 as uuid } from '@olegpolyakov/core/utils/uuid';
import { WsClientEvent, WsClientStatus } from '@olegpolyakov/frontend/clients/ws';

import type { MessageData } from '@/features/messages';

import type { Conversation } from '../types';

import type { ChatApi, ChatSocket } from './interface';

const REPLY_DELAY = 800;
const REPLY_CONTENT = 'This is a demo response. Sign in to chat with real AI models.';

class LocalSocket extends EventTarget implements ChatSocket {
    private _status: WsClientStatus = WsClientStatus.Disconnected;

    get status() {
        return this._status;
    }

    connect() {
        if (this._status === WsClientStatus.Connected) return;

        this._status = WsClientStatus.Connected;
        this.dispatchEvent(new Event(WsClientEvent.Connected));
    }

    disconnect() {
        if (this._status === WsClientStatus.Disconnected) return;

        this._status = WsClientStatus.Disconnected;
        this.dispatchEvent(new Event(WsClientEvent.Disconnected));
    }

    send() {
        throw new Error('Sending through the socket is not supported in guest mode');
    }
}

const conversations = new Map<string, Conversation>();
const messages = new Map<string, MessageData>();
const events = new LocalSocket();

export default (): ChatApi => ({
    events,

    async getConversations() {
        return Array.from(conversations.values());
    },

    async getConversation(conversationId) {
        return getConversation(conversationId);
    },

    async createConversation(title = '') {
        const id = uuid();
        const conversation = {
            id,
            title,
            description: '',
            unreadMessagesCount: 0,
            viewedAt: new Date().toISOString(),
            userId: ''
        } as Conversation;

        conversations.set(id, conversation);
        dispatch('conversation', 'create', conversation);

        return conversation;
    },

    async updateConversation(conversationId, data = {}) {
        return updateConversation(conversationId, data);
    },

    async updateConversationLastView(conversationId) {
        if (!conversations.has(conversationId)) return;

        return updateConversation(conversationId, { viewedAt: new Date().toISOString() });
    },

    async deleteConversation(conversationId) {
        const conversation = getConversation(conversationId);

        for (const message of messages.values()) {
            if (message.conversationId === conversationId) {
                messages.delete(message.id);
            }
        }

        conversations.delete(conversationId);
        dispatch('conversation', 'delete', conversation);
    },

    async sendMessage(conversationId, { content = '', refs = [] }) {
        const conversation = getConversation(conversationId);
        const message = createMessage(conversationId, 'user', content, refs);

        if (!conversation.title) {
            updateConversation(conversationId, { title: content.slice(0, 50) });
        }

        setTimeout(() => {
            if (!conversations.has(conversationId)) return;

            createMessage(conversationId, 'assistant', REPLY_CONTENT);
        }, REPLY_DELAY);

        return message;
    },

    async getMessages(conversationId) {
        return Array.from(messages.values())
            .filter(message => message.conversationId === conversationId);
    },

    async updateMessage(conversationId, messageId, content) {
        const message = getMessage(conversationId, messageId);
        const now = new Date().toISOString();
        const updatedMessage = { ...message, content, updatedAt: now, editedAt: now };

        messages.set(messageId, updatedMessage);
        dispatch('message', 'update', updatedMessage);

        return updatedMessage;
    },

    async deleteMessage(conversationId, messageId) {
        const message = getMessage(conversationId, messageId);

        messages.delete(messageId);
        dispatch('message', 'delete', message);
    }
});

function getConversation(conversationId: string): Conversation {
    const conversation = conversations.get(conversationId);

    if (!conversation) throw new Error('Conversation not found');

    return conversation;
}

function updateConversation(conversationId: string, data: Partial<Conversation>): Conversation {
    const updatedConversation = { ...getConversation(conversationId), ...data };

    conversations.set(conversationId, updatedConversation);
    dispatch('conversation', 'update', updatedConversation);

    return updatedConversation;
}

function getMessage(conversationId: string, messageId: string): MessageData {
    const message = messages.get(messageId);

    if (!message || message.conversationId !== conversationId) throw new Error('Message not found');

    return message;
}

function createMessage(
    conversationId: string,
    role: string,
    content: string,
    refs: MessageData['refs'] = []
): MessageData {
    const now = new Date().toISOString();
    const message: MessageData = {
        id: uuid(),
        conversationId,
        content,
        role,
        refs,
        createdAt: now,
        updatedAt: now
    };

    messages.set(message.id, message);
    dispatch('message', 'create', message);

    return message;
}

function dispatch(model: string, action: string, data: Conversation | MessageData) {
    events.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify({
            model,
            action,
            documentId: data.id,
            data
        })
    }));
}
