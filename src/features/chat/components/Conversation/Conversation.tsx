import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Heading, Icon, Menu, Screen, Spinner, State, Text } from '@olegpolyakov/ui';
import { useAppContext } from '@olegpolyakov/frontend/app';
import Editable from '@olegpolyakov/frontend/components/Editable';
import { useTitle } from '@olegpolyakov/frontend/hooks/dom';

import { Message, MessageForm, Messages } from '@/features/messages';
import { ModelSelect } from '@/features/models';

import useConversationContext from '../../hooks/useConversationContext';

import styles from './Conversation.module.scss';

export default function Conversation() {
    const { openDrawer } = useAppContext();
    const {
        conversation,
        updateConversation,
        deleteConversation,
        messages,
        isLoadingMessages,
        initialMessageId,
        createMessage, 
        updateMessage,
        deleteMessage
    } = useConversationContext();
    const navigate = useNavigate();
    useTitle(conversation.title);

    const handleUpdateMessage = useCallback(async (messageId: string, content: string) => {
        await updateMessage(messageId, content);
    }, [updateMessage]);

    const handleDeleteMessage = useCallback(async (messageId: string) => {
        await deleteMessage(messageId);
    }, [deleteMessage]);

    const handleDeleteConversation = useCallback(() => {
        if (confirm('Are you sure you want to delete this conversation?')) {
            deleteConversation();
            navigate('/');
        }
    }, [deleteConversation, navigate]);

    if (!conversation) return (
        <Screen>
            <State
                image={
                    <Icon
                        name="chat_info"
                        size="xl"
                    />
                }
                description="Conversation not found"
            />
        </Screen>
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
                                onBlur={title => title !== conversation.title && updateConversation({ title })}
                            />
                        }
                        size="s"
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
                            onClick: handleDeleteConversation
                        }
                    ]}
                    placement="bottom-end"
                />
            </header>

            <div className={styles.body}>
                {isLoadingMessages ? (
                    <Screen>
                        <Spinner />
                    </Screen>
                ) : (
                    <Messages
                        messages={messages}
                        initialMessageId={initialMessageId}
                    >
                        {message =>
                            <Message
                                message={message}
                                onUpdate={handleUpdateMessage}
                                onDelete={handleDeleteMessage}
                            />
                        }
                    </Messages>
                )}
            </div>

            <footer className={styles.footer}>
                <MessageForm
                    key={conversation.id}
                    placeholder="Message…"
                    disabled={!conversation.model}
                    actions={
                        <ModelSelect
                            model={conversation.model}
                            placement="top"
                            onSelect={model => updateConversation({ model })}
                        />
                    }
                    onSubmit={createMessage}
                />
            </footer>
        </div>
    );
}