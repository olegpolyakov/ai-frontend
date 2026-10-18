import { useCallback, useState } from 'react';

import { Text } from '@olegpolyakov/ui';
import cn from '@olegpolyakov/frontend/helpers/classnames';

import useChatContext from '../../hooks/useChatContext';
import type { Message } from '../../types';
import MessageEditor from '../MessageEditor';
import MessageFiles from '../MessageFiles';
import MessageMenu from '../MessageMenu';

import MessageContent from './MessageContent';
import MessageImages from './MessageImages';

import styles from './Message.module.scss';

export default function Message({ message }: {
    message: Message;
}) {
    const { chat } = useChatContext();

    const [isEditing, setEditing] = useState(false);

    const handleSubmit = useCallback((content: string) => {
        return chat.updateMessage(message.id, content)
            .then(() => setEditing(false));
    }, [chat, message.id]);

    const handleEdit = useCallback(() => setEditing(true), []);

    const handleCancelEdit = useCallback(() => setEditing(false), []);

    return (
        <div
            id={message.id}
            className={cn(styles.root, message.isMine && styles.mine)}
        >
            {/* {!message.isMine &&
                <Avatar
                    className={styles.avatar}
                    color="brand"
                    variant="outlined"
                />
            } */}

            <div className={styles.container}>
                <div className={styles.header}>
                    {/* {!message.isMine &&
                        <Text
                            className={styles.author}
                            content="Bot"
                            size="s"
                            color="secondary"
                        />
                    } */}

                    {/* {message.role && (
                        <Text
                            className={styles.role}
                            content={message.role}
                            size="xs"
                        />
                    )} */}
                </div>

                <div className={styles.body}>
                    {isEditing ? (
                        <MessageEditor
                            content={message.content}
                            onSubmit={handleSubmit}
                            onCancel={handleCancelEdit}
                        />
                    ) : message.content && <MessageContent content={message.content} />}

                    <MessageImages images={message.images} />

                    <MessageFiles
                        files={message.files}
                        isMine={message.isMine}
                    />
                </div>

                {!isEditing && (
                    <div className={styles.footer}>
                        <Text
                            className={styles.datetime}
                            content={message.timeString}
                            color="tertiary"
                            size="xs"
                        />

                        {!isEditing && message.editedAt && (
                            <Text
                                className={styles.edited}
                                content="Edited"
                                size="xs"
                            />
                        )}
                    
                        {message.isMine &&
                            <MessageMenu
                                message={message}
                                onEdit={handleEdit}
                            />
                        }
                    </div>
                )}
            </div>
        </div>
    );
}