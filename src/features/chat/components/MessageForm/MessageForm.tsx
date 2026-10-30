import {
    type KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';

import { Button, Flex, Icon, Item, Text, Textarea } from '@olegpolyakov/ui';
import { useFileInput } from '@olegpolyakov/frontend/hooks/file';

import { getFileIconName, getFileSizeString } from '../../helpers';

import styles from './MessageForm.module.scss';

type Attachment = {
    id: string;
    file: File;
    previewUrl?: string;
};

export default function MessageForm({
    conversationId,
    placeholder,
    disabled,
    onSubmit
}: {
    conversationId?: string;
    placeholder?: string;
    disabled?: boolean;
    onSubmit: (message: string, files: File[]) => Promise<unknown>;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { pick } = useFileInput({
        multiple: true,
        onChange: (arg?: File | File[]) => {
            if (!arg) return;

            const files = Array.isArray(arg) ? arg : [arg];

            setAttachments(attachments => attachments.concat(
                files.map(file => ({
                    id: nextAttachmentId(),
                    file,
                    previewUrl: file.type.startsWith('image/')
                        ? URL.createObjectURL(file)
                        : undefined
                }))
            ));
        }
    });

    const attachmentsRef = useRef<Attachment[]>([]);

    useEffect(() => {
        attachmentsRef.current = attachments;
    }, [attachments]);

    useEffect(() => {
        return () => {
            attachmentsRef.current.forEach(revokePreview);
        };
    }, []);

    useEffect(() => {
        if (!conversationId) return;

        const value = globalThis.localStorage.getItem(getLocalStorageKey(conversationId));

        if (value) {
            setMessage(value);
        }

        const textarea = textareaRef.current;

        return () => {
            if (textarea?.value) {
                globalThis.localStorage.setItem(getLocalStorageKey(conversationId), textarea?.value);
            } else {
                globalThis.localStorage.removeItem(getLocalStorageKey(conversationId));
            }
        };
    }, [conversationId]);

    const removeAttachment = useCallback((id: string) => {
        setAttachments(attachments => attachments.filter(attachment => {
            if (attachment.id !== id) return true;

            revokePreview(attachment);

            return false;
        }));
    }, []);

    const handleSubmit = useCallback(() => {
        if (loading || (!message.trim() && !attachments.length)) return;

        const prevMessage = message;

        setLoading(true);
        setMessage('');

        onSubmit(message, attachments.map(({ file }) => file))
            .then(() => {
                attachments.forEach(revokePreview);
                setAttachments([]);
                setError(null);

                globalThis.localStorage.removeItem(getLocalStorageKey(conversationId));
            })
            .catch((error: Error) => {
                setMessage(prevMessage);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [message, attachments, loading, conversationId, onSubmit]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();

            handleSubmit();
        }
    }, [handleSubmit]);

    const images = attachments.filter(({ previewUrl }) => previewUrl);
    const files = attachments.filter(({ previewUrl }) => !previewUrl);

    return (
        <div className={styles.root}>
            {attachments.length > 0 && (
                <div className={styles.attachments}>
                    {!loading && images.length > 0 && (
                        <div className={styles.images}>
                            {images.map(image => (
                                <div
                                    key={image.id}
                                    className={styles.image}
                                    style={{ backgroundImage: `url(${image.previewUrl})` }}
                                >
                                    {!loading && (
                                        <Button
                                            className={styles.removeButton}
                                            icon="remove"
                                            title="Убрать вложение"
                                            size="xs"
                                            variant="filled"
                                            onClick={() => removeAttachment(image.id)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && files.length > 0 && (
                        <div className={styles.files}>
                            {files.map(({ id, file }) => (
                                <Item
                                    key={id}
                                    className={styles.file}
                                    start={<Icon name={getFileIconName(file.name)} />}
                                    end={!loading && (
                                        <Button
                                            icon="close"
                                            title="Убрать вложение"
                                            size="s"
                                            variant="filled"
                                            onClick={() => removeAttachment(id)}
                                        />
                                    )}
                                    shape="rounded-m"
                                    variant="outlined"
                                >
                                    <Flex
                                        column
                                        gap="xxs"
                                    >
                                        <Text
                                            content={file.name}
                                            size="s"
                                        />

                                        <Text
                                            content={getFileSizeString(file.size)}
                                            size="xs"
                                            color="tertiary"
                                        />
                                    </Flex>
                                </Item>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className={styles.row}>
                <div className={styles.textarea}>
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        placeholder={loading ? 'Sending...' : placeholder}
                        disabled={disabled || loading}
                        onChange={({ value }) => setMessage(value!)}
                        onKeyDown={handleKeyDown}
                    />

                    {error && (
                        <Text
                            content={`Error sending the message: ${error.message}`}
                            color="danger"
                            size="xs"
                            start={
                                <Icon
                                    name="error"
                                    color="danger"
                                    size="s"
                                />
                            }
                        />
                    )}
                </div>

                <Button
                    className={styles.fileButton}
                    icon="attach_file"
                    title="Attach a file"
                    variant="tinted"
                    disabled={disabled || loading}
                    onClick={pick}
                />

                <Button
                    className={styles.sendButton}
                    icon="send"
                    title="Send the message"
                    color="brand"
                    variant="filled"
                    loading={loading}
                    disabled={disabled || loading || (!message.trim().length && !attachments.length)}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}

let attachmentId = 0;

function nextAttachmentId() {
    return `attachment-${++attachmentId}`;
}

function revokePreview({ previewUrl }: Attachment) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
}

function getLocalStorageKey(conversationId = '') {
    return `ai.chat.conversation.${conversationId}.message`;
}