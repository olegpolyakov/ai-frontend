import { type InputEvent, type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react';

import { Box, Button, Flex, Icon, Item, Text } from '@olegpolyakov/ui';
import { NIL, v3 as uuid } from '@olegpolyakov/core/utils/uuid';
import { getFileIconName, getFileSizeString } from '@olegpolyakov/frontend/features/files';
import cn from '@olegpolyakov/frontend/helpers/classnames';
import { useFileInput } from '@olegpolyakov/frontend/hooks/file';

import type { MessageAttachment, MessageData } from '@/features/messages';

import styles from './MessageForm.module.scss';

const SINGLE_LINE_HEIGHT = 28;

export default function MessageForm({
    placeholder,
    actions,
    disabled,
    onSubmit
}: {
    placeholder?: string;
    actions?: ReactNode;
    disabled?: boolean;
    onSubmit: (content: string, attachments?: MessageAttachment[]) => Promise<MessageData>
}) {
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLParagraphElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const attachmentsRef = useRef<MessageAttachment[]>([]);

    const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isMultiline, setMultiline] = useState(false);

    useEffect(() => {
        attachmentsRef.current = attachments;
    }, [attachments]);

    useEffect(() => {
        inputRef.current?.focus();

        const attachments = attachmentsRef.current;

        return () => {
            attachments.forEach(revokePreview);
        };
    }, []);

    useEffect(() => {
        function handlePaste(event: ClipboardEvent) {
            const items = event.clipboardData?.items;

            if (!items) return;

            for (const item of items) {
                if (item.kind !== 'file') continue;
                
                const file = item.getAsFile(); 

                if (!file) return;
      
                event.preventDefault();

                setAttachments(attachments => attachments.concat({
                    id: uuid(file.name, NIL),
                    file,
                    previewUrl: file.type.startsWith('image/')
                        ? URL.createObjectURL(file)
                        : undefined
                }));
            }
        }

        window.addEventListener('paste', handlePaste);

        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, []);

    const submit = () => {
        const content = inputRef.current?.textContent?.trim() ?? '';
        const attachments = attachmentsRef?.current;

        if (content && !attachments || disabled) return;

        setLoading(true);
        setAttachments([]);
        inputRef.current!.textContent = '';

        onSubmit(content, attachments)
            .catch(error => {
                inputRef.current!.textContent = content;
                setAttachments(attachments);
                setError(error as Error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const { pick } = useFileInput({
        multiple: true,
        onChange: (arg?: File | File[]) => {
            if (!arg) return;
    
            const files = Array.isArray(arg) ? arg : [arg];
    
            setAttachments(attachments => attachments.concat(
                files.map(file => ({
                    id: uuid(file.name, NIL),
                    file,
                    previewUrl: file.type.startsWith('image/')
                        ? URL.createObjectURL(file)
                        : undefined
                }))
            ));
        }
    });

    const removeAttachment = (id: string) => {
        setAttachments(attachments => attachments.filter(attachment => {
            if (attachment.id !== id) return true;
            
            revokePreview(attachment);
            
            return false;
        }));
    };

    const handleInput = (event: InputEvent<HTMLParagraphElement>) => {
        // const target = event.target as HTMLParagraphElement;
        // const root = rootRef.current;
        // const actions = actionsRef.current;

        // if (!root || !actions) return;

        // if (!isMultiline) {
        //     if (target.offsetHeight > SINGLE_LINE_HEIGHT) {
        //         setMultiline(true);
        //     }
        // } else {
        //     const range = document.createRange();
        //     range.selectNodeContents(target);
        //     const textWidth = range.getBoundingClientRect().width;
        //     const gapAndPadding = 36; // Padding (12px * 2) + Gap (12px)
        //     const availableNarrowWidth = root.clientWidth - actions.offsetWidth - gapAndPadding;

        //     if (textWidth < availableNarrowWidth) {
        //         setMultiline(false);
        //     }
        // }
    };
    
    const handleKeyDown = (event: KeyboardEvent<HTMLParagraphElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
        }
    };

    const handleFocus = () => {
        setError(null);
    };

    const images = attachments.filter(({ previewUrl }) => previewUrl);
    const files = attachments.filter(({ previewUrl }) => !previewUrl);

    return (
        <Box
            ref={rootRef}
            className={cn(styles.root, isMultiline && styles.multiline)}
            shape="rounded-m"
            variant="outlined-tinted"
        >
            {attachments.length > 0 && (
                <div className={styles.attachments}>
                    {!isLoading && images.length > 0 && (
                        <div className={styles.images}>
                            {images.map(image => (
                                <div
                                    key={image.id}
                                    className={styles.image}
                                    style={{
                                        backgroundImage: `url(${image.previewUrl})`
                                    }}
                                >
                                    {!isLoading && (
                                        <Button
                                            className={styles.removeButton}
                                            icon="remove"
                                            title="Remove the image"
                                            size="xs"
                                            variant="filled"
                                            onClick={() => removeAttachment(image.id)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && files.length > 0 && (
                        <div className={styles.files}>
                            {files.map(({ id, file }) => (
                                <Item
                                    key={id}
                                    className={styles.file}
                                    start={<Icon name={getFileIconName(file.name)} />}
                                    end={!isLoading && (
                                        <Button
                                            icon="remove"
                                            title="Remove the file"
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

            <p
                ref={inputRef}
                className={styles.input}
                data-placeholder={placeholder}
                contentEditable
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onInput={handleInput}
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

            <div
                ref={actionsRef}
                className={styles.actions}
            >
                {actions}

                <Button
                    className={styles.fileButton}
                    icon="attach_file"
                    title="Attach a file"
                    variant="tinted"
                    disabled={disabled || isLoading}
                    onClick={pick}
                />

                <Button
                    className={styles.sendButton}
                    icon="send"
                    title="Send the message"
                    color="brand"
                    variant="filled"
                    loading={isLoading}
                    disabled={disabled || isLoading}
                    onClick={submit}
                />
            </div>
        </Box>
    );
}

function revokePreview({ previewUrl }: MessageAttachment) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
}