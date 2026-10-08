import type { HttpClient } from '@olegpolyakov/frontend/clients/http';
import { WsClient, WsClientEvent } from '@olegpolyakov/frontend/clients/ws';

import type {
    Attachments,
    Conversation,
    Message,
    Messages
} from './types';

export enum ChatEvent {
    Initialized = 'initialized',
    Connecting = 'connecting',
    Connected = 'connected',
    Message = 'message',
    MessageUpdated = 'messageUpdated',
    StateChanged = 'stateChanged',
    Disconnecting = 'disconnecting',
    Disconnected = 'disconnected'
}

export type ChatState =
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected';

export type ChatOptions = {
    accessToken: string;
    apiUrl: string;
    wsUrl: string;
};

class EventEmitter extends EventTarget {
    emit<T>(eventName: string, data?: T) {
        const event = new CustomEvent(eventName, { detail: data });
        this.dispatchEvent(event);
    }

    on<T>(eventName: string, callback: (data: T) => void) {
        this.addEventListener(eventName, e => callback((e as CustomEvent).detail));
    }

    off<T>(eventName: string, callback: (data: T) => void) {
        this.removeEventListener(eventName, e => callback((e as CustomEvent).detail));
    }

    removeAllListeners() {
        this.removeEventListener('*', () => {});
    }
}

export default class Chat extends EventEmitter {
    private readonly _options: ChatOptions;
    private readonly _http: HttpClient;
    private readonly _ws: WsClient;
    private _state: ChatState = 'disconnected';
    private _destroyed = false;

    constructor(
        http: HttpClient,
        ws: WsClient,
        options: ChatOptions
    ) {
        super();

        this._options = options;
        this._http = http;
        this._ws = ws;

        this.handleConnect = this.handleConnect.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleReconnecting = this.handleReconnecting.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    get state(): ChatState {
        return this._state;
    }

    init(): void {
        this._destroyed = false;
        this.emit(ChatEvent.Initialized);
    }

    destroy(): void {
        this._destroyed = true;
        this.removeAllListeners();
        this.disconnect();
    }

    connect(): void {
        if (this._destroyed) return;

        this.destroySocket();
        this.setState(ChatEvent.Connecting);

        this._ws.on(WsClientEvent.Connected, this.handleConnect);
        this._ws.on(WsClientEvent.Disconnected, this.handleDisconnect);
        this._ws.on(WsClientEvent.Reconnecting, this.handleReconnecting);
        this._ws.on(WsClientEvent.Message, this.handleChange);

        this._ws.connect();
    }

    disconnect(): void {
        this.setState(ChatEvent.Disconnecting);
        this.destroySocket();
    }

    async createConversation(title: string): Promise<Conversation> {
        const res = await this._http.post<{ data: Conversation }>('/conversations', { title });
        return res.data;
    }

    async getConversations(): Promise<Conversation[]> {
        const data = await this._http.get<{ data: Conversation[] }>('/conversations');

        return data?.data;
    }

    async updateConversation(conversationId: string, data: { title?: string, description?: string } = {}): Promise<Conversation> {
        const res = await this._http.patch<{ data: Conversation }>(
            `/conversations/${conversationId}`,
            data
        );

        return res.data;
    }

    async updateConversationLastView(conversationId: string) {
        return this._http.patch(`/conversations/${conversationId}/view`, {});
    }

    async deleteConversation(conversationId: string): Promise<void> {
        return await this._http.delete(`/conversations/${conversationId}`);
    }

    async getMessages(conversationId: string, abortController?: AbortController): Promise<Message[]> {
        const res = await this._http.get<{ data: Messages }>(`/conversations/${conversationId}/messages`, {
            signal: abortController?.signal
        });

        if (!res?.data) return [];

        const { messagesById, messagesInOrder } = res.data;

        return messagesInOrder.map(id => messagesById[id]);
    }

    async sendMessage(
        conversationId: string,
        { content, files, images }: { content?: string } & Partial<Attachments>
    ): Promise<Message> {
        const res = await this._http.post<{ data: Message }>(
            `/conversations/${conversationId}/messages`,
            { content, files, images }
        );

        return res.data;
    }

    async updateMessage(conversationId: string, messageId: string, content: string): Promise<Message> {
        const res = await this._http.patch<{ data: Message }>(
            `/conversations/${conversationId}/messages/${messageId}`,
            { content }
        );

        return res.data;
    }

    async deleteMessage(conversationId: string, messageId: string): Promise<void> {
        await this._http.delete(`/conversations/${conversationId}/messages/${messageId}`);
    }

    async uploadFiles(conversationId: string, files: File[]): Promise<Attachments> {
        const data = new FormData();

        files.forEach(file => data.append('files', file));

        const res = await this._http.post<{ data: Attachments }, FormData>(
            `/conversations/${conversationId}/files`,
            data
        );

        return res.data;
    }

    private destroySocket() {
        this._ws.off(WsClientEvent.Connected, this.handleConnect);
        this._ws.off(WsClientEvent.Disconnected, this.handleDisconnect);
        this._ws.off(WsClientEvent.Reconnecting, this.handleReconnecting);
        this._ws.off(WsClientEvent.Message, this.handleChange);

        this._ws.disconnect();
    }

    private setState(state: ChatState) {
        this._state = state;
        this.emit(this._state);
        this.emit(ChatEvent.StateChanged, this._state);
    }

    private handleConnect() {
        this.setState(ChatEvent.Connected);
    }

    private handleDisconnect() {
        this.setState(ChatEvent.Disconnected);
    }

    private handleReconnecting() {
        this.setState(ChatEvent.Connecting);
    }

    private handleChange(event: Event) {
        console.log('Received WebSocket message:', (event as MessageEvent).data);
        const change = JSON.parse((event as MessageEvent).data);

        switch (`${change.model}.${change.action}`) {
            case 'Message.insert':
                this.emit(ChatEvent.Message, change.data);
                break;
            case 'Message.update':
                this.emit(ChatEvent.MessageUpdated, change.data);
        }
    }
}