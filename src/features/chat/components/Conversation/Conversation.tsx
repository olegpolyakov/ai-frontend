import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Button, Heading, Spinner, State, Text } from '@olegpolyakov/ui';
import Editable from '@olegpolyakov/frontend/components/Editable';

import useConversation from '../../hooks/useConversation';
import MessageForm from '../MessageForm';
import Messages from '../Messages';

import styles from './Conversation.module.scss';

export default function Conversation() {
    const { conversationId = '', messageId = '' } = useParams<{ conversationId: string; messageId?: string }>();
    const {
        conversation,
        messages,
        isLoading,
        sendMessage,
        updateConversation,
        deleteConversation
    } = useConversation(conversationId);
    const navigate = useNavigate();

    if (!conversation) return (
        <State title="Такого чата нет" />
    );

    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <Avatar />

                <div className={styles.text}>
                    <Heading
                        content={
                            <Editable
                                content={conversation.title}
                                onBlur={title => updateConversation(conversation.id, {
                                    title
                                })}
                            />
                        }
                    />

                    {conversation.description && (
                        <Text
                            content={conversation.description}
                            size="s"
                            color="secondary"
                        />
                    )}
                </div>

                <Button
                    className={styles.deleteButton}
                    title="Delete conversation"
                    icon="delete"
                    color="danger"
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this conversation?')) {
                            deleteConversation(conversation.id);
                            navigate('/');
                        }
                    }}
                />
            </header>

            <div className={styles.body}>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <Messages
                        messages={messages}
                        initialMessageId={messageId}
                    />
                )}
            </div>

            <footer className={styles.footer}>
                <MessageForm
                    key={conversation.id}
                    conversationId={conversation.id}
                    placeholder="Сообщение…"
                    onSubmit={sendMessage}
                />
            </footer>
        </div>
    );
}