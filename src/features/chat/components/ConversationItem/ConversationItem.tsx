import { NavLink } from 'react-router-dom';

import { Avatar, Item, Pill, Text } from '@olegpolyakov/ui';

import { getDateTimeString } from '../../helpers';
import type { Conversation } from '../../types';

import styles from './ConversationItem.module.scss';

export default function ConversationItem({
    conversation,
    selected
}: {
    conversation: Conversation;
    selected?: boolean;
}) {
    const subtitle = conversation.lastMessage?.content.slice(0, 50) || conversation.description;

    return (
        <Item
            className={styles.root}
            as={NavLink}
            to={`/${conversation.id}`}
            start={
                <Avatar
                    size="s"
                    variant="outlined"
                />
            }
            shape="rounded-m"
            variant="plain"
            active={selected}
            interactive
        >
            <div className={styles.main}>
                <div className={styles.row}>
                    <Text
                        content={conversation.title}
                        size="s"
                    />

                    {conversation.lastMessage?.createdAt && (
                        <Text
                            content={getDateTimeString(conversation.lastMessage.createdAt)}
                            size="xs"
                            color="tertiary"
                        />
                    )}
                </div>

                {(subtitle || conversation.unreadMessagesCount > 0) && (
                    <div className={styles.row}>
                        {subtitle && (
                            <Text
                                className={styles.subtitle}
                                content={subtitle}
                                size="s"
                                color="secondary"
                                ellipsis
                            />
                        )}

                        {conversation.unreadMessagesCount > 0 && (
                            <Pill
                                className={styles.unread}
                                content={conversation.unreadMessagesCount}
                                color="brand"
                                size="s"
                                variant="filled"
                            />
                        )}
                    </div>
                )}
            </div>
        </Item>
    );
}