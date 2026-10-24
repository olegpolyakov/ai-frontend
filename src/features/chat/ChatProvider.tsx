import { useMemo } from 'react';

import { Icon, Screen, Spinner, State } from '@olegpolyakov/ui';

import ChatContext, { type ChatContextValue } from './ChatContext';
import useChatApi from './hooks/useChatApi';
import useChatClient from './hooks/useChatClient';

export default function ChatProvider({
    accessToken,
    userId,
    apiUrl,
    wsUrl,
    children
}: {
    accessToken: string;
    userId: string;
    apiUrl: string;
    wsUrl: string;
    children: React.ReactNode;
}) {
    const api = useChatApi(apiUrl, accessToken);
    const { client, error, isConnected } = useChatClient(wsUrl, accessToken);

    const value = useMemo<ChatContextValue>(() => ({
        api,
        client,
        userId
    }), [
        api,
        client,
        userId
    ]);

    if (error) return (
        <Screen full>
            <State
                image={
                    <Icon
                        name="error"
                        size="xl"
                    />
                }
                title="Chat Error"
                description={error?.message}
            />
        </Screen>
    );

    if (!client || !isConnected) return (
        <Screen full>
            <State image={<Spinner size="l" />} />
        </Screen>
    );
    
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}