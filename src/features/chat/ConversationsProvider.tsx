import { type ReactNode, useMemo, useState } from 'react';

import { Icon, Screen, Spinner, State } from '@olegpolyakov/ui';

import ConversationsContext from './ConversationsContext';
import useConversationsActions from './hooks/useConversationsActions';
import useConversationsEvents from './hooks/useConversationsEvents';
import useConversationsFetch from './hooks/useConversationsFetch';
import type { Conversation } from './types';

export default function ConversationsProvider({ children }: { children: ReactNode }) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
    
    const { data, isLoadingConversations, error } = useConversationsFetch(setConversations);
    useConversationsEvents(activeConversationId, setConversations);
    const { createConversation, updateConversation, deleteConversation } = useConversationsActions();

    const value = useMemo(() => ({
        conversations,
        createConversation,
        updateConversation,
        deleteConversation,
        activeConversationId,
        setActiveConversationId
    }), [
        conversations,
        createConversation,
        updateConversation,
        deleteConversation,
        activeConversationId,
        setActiveConversationId
    ]);

    if (!data || isLoadingConversations) return (
        <Screen full>
            <State image={<Spinner size="l" />} />
        </Screen>
    );

    if (error) {
        return (
            <Screen full>
                <State
                    image={
                        <Icon
                            name="error"
                            size="xl"
                        />
                    }
                    title="Error"
                    subtitle="Conversations unavailable"
                    description={error.message}
                />
            </Screen>
        );
    }

    return (
        <ConversationsContext value={value}>
            {children}
        </ConversationsContext>
    );
}