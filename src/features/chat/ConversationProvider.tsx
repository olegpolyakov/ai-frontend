import { type ReactNode, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Icon, Screen, Spinner, State } from '@olegpolyakov/ui';

import ConversationContext, { ConversationContextValue } from './ConversationContext';
import useConversation from './hooks/useConversation';
import useConversationMessages from './hooks/useConversationMessages';

export default function ConversationProvider({ children }: { children: ReactNode }) {
    const { conversationId = '', messageId = '' } = useParams();
    const {
        conversation,
        isLoading,
        error,
        updateConversation,
        deleteConversation
    } = useConversation(conversationId);
    const {
        messages,
        isLoadingMessages,
        createMessage,
        updateMessage,
        deleteMessage
    } = useConversationMessages(conversationId);

    const value = useMemo<ConversationContextValue>(() => ({
        conversation: conversation!,
        updateConversation,
        deleteConversation,
        messages,
        isLoadingMessages,
        initialMessageId: messageId,
        createMessage,
        updateMessage,
        deleteMessage
    }), [
        conversation,
        updateConversation,
        deleteConversation,
        messages,
        isLoadingMessages,
        messageId,
        createMessage,
        updateMessage,
        deleteMessage
    ]);

    if (isLoading) return (
        <Screen>
            <State image={<Spinner size="l" />} />
        </Screen>
    );

    if (error) {
        return (
            <Screen>
                <State
                    image={
                        <Icon
                            name="error"
                            size="xl"
                        />
                    }
                    title="Error"
                    subtitle="Could not load the conversation"
                    description={error.message}
                />
            </Screen>
        );
    }

    return (
        <ConversationContext value={value}>
            {children}
        </ConversationContext>
    );
}