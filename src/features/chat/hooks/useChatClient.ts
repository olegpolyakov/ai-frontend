import { useEffect, useMemo, useState } from 'react';

import type { ChatSocket } from '../api';
import ChatClient, { ChatEvent, ChatState } from '../ChatClient';

export default function useChatClient(socket: ChatSocket) {
    const client = useMemo(() => new ChatClient(socket), [socket]);
    
    const [state, setState] = useState<ChatState>(ChatState.Disconnected);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
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
    }, [client]);

    return {
        client,
        state,
        error,
        isConnected: state === 'connected',
        isDisconnected: state === 'disconnected'
    };
}
