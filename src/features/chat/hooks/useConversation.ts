import { useCallback, useEffect, useMemo } from 'react';

import { useRequest } from '@olegpolyakov/frontend/hooks/request';

import useChatContext from '../hooks/useChatContext';

import useConversationsContext from './useConversationsContext';

export default function useConversation(id: string) {
    const { api } = useChatContext();
    const {
        conversations,
        updateConversation: _updateConversation,
        deleteConversation: _deleteConversation,
        setActiveConversationId
    } = useConversationsContext();

    const conversation = useMemo(() => conversations.find(c => c.id === id), [conversations, id]);

    useEffect(() => {
        setActiveConversationId(id);

        return () => {
            api.updateConversationLastView(id);
        };
    }, [id, api, setActiveConversationId]);

    const updateConversationLastView = useCallback(async (signal: AbortSignal) => {
        return api.updateConversationLastView(id, { signal });
    }, [id, api]);

    const { isLoading, error } = useRequest(updateConversationLastView);

    const updateConversation = useCallback(async (data: { title?: string, description?: string } = {}) => {
        return _updateConversation(id, data);;
    }, [id, _updateConversation]);
    
    const deleteConversation = useCallback(async () => {
        return _deleteConversation(id);
    }, [id, _deleteConversation]);

    return {
        conversation,
        isLoading,
        error,
        updateConversation,
        deleteConversation
    };
}