import { useMemo } from 'react';

import { State } from '@olegpolyakov/ui';

import ChatContext, { type ChatContextValue } from './ChatContext';
import useChat from './hooks/useChat';

export default function ChatProvider({ accessToken,
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
    const chat = useChat({ accessToken, apiUrl, wsUrl });

    const value = useMemo<ChatContextValue>(() => ({ chat, userId }), [chat, userId]);

    if (chat.error) return (
        <State
            title="Произошла ошибка"
            description={chat.error.message}
        />
    );
    
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}