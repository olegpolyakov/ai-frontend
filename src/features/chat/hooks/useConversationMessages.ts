import { useCallback, useEffect, useState } from 'react';

import type { FileEntityRef } from '@olegpolyakov/core/objects/ref';
import { useUploadContext } from '@olegpolyakov/frontend/features/upload';
import { useRequest } from '@olegpolyakov/frontend/hooks/request';

import { ChatMessageEvent } from '../ChatClient';
import { enrichMessages } from '../helpers';
import useChatContext from '../hooks/useChatContext';
import type { Message } from '../types';

export default function useConversationMessages(conversationId: string) {
    const { api, client } = useChatContext();
    const { upload } = useUploadContext();

    const [messages, setMessages] = useState<Message[]>([]);

    const fetchMessages = useCallback(async (signal: AbortSignal) => {
        const messages = await api.getMessages(conversationId, { signal });
    
        setMessages(messages);

        return messages;
    }, [conversationId, api]);

    const { isLoading, error } = useRequest(fetchMessages);
    
    const createMessage = useCallback(async (content: string, files: File[] = []) => {
        const uploadedFiles = await Promise.all(
            files.map(file => upload(file))
        );

        return api.sendMessage(conversationId, {
            content,
            refs: uploadedFiles.map(file => ({
                kind: 'entity',
                type: 'file',
                id: file.id,
                mimeType: file.type
            }) as FileEntityRef)
        });
    }, [conversationId, upload, api]);

    const updateMessage = useCallback((messageId: string, content: string) => {
        return api.updateMessage(conversationId, messageId, content);
    }, [conversationId, api]);

    const deleteMessage = useCallback((messageId: string) => {
        return api.deleteMessage(conversationId, messageId);
    }, [conversationId, api]);

    useEffect(() => {    
        client.on(ChatMessageEvent.Created, handleCreated);
        client.on(ChatMessageEvent.Updated, handleUpdated);
        client.on(ChatMessageEvent.Deleted, handleDeleted);

        return () => {
            client.off(ChatMessageEvent.Created, handleCreated);
            client.off(ChatMessageEvent.Updated, handleUpdated);
            client.off(ChatMessageEvent.Deleted, handleDeleted);
        };

        function handleCreated(message: Message) {
            if (message.conversationId !== conversationId) return;

            setMessages((messages = []) =>
                messages.some(({ id }) => id === message.id)
                    ? messages
                    : [...messages, message]
            );
        }

        function handleUpdated(message: Message) {
            if (message.conversationId !== conversationId) return;
    
            setMessages((messages = []) =>
                messages.map(m =>
                    m.id === message.id ? message : m
                )
            );
        }

        function handleDeleted(message: Message) {
            if (message.conversationId !== conversationId) return;

            setMessages((messages = []) =>
                messages.filter(m => m.id !== message.id)
            );
        }
    }, [conversationId, client]);

    return {
        messages: enrichMessages(messages),
        isLoadingMessages: isLoading,
        loadingMessagesError: error,
        createMessage,
        updateMessage,
        deleteMessage
    };
}