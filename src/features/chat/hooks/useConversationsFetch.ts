import { type Dispatch, type SetStateAction, useCallback } from 'react';

import { useRequest } from '@olegpolyakov/frontend/hooks/request';

import type { Conversation } from '../types';

import useChatContext from './useChatContext';

export default function useConversationsFetch(
    setConversations: Dispatch<SetStateAction<Conversation[]>>
) {
    const { api } = useChatContext();

    const fetchConversations = useCallback(async (signal: AbortSignal) => {
        const conversations = await api.getConversations({ signal });
        
        setConversations(conversations);

        return conversations;
    }, [api, setConversations]);

    const { data, isLoading, error } = useRequest(fetchConversations);

    return {
        data,
        isLoadingConversations: isLoading,
        error
    };
}