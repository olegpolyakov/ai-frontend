import { useState } from 'react';

import { Box, Button, Flex, Heading, Input, Select } from '@olegpolyakov/ui';

import type { Integration, IntegrationType } from '../../types';

export default function IntegrationForm({
    title,
    data = {},
    onSubmit,
    onCancel
}: {
    title?: string;
    data?: Partial<Integration>;
    onSubmit: (data: Partial<Integration>) => Promise<void>;
    onCancel: () => void;
}) {
    const [type, setType] = useState<IntegrationType>(data?.type ?? 'mcp');
    const [name, setName] = useState(data?.name ?? '');
    const [url, setUrl] = useState(data?.url ?? '');

    return (
        <Box
            shape="rounded-m"
            variant="outlined-tinted"
            padding="s"
            interactive={false}
        >
            <Flex
                column
                gap="s"
            >
                {title &&
                    <Heading
                        content={title}
                        size="xs"
                    />
                }

                <Select
                    name="type"
                    value={type}
                    label="Type"
                    options={[
                        { key: 'mcp', value: 'mcp', content: 'MCP' }
                    ]}
                    onChange={({ value }) => setType(value as IntegrationType)}
                />

                <Input
                    name="name"
                    value={name}
                    label="Name"
                    onChange={({ value }) => setName(value)}
                />

                <Input
                    name="url"
                    value={url}
                    label="URL"
                    onChange={({ value }) => setUrl(value)}
                />

                <Button
                    content={data?.id ? 'Update' : 'Create'}
                    color="brand"
                    variant="filled"
                    onClick={() => onSubmit({
                        type,
                        name,
                        url
                    })}
                />

                <Button
                    content="Cancel"
                    onClick={onCancel}
                />
            </Flex>
        </Box>
    );
}