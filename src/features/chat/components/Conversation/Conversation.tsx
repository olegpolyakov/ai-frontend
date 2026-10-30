import { useNavigate } from 'react-router-dom';

import { Button, Heading, Icon, Menu, Screen, Spinner, State, Text } from '@olegpolyakov/ui';
import { useAppContext } from '@olegpolyakov/frontend/app';
import Editable from '@olegpolyakov/frontend/components/Editable';

import useChatContext from '../../hooks/useChatContext';
import useConversationContext from '../../hooks/useConversationContext';
import MessageForm from '../MessageForm';
import Messages from '../Messages';
import ModelSelect from '../ModelSelect';

import styles from './Conversation.module.scss';

export default function Conversation() {
    const { openDrawer } = useAppContext();
    const { models } = useChatContext();
    const {
        conversation,
        updateConversation,
        deleteConversation,
        messages,
        isLoadingMessages,
        initialMessageId,
        createMessage
    } = useConversationContext();
    const navigate = useNavigate();

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

                <ModelSelect
                    model={conversation.model}
                    models={models}
                    onSelect={model => updateConversation({ model })}
                />

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
                                    deleteConversation();
                                    navigate('/');
                                }
                            }
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
                    />
                )}
            </div>

            <footer className={styles.footer}>
                <MessageForm
                    key={conversation.id}
                    conversationId={conversation.id}
                    placeholder={conversation.model ? 'Message…' : 'Choose a model'}
                    disabled={!conversation.model}
                    onSubmit={createMessage}
                />
            </footer>
        </div>
    );
}