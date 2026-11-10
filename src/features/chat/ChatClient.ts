import {
    WsClient,
    WsClientEvent as ChatEvent,
    WsClientStatus as ChatState
} from '@olegpolyakov/frontend/clients/ws';
import { EventEmitter } from '@olegpolyakov/frontend/libs/events';

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
    private readonly ws: WsClient;

    constructor(ws: WsClient) {
        super();

        this.ws = ws;

        this.handleConnected = this.handleConnected.bind(this);
        this.handleDisconnected = this.handleDisconnected.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    get state(): ChatState {
        return this.ws.status;
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

        this.ws.connect();
    }

    disconnect(): void {
        this.detachSocketListeners();

        if (this.disconnected) return;

        this.ws.disconnect();
    }

    reset(): void {
        this.disconnect();
        this.clear();
    }

    async sendMessage(conversationId: string, content: string): Promise<void> {
        this.ws.send(JSON.stringify({ conversationId, content }));
    }

    private attachSocketListeners() {
        this.ws.on(ChatEvent.Connected, this.handleConnected);
        this.ws.on(ChatEvent.Disconnected, this.handleDisconnected);
        this.ws.on(ChatEvent.Message, this.handleMessage);
        this.ws.on(ChatEvent.Error, this.handleError);
    }

    private detachSocketListeners() {
        this.ws.off(ChatEvent.Connected, this.handleConnected);
        this.ws.off(ChatEvent.Disconnected, this.handleDisconnected);
        this.ws.off(ChatEvent.Message, this.handleMessage);
        this.ws.off(ChatEvent.Error, this.handleError);
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