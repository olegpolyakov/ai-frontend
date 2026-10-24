import { type FunctionComponent, useCallback, useState } from 'react';

import { Button, Icon, Input, List, Popover, Scrollable } from '@olegpolyakov/ui';

import AnthropicIcon from '@/assets/images/anthropic.svg';
import DashScopeIcon from '@/assets/images/dashscope.svg';
import DeepSeekIcon from '@/assets/images/deepseek.svg';
import GeminiIcon from '@/assets/images/gemini.svg';
import JevIcon from '@/assets/images/jev.svg';
import MoonshotIcon from '@/assets/images/moonshot.svg';
import OpenAIIcon from '@/assets/images/openai.svg';
import XAIIcon from '@/assets/images/xai.svg';
import XiaomiIcon from '@/assets/images/xiaomi.svg';
import YandexIcon from '@/assets/images/yandex.svg';
import ZAIIcon from '@/assets/images/zai.svg';

import type { Model } from '../../types';

import styles from './ModelSelect.module.scss';

const providerIcons: Record<string, FunctionComponent> = {
    anthropic: AnthropicIcon,
    deepseek: DeepSeekIcon,
    gemini: GeminiIcon,
    zai: ZAIIcon,
    xai: XAIIcon,
    jev: JevIcon,
    moonshot: MoonshotIcon,
    xiaomi: XiaomiIcon,
    openai: OpenAIIcon,
    dashscope: DashScopeIcon,
    yandex: YandexIcon
};

export default function ModelSelect({
    model = '',
    models = [],
    onSelect
}: {
    model?: string,
    models: Model[],
    onSelect: (model: string) => void;
}) {
    const [query, setQuery] = useState('');
    const [isOpen, setOpen] = useState(false);

    const select = useCallback((model: string) => {
        onSelect(model);
        setOpen(false);
    }, [onSelect]);

    const [provider, name] = model.split('/');

    const filteredModels = models.filter(m => m.id.includes(query));

    return (
        <Popover
            open={isOpen}
            trigger={
                <Button
                    icon={
                        <Icon className={styles.icon}>
                            <ProviderIcon provider={provider} />
                        </Icon>
                    }
                    content={name ? formatName(name) : 'Select Model'}
                    onClick={() => setOpen(true)}
                />
            }
            placement="bottom-end"
            onClose={() => setOpen(false)}
        >
            <div className={styles.container}>
                <Input
                    start={<Icon name="search" />}
                    placeholder="Search"
                    value={query}
                    onChange={({ value }) => setQuery(value)}
                />
            </div>

            <Scrollable maxHeight={300}>
                <List
                    items={filteredModels.map(model => ({
                        key: model.id,
                        start: <ProviderIcon provider={model.provider} />,
                        content: model.name && formatName(model.name),
                        variant: 'plain',
                        onClick: () => select(model.id)
                    }))}
                    size="s"
                    interactive
                />
            </Scrollable>
        </Popover>
    );
}

function formatName(name: string) {
    return (
        <span className={styles.name}>
            {name.replaceAll('-', ' ')}
        </span>
    );
}

function ProviderIcon({ provider }: { provider: string }) {
    const Component = providerIcons[provider];

    if (!Component) return null;

    return (
        <div className={`${styles.icon} ${styles[provider]}`}>
            <Component />
        </div>
    );
}