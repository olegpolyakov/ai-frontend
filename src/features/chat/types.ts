import type { MessageData } from '@/features/messages';

export type Conversation = {
    id: string;
    title: string;
    description: string;
    model?: string;
    unreadMessagesCount: number;
    lastMessage: Pick<MessageData, 'content' | 'createdAt'>;
    viewedAt: string;
    userId: string;
};