import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { ChatConversationEvent, ChatMessageEvent } from '../ChatClient';
import { Conversation, type Message } from '../types';

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
                    ...conversation
                })
            );
        }
    
        function handleConversationDeleted(conversation: Conversation) {
            setConversations(cs => cs.filter(c => c.id !== conversation.id));
        }

        function handleMessageCreated(message: Message) {
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
                            : c.unreadMessagesCount + 1
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