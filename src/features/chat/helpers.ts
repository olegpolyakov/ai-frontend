import { DateInput, DateTime, toDateTime } from '@olegpolyakov/core';

export function getDateTimeString(arg: DateInput): string {
    const datetime = toDateTime(arg);

    if (datetime.hasSame(DateTime.now(), 'day')) {
        return datetime.toFormat('HH:mm');
    }

    if (datetime.hasSame(DateTime.now().minus({ day: 1 }), 'day')) {
        return `Вчера · ${datetime.toFormat('HH:mm')}`;
    }

    return datetime.toFormat('d.MM.yyyy');
}