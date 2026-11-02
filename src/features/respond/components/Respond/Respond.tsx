import { useCallback, useRef, useState } from 'react';

import { Button, Flex, Heading, Icon, State } from '@olegpolyakov/ui';
import { type EntityRef, isEntityRef } from '@olegpolyakov/core/objects/ref';
import { NIL, v4 as uuid } from '@olegpolyakov/core/utils/uuid';
import cn from '@olegpolyakov/frontend/helpers/classnames';
import { useLocalStorage } from '@olegpolyakov/frontend/hooks/local-storage';

import { Message, MessageAttachment, MessageData, MessageForm, Messages } from '@/features/messages';
import { enrichMessages } from '@/features/messages/helpers';
import { ModelSelect } from '@/features/models';

import useRespondApi from '../../hooks/useRespondApi';

import styles from './Respond.module.scss';

export default function Respond() {
    const api = useRespondApi();

    const [messages, setMessages] = useState<MessageData[]>([]);
    const [model, setModel] = useLocalStorage('ai.respond.model');
    const filesRef = useRef<Record<string, File>>({});

    const getResponse = useCallback(async (content: string, attachments: MessageAttachment[] = []) => {
        if (!model) throw new Error('Model is not selected');

        const newMessage: MessageData = {
            id: uuid(),
            conversationId: NIL,
            content,
            role: 'user',
            refs: attachments.map(({ id }) => ({ kind: 'entity', id } as EntityRef)),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const newMssages = [...messages, newMessage];

        filesRef.current = {
            ...filesRef.current,
            ...Object.fromEntries(attachments.map(({ id, file }) => [id, file]))
        };

        const files = newMssages.flatMap(m => m.refs)
            .filter(isEntityRef)
            .map(r => filesRef.current[r.id]);

        setMessages(newMssages);

        const response = await api.getResponse(newMssages, files, { model });
        
        setMessages([...newMssages, response.data]);

        return response.data;
    }, [api, messages, model]);

    const updateMessage = useCallback(async (messageId: string, content: string) => {
        setMessages(messages => messages.map(m => m.id !== messageId ? m : { ...m, content }));
    }, []);
    
    const deleteMessage = useCallback(async (messageId: string) => {
        setMessages(messages => messages.filter(m => m.id !== messageId));
    }, []);

    const saveAsConversation = useCallback(() => {}, []);

    const startNewSession = useCallback(() => {
        if (confirm('Are you sure you want ot start a new session? This one will be deleted!')) {
            setMessages([]);
            filesRef.current = {};
        }
    }, []);

    return (
        <div className={cn(styles.root, messages.length === 0 && styles.empty)}>
            {messages.length > 0 &&
                <header className={styles.header}>
                    <Heading content="Quick Response" />

                    <Flex gap="xs">
                        {/* <Button
                            icon="save"
                            title="Save as a conversation"
                            onClick={saveAsConversation}
                        /> */}

                        <Button
                            icon="add"
                            title="Create a new session"
                            onClick={startNewSession}
                        />
                    </Flex>
                </header>
            }

            <div className={styles.body}>
                {messages.length === 0 ?
                    <State
                        image={
                            <Icon
                                name="quickreply"
                                size="xl"
                            />
                        }
                        title="Quick Reponse"
                        description="Get a response without creating a conversation"
                    />
                    :
                    <Messages
                        messages={enrichMessages(messages)}
                    >
                        {message =>
                            <Message
                                message={message as MessageData}
                                onUpdate={updateMessage}
                                onDelete={deleteMessage}
                            />
                        }
                    </Messages>
                }
            </div>

            
            <footer className={styles.footer}>
                <MessageForm
                    placeholder="What's on your mind?"
                    actions={
                        <ModelSelect
                            model={model}
                            onSelect={setModel}
                        />
                    }
                    disabled={!model}
                    onSubmit={getResponse}
                />
            </footer>
        </div>
    );
}