import { useNavigate, useParams } from 'react-router-dom';

import { Button, Heading, Menu, Screen, Spinner, State, Text } from '@olegpolyakov/ui';
import { useAppContext } from '@olegpolyakov/frontend/app';
import Editable from '@olegpolyakov/frontend/components/Editable';

import useConversation from '../../hooks/useConversation';
import MessageForm from '../MessageForm';
import Messages from '../Messages';

import styles from './Conversation.module.scss';

export default function Conversation() {
    const { conversationId = '', messageId = '' } = useParams<{ conversationId: string; messageId?: string }>();
    const { openDrawer } = useAppContext();
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
                <Button
                    className={styles.menu}
                    icon="menu"
                    onClick={openDrawer}
                />

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
                        ellipsis
                    />

                    {conversation.description && (
                        <Text
                            content={conversation.description}
                            size="s"
                            color="secondary"
                            ellipsis
                        />
                    )}
                </div>

                <Menu
                    trigger={
                        <Button
                            className={styles.more}
                            icon="more_vert"
                        />
                    }
                    items={[
                        {
                            content: 'Delete',
                            color: 'danger',
                            icon: {
                                color: 'danger',
                                name: 'delete'
                            },
                            onClick: () => {
                                if (confirm('Are you sure you want to delete this conversation?')) {
                                    deleteConversation(conversation.id);
                                    navigate('/');
                                }
                            }
                        }
                    ]}
                    placement="bottom-end"
                />
            </header>

            <div className={styles.body}>
                {isLoading ? (
                    <Screen>
                        <Spinner />
                    </Screen>
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