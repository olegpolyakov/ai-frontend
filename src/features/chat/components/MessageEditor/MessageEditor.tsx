import { type KeyboardEvent, useCallback, useState } from 'react';

import { Button, Icon, Text, Textarea } from '@olegpolyakov/ui';

import styles from './MessageEditor.module.scss';

export default function MessageEditor({
    content,
    onSubmit,
    onCancel
}: {
    content: string;
    onSubmit: (content: string) => Promise<unknown>;
    onCancel: () => void;
}) {
    const [value, setValue] = useState(content);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const trimmedValue = value.trim();
    const isEmpty = !trimmedValue;

    const handleSubmit = useCallback(() => {
        if (loading || isEmpty) return;

        if (trimmedValue === content) {
            return onCancel();
        }

        setHasError(false);
        setLoading(true);
        onSubmit(trimmedValue)
            .catch(() => {
                setHasError(true);
                setLoading(false);
            });
    }, [trimmedValue, isEmpty, content, loading, onSubmit, onCancel]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();

            return onCancel();
        }

        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();

            handleSubmit();
        }
    }, [handleSubmit, onCancel]);

    return (
        <div className={styles.root}>
            <Textarea
                value={value}
                disabled={loading}
                // minRows={1}
                // maxRows={8}
                autoFocus
                onChange={({value}) => setValue(value!)}
                onKeyDown={handleKeyDown}
            />

            {hasError && (
                <Text
                    content="Не удалось изменить сообщение. Попробуйте снова"
                    color="danger"
                    size="xs"
                    start={<Icon name="error" size="s" />}
                />
            )}

            <div className={styles.buttons}>
                <Button
                    content="Отмена"
                    size="s"
                    variant="filled"
                    disabled={loading}
                    onClick={onCancel}
                />

                <Button
                    content="Сохранить"
                    size="s"
                    variant="filled"
                    disabled={isEmpty}
                    loading={loading}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}