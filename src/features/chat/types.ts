export type Chat = {
    initialized: boolean;
    connected: boolean;
    error?: Error;

    conversations: Conversation[];
    isLoadingConversations: boolean;
    activeConversation?: Conversation;
    setActiveConversation: (conversationId: string) => void;

    messages: Message[];
    isLoadingMessages: boolean;
    sendMessage: (content: string, files?: File[]) => Promise<Message>;
    updateMessage: (messageId: string, content: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;
};

export type Conversation = {
    id: string;
    title: string;
    description: string;
    unreadMessagesCount: number;
    lastMessage: Pick<Message, 'content' | 'createdAt'>;
    viewedAt: string;
    userId: string;
};

export type MessageFile = { name: string; path: string; size?: number; url?: string };

export type MessageImage = { path: string; url?: string };

export type Attachments = {
    files: MessageFile[];
    images: MessageImage[];
};

export type MessageReaction = { count: number; userIds: string[] };

export type Messages = {
    messagesById: Record<string, Message>;
    messagesInOrder: string[];
};

export type Message = {
    id: string;
    content: string;
    layout: 'simple' | 'system';
    files: MessageFile[];
    images: MessageImage[];
    role: string;
    reactions: Record<string, string[]>;
    conversationId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    editedAt?: string;

    dateString?: string;
    timeString?: string;
    isMine?: boolean;
    isFirstIsNew?: boolean;
};