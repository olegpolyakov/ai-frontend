import { Field, Select } from '@olegpolyakov/ui';

import useChatContext from '@/features/chat/hooks/useChatContext';

export default function EmbedSettings() {
    const { models } = useChatContext();

    const embedModels = models.filter(m => m.id.includes('embed'));

    return (
        <div>
            <Field
                label="Embed model"
                orientation="horizontal"
            >
                <Select
                    options={embedModels.map(m => ({
                        key: m.id,
                        value: m.id,
                        content: m.id
                    }))}
                />
            </Field>
        </div>
    );
}