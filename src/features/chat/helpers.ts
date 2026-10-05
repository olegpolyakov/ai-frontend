import { DateTime, toDateTime } from '@olegpolyakov/core';

import type { Message } from './types';

type DateInput = number | string | Date | DateTime;

export function enrichMessages(
    messages: Message[] = [],
    lastMessageViewedAt?: string,
    userId?: string
): Message[] {
    let oldIsNew: boolean | null = null;

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

export function getMessagesByDate(messages: Message[]) {
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
        {} as Record<string, Message[]>
    );
}

export function getDateTimeString(arg: DateInput): string {
    const datetime = toDateTime(arg);

    if (datetime.hasSame(DateTime.now(), 'day')) {
        return datetime.toFormat('HH:mm');
    }

    if (datetime.hasSame(DateTime.now().minus({ day: 1 }), 'day')) {
        return `Вчера · ${datetime.toFormat('HH:mm')}`;
    }

    return getDateString(arg);
}

export function getTimeString(arg: DateInput): string {
    return toDateTime(arg).toFormat('HH:mm');
}

export function getDateString(arg: DateInput): string {
    return toDateTime(arg).toFormat('DD.MM.YYYY');
}

const fileSizeUnits = ['Б', 'КБ', 'МБ', 'ГБ'];

export function getFileSizeString(bytes = 0): string {
    let size = bytes;
    let unit = 0;

    while (size >= 1024 && unit < fileSizeUnits.length - 1) {
        size /= 1024;
        unit++;
    }

    return `${unit === 0 ? size : size.toFixed(1)} ${fileSizeUnits[unit]}`;
}

export function getFileIconName(filename = ''): string {
    const extension = filename.includes('.') ? filename.split('.').at(-1)?.toLowerCase() : '';

    switch (extension) {
        case 'pdf': return 'picture_as_pdf';
        case 'doc': case 'docx': return 'description';
        case 'xls': case 'xlsx': case 'csv': return 'table';
        case 'zip': case 'rar': case '7z': return 'folder_zip';
        case 'mp3': case 'wav': case 'ogg': return 'audio_file';
        case 'mp4': case 'mov': case 'avi': return 'video_file';
        default: return 'draft';
    }
}