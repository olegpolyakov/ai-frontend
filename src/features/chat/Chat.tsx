import { useMemo } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import { Button, Heading, Scrollable, State } from '@olegpolyakov/ui';

import ChatContext, { type ChatContextValue } from './ChatContext';
import Conversation from './components/Conversation';
import ConversationsList from './components/ConversationsList';
import useChat from './hooks/useChat';

import styles from './Chat.module.scss';

export type ChatProps = {
    accessToken: string;
    userId: string;
    apiUrl: string;
    wsUrl: string;
};

export default function Chat({
    accessToken,
    userId,
    apiUrl,
    wsUrl
}: ChatProps) {
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
            <div className={styles.root}>
                <Scrollable className={styles.sidebar} fade>
                    <Heading
                        className={styles.heading}
                        content="AI"
                    />
                            
                    <ConversationsList />
                        
                    <Button
                        content="New Conversation"
                        onClick={() => chat.createConversation('New Conversation')}
                    />
                </Scrollable>

                <div className={styles.main}>
                    <Routes>
                        <Route
                            path="/:conversationId/:messageId?"
                            element={<ConversationRoute />}
                        />

                        <Route
                            path="*"
                            element={<State title="Выберите беседу" />}
                        />
                    </Routes>
                </div>
            </div>
        </ChatContext.Provider>
    );
}

function ConversationRoute() {
    const { conversationId, messageId } = useParams();

    return (
        <Conversation
            conversationId={conversationId}
            messageId={messageId}
        />
    );
}