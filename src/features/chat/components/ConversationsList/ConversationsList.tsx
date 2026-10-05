import { List, Spinner, State } from '@olegpolyakov/ui';

import useChatContext from '../../hooks/useChatContext';
import ConversationItem from '../ConversationItem';

import styles from './ConversationsList.module.scss';

export default function ConversationsList() {
    const { chat: { conversations, activeConversation } } = useChatContext();

    if (!conversations) return <Spinner />;

    if (!conversations?.length) return <State title="Нет чатов" />;

    return (
        <div className={styles.root}>
            <List
                className={styles.list}
                as="nav"
                size="s"
            >
                {conversations.map(conversation => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        selected={conversation.id === activeConversation?.id}
                    />
                ))}
            </List>
        </div>
    );
}