import { type ReactNode, useEffect, useRef } from 'react';

import type { MessageLike } from '../../types';

import styles from './MessagesScroll.module.scss';

export default function MessagesScroll({
    messages,
    initialMessageId,
    children
}: {
    messages: MessageLike[];
    initialMessageId?: string;
    children: ReactNode | ReactNode[];
}) {
    const elementRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // On initial load scroll to the bottom after all images are loaded
    useEffect(() => {
        if (!elementRef.current || !bottomRef.current) return;

        // Scroll to the bottom after all images are loaded
        const images = elementRef.current.querySelectorAll('img');
        const unloadedImages = [...images].filter(image => !image.complete);

        Promise.all(
            unloadedImages.map(
                image =>
                    new Promise<void>((resolve, reject) => {
                        image.onload = () => resolve();
                        image.onerror = () => reject();
                    })
            )
        ).finally(() => {
            if (initialMessageId) {
                elementRef.current
                    ?.querySelector('#' + initialMessageId)
                    ?.scrollIntoView({ block: 'start' });
            } else {
                bottomRef.current?.scrollIntoView();
            }
        });
    }, [initialMessageId]);

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        const element = elementRef.current;

        if (!element) return;

        const scrollBottom = element.scrollTop + element.clientHeight;

        if (scrollBottom >= element.scrollHeight) return;

        bottomRef.current?.scrollIntoView({ block: 'start' });
    }, [messages]);

    return (
        <div
            ref={elementRef}
            className={styles.root}
        >
            {children}

            <div
                ref={bottomRef}
                className={styles.bottom}
            />
        </div>
    );
}