import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HttpClient } from '@olegpolyakov/frontend/clients/http';
import { WsClient } from '@olegpolyakov/frontend/clients/ws';

import Chat, { ChatEvent, ChatOptions, ChatState } from '../lib/Chat';
import type { Conversation, Message } from '../types';

export default function useChat(options: ChatOptions) {
    const navigate = useNavigate();

    const chatRef = useRef<Chat>(new Chat(
        new HttpClient(options.apiUrl, { accessToken: options.accessToken }),
        new WsClient(options.wsUrl, { accessToken: options.accessToken }),
        options
    ));
    const loadedRef = useRef(false);
    const getMessagesAbortControllerRef = useRef<AbortController | null>(null);

    const [state, setState] = useState<ChatState>(chatRef.current.state);
    const [isInitialized, setInitialized] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState<string>();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingConversations, setLoadingConversations] = useState(true);
    const [isLoadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState<Error>();

    const setActiveConversation = useCallback((conversationId?: string) => {
        setActiveConversationId(conversationId);
        setMessages([]);
    }, []);

    const createConversation = useCallback(async (title: string) => {
        const conversation = await chatRef.current!.createConversation(title);
        setConversations(prev => [...prev, conversation]);
        return conversation;
    }, []);

    const getConversations = useCallback(() => {
        setLoadingConversations(true);

        return chatRef.current!.getConversations()
            .then(conversations => {
                if (conversations) {
                    loadedRef.current = true;
                    setConversations(conversations);
                }

                return conversations;
            })
            .catch((error: Error) => {
                // Провалившееся обновление списка не должно стирать уже
                // показанный чат — ошибку показываем только если показывать
                // ещё нечего.
                if (!loadedRef.current) {
                    setError(error);
                }
            })
            .finally(() => setLoadingConversations(false));
    }, []);

    const getMessages = useCallback((conversationId: string) => {
        getMessagesAbortControllerRef.current?.abort();
        getMessagesAbortControllerRef.current = new AbortController();

        setLoadingMessages(true);

        return chatRef.current!
            .getMessages(
                conversationId,
                getMessagesAbortControllerRef.current
            )
            .then(messages => {
                if (messages) {
                    setMessages(messages);
                }

                return messages;
            })
            .finally(() => setLoadingMessages(false));
    }, []);

    const sendMessage = useCallback(async (content: string, files: File[] = []) => {
        if (!activeConversationId) {
            throw new Error('No active conversation');
        }

        const attachments = files.length
            ? await chatRef.current!.uploadFiles(activeConversationId, files)
            : undefined;

        return chatRef.current!.sendMessage(activeConversationId, {
            content,
            ...attachments
        });
    }, [activeConversationId]);

    const updateMessage = useCallback((messageId: string, content: string) => {
        if (!activeConversationId) {
            throw new Error('No active conversation');
        }

        return chatRef.current!
            .updateMessage(activeConversationId, messageId, content)
            .then(message => {
                if (!message?.id) return;

                setMessages((messages = []) =>
                    messages.map(m =>
                        m.id === message.id ? message : m
                    )
                );
            });
    }, [activeConversationId]);

    const deleteMessage = useCallback((messageId: string) => {
        if (!activeConversationId) {
            throw new Error('No active conversation');
        }

        return chatRef.current!
            .deleteMessage(activeConversationId, messageId)
            .then(() => {
                setMessages((messages = []) =>
                    messages.filter(m => m.id !== messageId)
                );
            });
    }, [activeConversationId]);

    // Initialize and connect the chat client
    useEffect(() => {
        const chat = chatRef.current!;

        chat.on(ChatEvent.Initialized, () => setInitialized(true));
        chat.on(ChatEvent.StateChanged, setState);

        chat.init();
        chat.connect();

        return () => {
            chat.destroy();
        };
    }, []);

    // Incoming messages
    useEffect(() => {
        const chat = chatRef.current!;

        function handleMessage(message: Message) {
            if (message.conversationId === activeConversationId) {
                setMessages((messages = []) =>
                    messages.some(({ id }) => id === message.id)
                        ? messages
                        : [...messages, message]
                );

                chat.updateConversationLastView(activeConversationId);
            }

            setConversations((conversations = []) =>
                conversations.map(conversation => {
                    if (conversation.id !== message.conversationId) {
                        return conversation;
                    }

                    const isActive = activeConversationId === conversation.id;

                    return {
                        ...conversation,
                        lastMessage: message,
                        unreadMessagesCount: isActive ? 0 : conversation.unreadMessagesCount + 1
                    };
                })
            );
        }

        function handleMessageUpdated(message: Message) {
            if (message.conversationId !== activeConversationId) return;

            setMessages((messages = []) =>
                messages.map(m =>
                    m.id === message.id ? message : m
                )
            );
        }

        chat.on(ChatEvent.Message, handleMessage);
        chat.on(ChatEvent.MessageUpdated, handleMessageUpdated);

        return () => {
            chat.off(ChatEvent.Message, handleMessage);
            chat.off(ChatEvent.MessageUpdated, handleMessageUpdated);
        };
    }, [activeConversationId]);

    // Load the conversation list once connected
    useEffect(() => {
        const chat = chatRef.current!;

        function loadConversations() {
            getConversations().then(conversations => {
                const firstConversation = conversations?.[0];
                const hasInitialConversationId = globalThis.location.hash.length > 2;

                if (
                    activeConversationId ||
                    !firstConversation ||
                    hasInitialConversationId
                ) return;

                setActiveConversation(firstConversation.id);
                navigate(`/${firstConversation.id}`);
            });
        }

        chat.on(ChatEvent.Connected, loadConversations);

        return () => {
            chat.off(ChatEvent.Connected, loadConversations);
        };
    }, [getConversations, activeConversationId, setActiveConversation, navigate]);

    // Load messages whenever the active conversation changes
    useEffect(() => {
        if (!activeConversationId) return;

        getMessages(activeConversationId).then(messages => {
            const lastMessage = messages?.at(-1);

            if (!lastMessage) return;

            setConversations((conversations = []) =>
                conversations.map(conversation =>
                    conversation.id === activeConversationId
                        ? {
                            ...conversation,
                            lastMessage,
                            unreadMessagesCount: 0
                        }
                        : conversation
                )
            );
        });
    }, [activeConversationId, getMessages]);

    const activeConversation = conversations?.find(c => c.id === activeConversationId);

    return {
        state,
        initialized: isInitialized,
        connected: state === 'connected',
        error,

        conversations,
        isLoadingConversations,
        createConversation,
        activeConversation,
        setActiveConversation,

        messages,
        isLoadingMessages,
        sendMessage,
        updateMessage,
        deleteMessage
    };
}