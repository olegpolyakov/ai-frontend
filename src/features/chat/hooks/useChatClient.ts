import { useEffect, useRef, useState } from 'react';

import { WsClient } from '@olegpolyakov/frontend/clients/ws';

import ChatClient, { ChatEvent, ChatState } from '../ChatClient';

export default function useChatClient(wsUrl: string, accessToken: string) {
    const clientRef = useRef(new ChatClient(new WsClient(wsUrl, { accessToken })));
    
    const [state, setState] = useState<ChatState>(ChatState.Disconnected);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const client = clientRef.current;

        if (client.connected) {
            client.reset();
        }

        const handleConnected = () => setState(ChatState.Connected);
        const handleDisconnected = () => setState(ChatState.Disconnected);
        const handleError = (error: Error) => setError(error);

        client.on(ChatEvent.Connected, handleConnected);
        client.on(ChatEvent.Disconnected, handleDisconnected);
        client.on(ChatEvent.Error, handleError);

        client.connect();

        return () => {
            client.off(ChatEvent.Connected, handleConnected);
            client.off(ChatEvent.Disconnected, handleDisconnected);
            client.off(ChatEvent.Error, handleError);
            
            client.disconnect();
        };
    }, [wsUrl, accessToken]);

    return {
        get client() {
            return clientRef.current;
        },
        state,
        error,
        isConnected: state === 'connected',
        isDisconnected: state === 'disconnected'
    };
}