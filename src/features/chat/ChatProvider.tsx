import { useMemo } from 'react';

import { Icon, Screen, Spinner, State } from '@olegpolyakov/ui';

import ChatContext, { type ChatContextValue } from './ChatContext';
import useChatApi from './hooks/useChatApi';
import useChatClient from './hooks/useChatClient';

export default function ChatProvider({
    userId,
    children
}: {
    userId: string;
    children: React.ReactNode;
}) {
    const api = useChatApi();
    const { client, error, isConnected } = useChatClient();

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
                        name="chat_error"
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