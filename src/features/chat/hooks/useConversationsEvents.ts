import { type Dispatch, type SetStateAction, useEffect } from 'react';

import type { MessageData } from '@/features/messages';

import { ChatConversationEvent, ChatMessageEvent } from '../ChatClient';
import type { Conversation } from '../types';

import useChatContext from './useChatContext';

export default function useConversationsEvents(
    activeConversationId: string | undefined,
    setConversations: Dispatch<SetStateAction<Conversation[]>>
) {
    const { client } = useChatContext();

    useEffect(() => {
        client.on(ChatConversationEvent.Created, handleConversationCreated);
        client.on(ChatConversationEvent.Updated, handleConversationUpdated);
        client.on(ChatConversationEvent.Deleted, handleConversationDeleted);
        client.on(ChatMessageEvent.Created, handleMessageCreated);
        
        return () => {
            client.off(ChatConversationEvent.Created, handleConversationCreated);
            client.off(ChatConversationEvent.Updated, handleConversationUpdated);
            client.off(ChatConversationEvent.Deleted, handleConversationDeleted);
            client.off(ChatMessageEvent.Created, handleMessageCreated);
        };
    
        function handleConversationCreated(conversation: Conversation) {
            setConversations(conversations => [...conversations, conversation]);
        }
        
        function handleConversationUpdated(conversation: Conversation) {
            setConversations(conversations =>
                conversations.map(c => c.id !== conversation.id ? c : {
                    ...c,
                    ...conversation,
                    unreadMessagesCount: c.lastMessage && conversation.viewedAt > c.lastMessage.createdAt
                        ? 0
                        : c.unreadMessagesCount
                })
            );
        }
    
        function handleConversationDeleted(conversation: Conversation) {
            setConversations(cs => cs.filter(c => c.id !== conversation.id));
        }

        function handleMessageCreated(message: MessageData) {
            setConversations(cs =>
                cs.map(c => {
                    if (c.id !== message.conversationId) {
                        return c;
                    }

                    return {
                        ...c,
                        lastMessage: message,
                        unreadMessagesCount: c.id === activeConversationId
                            ? 0
                            : message.role === 'assistant'
                                ? c.unreadMessagesCount + 1
                                : c.unreadMessagesCount
                    };
                })
            );
        }
    }, [
        client,
        activeConversationId,
        setConversations
    ]);
}