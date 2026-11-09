import { DateTime, toDateTime } from '@olegpolyakov/core';

import type { MessageData, MessageLike } from '@/features/messages';

type DateInput = number | string | Date | DateTime;

const EDIT_WINDOW = 1000 * 60 * 30; // 30 minutes

export function isMessageEditable(message: MessageData, at: Date = new Date()): boolean {
    return at.getTime() - new Date(message.createdAt).getTime() < EDIT_WINDOW;
}

export function enrichMessages<T extends MessageLike>(
    messages: T[] = [],
    lastMessageViewedAt?: string
): MessageData[] {
    let oldIsNew: boolean | null = null;

    // @ts-ignore
    return messages.map(message => {
        const isMine = message.role === 'user';
        const isNew = lastMessageViewedAt
            ? message.createdAt > lastMessageViewedAt
            : false;
        const isFirstIsNew = oldIsNew === false && isNew;

        oldIsNew = isNew;

        return {
            ...message,

            dateString: getDateString(message.createdAt),
            timeString: getTimeString(message.createdAt),
            isMine,
            isFirstIsNew
        };
    });
}

export function getMessagesByDate(messages: MessageData[]) {
    const today = getDateString(DateTime.now());
    const yesterday = getDateString(DateTime.now().minus({ day: 1 }));

    return messages.reduce(
        (result, message) => {
            const date = message.dateString || '';
            const label = date === today
                ? 'Сегодня'
                : date === yesterday
                    ? 'Вчера'
                    : date;

            if (result[label]) {
                result[label].push(message);
            } else {
                result[label] = [message];
            }

            return result;
        },
        {} as Record<string, MessageData[]>
    );
}

export function getTimeString(arg: DateInput): string {
    return toDateTime(arg).toFormat('HH:mm');
}

export function getDateString(arg: DateInput): string {
    return toDateTime(arg).toFormat('d.MM.yyyy');
}