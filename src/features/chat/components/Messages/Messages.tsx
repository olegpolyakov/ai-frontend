import { Fragment } from 'react';

import { Text, Scrollable } from '@olegpolyakov/ui';

import { getMessagesByDate } from '../../helpers';
import type { Message } from '../../types';
import MessageComponent from '../Message';
import MessagesScroll from '../MessagesScroll';

import styles from './Messages.module.scss';

export default function Messages({
    messages,
    initialMessageId
}: {
    messages: Message[];
    initialMessageId?: string;
}) {
    if (!messages?.length) return null;

    const messagesByDate = getMessagesByDate(messages);

    return (
        <div className={styles.root}>
            <Scrollable fade>
                <MessagesScroll
                    messages={messages}
                    initialMessageId={initialMessageId}
                >
                    <div className={styles.list}>
                        {Object.entries(messagesByDate).map(
                            ([date, messages]) => (
                                <Fragment key={date}>
                                    <SystemText content={date} />

                                    {messages.map(message => (
                                        <Fragment key={message.id}>
                                            {message.isFirstIsNew && (
                                                <SystemText content="Новые сообщения" />
                                            )}

                                            {message.role === 'system' ? (
                                                <SystemText content={message.content} />
                                            ) : (
                                                <MessageComponent message={message} />
                                            )}
                                        </Fragment>
                                    ))}
                                </Fragment>
                            )
                        )}
                    </div>
                </MessagesScroll>
            </Scrollable>
        </div>
    );
}

function SystemText({ content, children = content }: { content?: string; children?: string }) {
    return (
        <Text
            className={styles.systemText}
            content={content}
            size="xs"
            color="tertiary"
            align="center"
        >
            {children}
        </Text>
    );
}