import { useNavigate } from 'react-router-dom';

import { Button, List, Text } from '@olegpolyakov/ui';
import { useAppContext } from '@olegpolyakov/frontend/app';

import useConversationsActions from '../../hooks/useConversationsActions';
import useConversationsContext from '../../hooks/useConversationsContext';
import ConversationItem from '../ConversationItem';

import styles from './ConversationsList.module.scss';

export default function ConversationsList() {
    const { closeDrawer } = useAppContext();
    const { conversations, activeConversationId } = useConversationsContext();
    const { createConversation } = useConversationsActions();
    const navigate = useNavigate();

    const handleCreate = async () => {
        const conversation = await createConversation('New Conversation');
        navigate(`/${conversation.id}`);
    };

    return (
        <div className={styles.root}>
            <Text
                content="Conversations"
                size="xxs"
                color="secondary"
                decorative
                uppercase
            />

            <List
                className={styles.list}
                as="nav"
                size="s"
            >
                {conversations.map(conversation => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        selected={conversation.id === activeConversationId}
                        onClick={closeDrawer}
                    />
                ))}
            </List>

            <Button
                content="New Conversation"
                variant="tinted"
                onClick={handleCreate}
            />
        </div>
    );
}