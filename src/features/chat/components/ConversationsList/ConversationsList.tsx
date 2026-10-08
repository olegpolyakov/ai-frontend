import { useNavigate } from 'react-router-dom';

import { Button, List, Spinner } from '@olegpolyakov/ui';

import useChatContext from '../../hooks/useChatContext';
import ConversationItem from '../ConversationItem';

import styles from './ConversationsList.module.scss';

export default function ConversationsList() {
    const { chat: { conversations, activeConversation, createConversation } } = useChatContext();
    const navigate = useNavigate();

    if (!conversations) return <Spinner />;

    const handleCreate = async () => {
        const conversation = await createConversation('New Conversation');
        navigate(`/${conversation.id}`);
    };

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

            <Button
                content="New Conversation"
                onClick={handleCreate}
            />
        </div>
    );
}