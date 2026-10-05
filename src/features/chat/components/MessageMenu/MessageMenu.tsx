import { useState } from 'react';

import { Button, Menu } from '@olegpolyakov/ui';

import useChatContext from '../../hooks/useChatContext';
import type { Message } from '../../types';

const EDIT_WINDOW = 1000 * 60 * 30; // 30 minutes

export default function MessageMenu({ message, onEdit }: {
    message: Message;
    onEdit: () => void;
}) {
    const { chat } = useChatContext();

    const [isEditable] = useState(() => Date.now() - new Date(message.createdAt).getTime() < EDIT_WINDOW);

    if (!message.isMine) return null;

    return (
        <Menu
            trigger={
                <Button
                    icon="more_horiz"
                    size="xs"
                    variant="plain"
                    title="Меню сообщения"
                />
            }
            items={[
                {
                    key: 'edit',
                    content: 'Изменить',
                    size: 's',
                    disabled: !isEditable,
                    onClick: onEdit
                },
                {
                    key: 'delete',
                    content: 'Удалить',
                    size: 's',
                    color: 'danger',
                    disabled: !isEditable,
                    onClick: () => chat.deleteMessage(message.id)
                }
            ]}
        />
    );
}