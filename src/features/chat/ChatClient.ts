import {
    WsClientEvent as ChatEvent,
    WsClientStatus as ChatState
} from '@olegpolyakov/frontend/clients/ws';
import { EventEmitter } from '@olegpolyakov/frontend/libs/events';

import type { ChatSocket } from './api';

export { ChatEvent, ChatState };

export enum ChatConversationEvent {
    Created = 'conversation.created',
    Updated = 'conversation.updated',
    Deleted = 'conversation.deleted'
}

export enum ChatMessageEvent {
    Created = 'message.created',
    Updated = 'message.updated',
    Deleted = 'message.deleted'
}

export default class ChatClient extends EventEmitter {
    private readonly socket: ChatSocket;

    constructor(socket: ChatSocket) {
        super();

        this.socket = socket;

        this.handleConnected = this.handleConnected.bind(this);
        this.handleDisconnected = this.handleDisconnected.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    get state(): ChatState {
        return this.socket.status;
    }

    get connected(): boolean {
        return this.state === ChatState.Connected;
    }

    get disconnected(): boolean {
        return this.state === ChatState.Disconnected;
    }

    connect(): void {
        if (this.connected) return;

        this.detachSocketListeners();
        this.attachSocketListeners();

        this.socket.connect();
    }

    disconnect(): void {
        this.detachSocketListeners();

        if (this.disconnected) return;

        this.socket.disconnect();
    }

    reset(): void {
        this.disconnect();
        this.clear();
    }

    async sendMessage(conversationId: string, content: string): Promise<void> {
        this.socket.send(JSON.stringify({ conversationId, content }));
    }

    private attachSocketListeners() {
        this.socket.addEventListener(ChatEvent.Connected, this.handleConnected);
        this.socket.addEventListener(ChatEvent.Disconnected, this.handleDisconnected);
        this.socket.addEventListener(ChatEvent.Message, this.handleMessage);
        this.socket.addEventListener(ChatEvent.Error, this.handleError);
    }

    private detachSocketListeners() {
        this.socket.removeEventListener(ChatEvent.Connected, this.handleConnected);
        this.socket.removeEventListener(ChatEvent.Disconnected, this.handleDisconnected);
        this.socket.removeEventListener(ChatEvent.Message, this.handleMessage);
        this.socket.removeEventListener(ChatEvent.Error, this.handleError);
    }

    private handleConnected() {
        this.emit(ChatEvent.Connected);
    }

    private handleDisconnected() {
        this.emit(ChatState.Disconnected);
    }

    private handleMessage(event: Event) {
        const change = JSON.parse((event as MessageEvent).data);

        switch (`${change.model}.${change.action}`) {
            case 'conversation.create':
                this.emit(ChatConversationEvent.Created, change.data);
                break;
            case 'conversation.update':
                this.emit(ChatConversationEvent.Updated, change.data);
                break;
            case 'conversation.delete':
                this.emit(ChatConversationEvent.Deleted, change.data);
                break;

            case 'message.create':
                this.emit(ChatMessageEvent.Created, change.data);
                break;
            case 'message.update':
                this.emit(ChatMessageEvent.Updated, change.data);
                break;
            case 'message.delete':
                this.emit(ChatMessageEvent.Deleted, change.data);
                break;
        }
    }

    private handleError(event: Event) {
        const error = (event as CustomEvent).detail;
        this.emit(ChatEvent.Error, error);
    }
}