import { useState } from 'react';

import { Button, Menu } from '@olegpolyakov/ui';

import { isMessageEditable } from '../../helpers';
import type { MessageData } from '../../types';

export default function MessageMenu({
    message,
    onEdit,
    onDelete
}: {
    message: MessageData;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const [isEditable] = useState(() => isMessageEditable(message));

    if (!message.isMine) return null;

    return (
        <Menu
            trigger={
                <Button
                    title="Message Menu"
                    icon="more_vert"
                    size="xs"
                    variant="plain"
                />
            }
            items={[
                {
                    key: 'edit',
                    icon: 'edit',
                    content: 'Edit',
                    size: 's',
                    disabled: !isEditable,
                    onClick: onEdit
                },
                {
                    key: 'delete',
                    icon: {
                        name: 'delete',
                        color: 'danger'
                    },
                    content: 'Delete',
                    size: 's',
                    color: 'danger',
                    disabled: !isEditable,
                    onClick: onDelete
                }
            ]}
        />
    );
}