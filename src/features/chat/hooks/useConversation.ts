import { useEffect } from 'react';

import { enrichMessages } from '../helpers';
import useChatContext from '../hooks/useChatContext';

export default function useConversation(id: string) {
    const {
        userId,
        chat: {
            conversations,
            isLoadingConversations,
            activeConversation,
            setActiveConversation,
            updateConversation,
            deleteConversation,
            messages,
            isLoadingMessages,
            sendMessage
        }
    } = useChatContext();

    useEffect(() => {
        if (activeConversation?.id === id) return;

        if (conversations?.some(conversation => conversation.id === id)) {
            setActiveConversation(id);
        }
    }, [id, activeConversation, conversations, setActiveConversation]);

    return {
        conversation: activeConversation,
        messages: enrichMessages(messages, activeConversation?.viewedAt, userId),
        isLoading: isLoadingConversations || isLoadingMessages,
        sendMessage,
        updateConversation,
        deleteConversation
    };
}