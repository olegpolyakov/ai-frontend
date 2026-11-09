import { useCallback, useEffect, useState } from 'react';

import type { EntityRef } from '@olegpolyakov/core/objects/ref';
import { useUploadContext } from '@olegpolyakov/frontend/features/upload';
import { useRequest } from '@olegpolyakov/frontend/hooks/request';

import { enrichMessages, MessageAttachment, MessageData } from '@/features/messages';

import { ChatMessageEvent } from '../ChatClient';
import useChatContext from '../hooks/useChatContext';

export default function useConversationMessages(conversationId: string) {
    const { api, client } = useChatContext();
    const { upload } = useUploadContext();

    const [messages, setMessages] = useState<MessageData[]>([]);

    const fetchMessages = useCallback(async (signal: AbortSignal) => {
        const messages = await api.getMessages(conversationId, { signal });
    
        setMessages(messages);

        return messages;
    }, [conversationId, api]);

    const { isLoading, error } = useRequest(fetchMessages);
    
    const createMessage = useCallback(async (content: string, attachments: MessageAttachment[] = []) => {
        const uploadedFiles = await Promise.all(
            attachments.map(({ file }) => upload(file))
        );

        return api.sendMessage(conversationId, {
            content,
            refs: uploadedFiles.map(file => ({
                kind: 'entity',
                type: 'file',
                id: file.id,
                uri: `app://files/files/${file.id}`
            }) as EntityRef)
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

        function handleCreated(message: MessageData) {
            if (message.conversationId !== conversationId) return;

            setMessages((messages = []) =>
                messages.some(({ id }) => id === message.id)
                    ? messages
                    : [...messages, message]
            );
        }

        function handleUpdated(message: MessageData) {
            if (message.conversationId !== conversationId) return;
    
            setMessages((messages = []) =>
                messages.map(m =>
                    m.id === message.id ? message : m
                )
            );
        }

        function handleDeleted(message: MessageData) {
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