import { useCallback } from 'react';

import useChatContext from './useChatContext';

export default function useConversationsActions() {
    const { api } = useChatContext();

    const createConversation = useCallback(async (title: string) => {
        return api.createConversation(title);
    }, [api]);

    const updateConversation = useCallback(async (conversationId: string, data: { title?: string, description?: string } = {}) => {
        return api.updateConversation(conversationId, data);
    }, [api]);

    const deleteConversation = useCallback(async (conversationId: string) => {
        return api.deleteConversation(conversationId);
    }, [api]);

    return {
        createConversation,
        updateConversation,
        deleteConversation
    };
}